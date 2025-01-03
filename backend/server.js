const express = require('express')
const db = require('./operations')
const be = require('./backend')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const PORT = process.env.PORT;
const EXP = '8h'
const SECRET = process.env.JWT_SECRET


// ========== MIDDLEWARE ==========


const app = express()
app.use(cors({origin: ['https://mcmeet-frontend-deployment.pages.dev', 'https://mcmeet-demo.vladzimmerl.com']}))
app.use(express.json())


// ========== STATUS ==========


app.get("/api", (req, res) => {
    return res.json("api functional")
})


// ========== SERVER FAIL PROTECTION ============


const serverSafety = async (res, serverProcess) => {
    try{
        await serverProcess()
    } catch (err){
        // log the error and try to send it to the server
        // if this also results in an error, catch and log it
        console.log("SERVER ERROR: " + err)
        try {res.status(500).json("SERVER ERROR: " + err)}
        catch (err) {
            console.log("ERROR RESPONSE NOT SENT: " + err)
        }
    }
}


// ========== AUTHENTICATION ============


// middleware function to check if the token is valid
const authenticateToken = async (req, res, next) => serverSafety(res, async () => {
    if (req.headers.authorization == null){
        console.log("no auth header")
        return res.status(401).json("error: no saved user. Please Login.");
    }
    const bearerToken = req.headers.authorization.split(" ")
    if (bearerToken.length != 2 || bearerToken["0"] != "Bearer"){
        console.log("invalid auth header")
        return res.status(401).json("error: invalid user. Please Login.");
    }
    const token = bearerToken[1]

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(401).json("error: invalid user. Please Login.");
        }
        
        req.user = user.email
        next()
    })
})

// return: void
app.post("/api/auth/register", async (req, res) => serverSafety(res, async () => {
    const {email, password} = req.body

    console.log('server test');

    if (await db.accountExists(email)){
        return res.status(400).json("error: an account with this email already exists")
    }
    if (!be.validEmail(email)){
        return res.status(400).json("error: the email must be a valid email")
    }
    await db.register(email, be.hashPassword(password))
    return res.status(200).json("success")
}))

// return: token
app.post("/api/auth/login", async (req, res) => serverSafety(res, async () => {
    const {email, password} = req.body

    if (await db.login(email, be.hashPassword(password))){
        token = jwt.sign({email}, SECRET, {expiresIn: EXP})
        return res.status(200).json(token)
    }
    return res.status(400).json("error: invalid email or password")
}))

// return: users email
app.get('/api/email', async (req, res) => serverSafety(res, async () => {
    const bearerToken = req.headers.authorization.split(" ")
    const token = bearerToken[1]

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(200).json("")
        }
        return res.status(200).json(user.email)
    })
}))


// ========== MEETINGS ==========


// return: full url for created meetings
app.post("/api/createBooking", authenticateToken, async (req, res) => serverSafety(res, async () => {
    const user = req.user
    const {title, dateRange, timeRange, isRecurring, capacity} = req.body

    // create a booking ID
    const bookingId = be.createURL();
    // go through every day in the time range and create a meeting for the day if needed
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    let curday = new Date(dateRange.start + "T00:00:00");
    let endDate = new Date(dateRange.end + "T00:00:00");
    
    while (curday <= endDate) {
        // check if there should be a meeting on this day
        const day_of_week = daysOfWeek[curday.getDay()];
        if (timeRange[day_of_week].checked == true) {
            // create a meeting for this day
            await db.createMeeting(
                user, 
                title, 
                curday.toLocaleDateString(), 
                { start: timeRange[day_of_week].start, end: timeRange[day_of_week].end },
                parseInt(capacity)+1,
                bookingId,
                isRecurring,
                `https://mcmeet-frontend-deployment.pages.dev/accept-booking/` + bookingId
            )
        }

        curday.setDate(curday.getDate() + 1);
    }

    // return the url for the meetings
    return res.status(200).json({url: `https://mcmeet-frontend-deployment.pages.dev/accept-booking/` + bookingId}) //send full url
}))

// return: list of meetings where the user is a participant
app.get("/api/getMeetings", authenticateToken, async (req, res) => serverSafety(res, async () => {
    const user = req.user;
    const meetings = await db.getMeetings(user);

    //console.log(meetings)
    //console.log(new Date(meetings[0].date).getTime() + "T00:00:00")
    //console.log(new Date(new Date().toLocaleDateString()).getTime() + "T00:00:00")

    // sort meetings
    const pastMeetings = meetings.filter(a => new Date(a.date).getTime() + "T00:00:00" < new Date(new Date().toLocaleDateString()).getTime() + "T00:00:00")
    const futureMeetings = meetings.filter(a => new Date(a.date).getTime() + "T00:00:00" >= new Date(new Date().toLocaleDateString()).getTime() + "T00:00:00")

    pastMeetings.sort((a,b) => (new Date(a.date).getTime()) - (new Date(b.date).getTime()))
    futureMeetings.sort((a,b) => (new Date(a.date).getTime()) - (new Date(b.date).getTime()))

    res.status(200).json({pastBookings: pastMeetings, futureBookings: futureMeetings})
}))

// return: list of meetings coresponding to a booking ID /:id
app.get("/api/getMeetingsById/:id", async (req, res) => serverSafety(res, async () => {
    const id = req.params.id
    
    
    res.status(200).json({meetings: await db.getMeetingsById(id)})
}))

// return: bool
app.post("/api/bookMeeting", async (req, res) => serverSafety(res, async () => {
    const {email, meetingId} = req.body;

    if (!be.validEmail(email)){
        return res.status(400).json("error: please enter a valid email")
    }

    // check if there is room in the meeting
    const meeting = await db.getMeetingById(meetingId);

    const num_participants = JSON.parse(meeting[0].participants).length;
    const cap = meeting[0].capacity;

    const room = cap - num_participants;

    if (room >= 1) {
        // there is enough room, add this email to participants
        await db.addParticipant(meetingId, email);
        return res.status(200).json("success")
    }
    return res.status(400).json("error: no room for this meeting")
}))

// return: bool
app.post("/api/removeMeeting", authenticateToken, async (req, res) => serverSafety(res, async () => {
    const user = req.user
    const {meetingId} = req.body 

    const meeting = await db.getMeetingById(meetingId);
    // check if meeting exists
    if (meeting.length === 0) {
        return res.status(409).json(false)
    }
    
    const organizer = meeting[0].organizer;

    

    // check if current user is organizer or participant
    if (user === organizer) {
        await db.removeMeeting(meetingId);
    }
    else {
        await db.removeParticipant(meetingId, user);
    }
    return res.status(200).json(true);
}))


// ========== REQUESTS ==========


// return: void
app.post("/api/createRequest", authenticateToken, async (req, res) => serverSafety(res, async () => {
    const user = req.user;
    const {who, title, option1, option2, option3} = req.body;

    // check that user is not the same as who
    if (user === who) {
        return res.status(400).json("error: cannot request yourself");
    }

    // check that who is a valid email
    const isUser = await db.accountExists(who)
    if (!isUser) {
        return res.status(400).json("error: make sure the person your requesting to is a member");
    }

    // create the request
    await db.createRequest(title, user, who, option1, option2, option3);

    return res.status(200).json("success")
}))

// return: list of incoming requests
app.get("/api/getRequests", authenticateToken, async (req, res) => serverSafety(res, async () => {
    const user = req.user
    
    res.status(200).json({requests: await db.getAllRequests(user)})
}))

// return: void
app.post("/api/acceptRequest", authenticateToken, async (req, res) => serverSafety(res, async () => {
    const user = req.user
    const {id, option} = req.body

    console.log('option:', option)

    // get the target request
    const request = await db.getRequestById(id);

    let date;
    let time;
    if (option === "1") {
        date = JSON.parse(request.option1).date,
        time = {start: JSON.parse(request.option1).start, end: JSON.parse(request.option1).end}
    }
    else if (option === "2") {
        date = JSON.parse(request.option2).date,
        time = {start: JSON.parse(request.option2).start, end: JSON.parse(request.option2).end}
    }
    else if (option === "3") {
        date = JSON.parse(request.option3).date,
        time = {start: JSON.parse(request.option3).start, end: JSON.parse(request.option3).end}
    }
    date = new Date(date + "T00:00:00")
    date = date.toLocaleDateString();
    console.log(date, time)

    // create new meeting
    const meetingId = await db.createMeeting(request.user, request.title, date, time, 2, 'not important')

    // add user to meeting
    await db.addParticipant(meetingId, user);
    
    return res.status(200).json("success")
}))

// return: void
app.post("/api/deleteRequest", authenticateToken, async (req, res) => serverSafety(res, async () => {
    const user = req.user
    const {id} = req.body

    await db.removeRequest(id);

    return res.status(200).json("success");
}))


// ========== START SERVER ==========


app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)})
