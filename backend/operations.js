const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
    try {
    await mongoose.connect(process.env.MONGO_URI);
  
    console.log('MongoDB database connected');
    } catch {
        console.log('MongoDB database connection failed');
        (err => console.error('Error connecting to MongoDB database:', err));
    }
  }

// ========== TABLES ==========

/*
Members
Meetings
Bookings
Requests
*/

const memberSchema = new mongoose.Schema({
    email: String,
    password: String
  });
const Member = mongoose.model('Member', memberSchema);

const meetingSchema = new mongoose.Schema({
    title: String,
    date: String,
    organizer: String,
    time: String,
    key: Number,
    capacity: Number,
    bookingId: String,
    participants: String,
    type: String,
    url: String
});
const Meeting = mongoose.model('Meeting', meetingSchema);
//userId:organizer, title, dateRange:date, timeRange:time, isRecurring, capacity ,., availability, type, key
const bookingSchema = new mongoose.Schema({
    bookingId:Number,
    email:String,
    meetingId: Number
});
const Booking = mongoose.model('Booking', bookingSchema);

const requestSchema = new mongoose.Schema({
    title: String,
    user: String,
    withWho: String,
    option1: String,
    option2: String,
    option3: String
});
const Request = mongoose.model('Request', requestSchema);

// userId is an email, but not all emails are userIds



// ========== AUTHENTICATION ===============


async function register(email, password){  // return: void
    await main();
    const user = new Member({email: email, password: password});
    await user.save();
}

async function accountExists(email){  // return: bool
    await main();
    const members = await Member.find({email:email}).exec();
    return members.length != 0
}

async function login(userId, password){  // return: bool
    await main();
    const member = await Member.findOne({email:userId}).exec();
    return member?.password == password;
}


// ========== MEETINGS ==========


async function getMeetings(userId){
    await main();
    const meetings = await Meeting.find({ participants: { $regex: userId } })
    let res = [];
    meetings.forEach(item => {
        res.push({
            title: item.title,
            date: item.date,
            time: JSON.parse(item.time),
            organizer: item.organizer,
            capacity: item.capacity,
            participants: JSON.parse(item.participants),
            id: item._id,
            type: item.type,
            url: item.url
        });
    })

    return res;
}

async function removeMeeting(meetingId){
    await main();
    await Meeting.deleteOne({_id: meetingId})
}

async function removeParticipant(meetingId, user){
    await main();

    const meeting = await Meeting.findOne({_id: meetingId});
    let par = JSON.parse(meeting.participants);
    par = par.filter(el => el !== user);

    meeting.participants = JSON.stringify(par);
    meeting.save();
}

async function createMeeting(userId, title, dateRange, timeRange, capacity, bookingId, isRecurring, url){
    await main();
    const meeting = new Meeting({
                        organizer: userId, 
                        title: title, 
                        date: dateRange, 
                        time: JSON.stringify(timeRange),
                        capacity: capacity,
                        bookingId: bookingId,
                        participants: JSON.stringify([userId]),
                        type: isRecurring,
                        url: url
    });
    await meeting.save();
    return meeting._id;
}

async function getMeetingById(id){
    await main();
    return await Meeting.find({_id: id});
}

async function getMeetingsById(id){ 
    await main();
    const meetings = await Meeting.find({bookingId: id});

    let res = [];
    meetings.forEach(item => {
        res.push({
            title: item.title,
            date: item.date,
            time: JSON.parse(item.time),
            organizer: item.organizer,
            capacity: item.capacity,
            participants: JSON.parse(item.participants),
            id: JSON.parse(JSON.stringify(item._id))
        });
    })

    return res;
}

async function addParticipant(meetingId, email){
    await main();
    const meeting = await Meeting.findOne({_id: meetingId});
    const par = JSON.parse(meeting.participants)
    par.push(email)

    meeting.participants = JSON.stringify(par);
    meeting.save();
}


// ========== REQUESTS ==========


async function createRequest(title, user, withWho, option1, option2, option3){ 
    await main();
    const request = new Request({
                        title: title, 
                        user: user, 
                        withWho: withWho, 
                        option1: JSON.stringify(option1), 
                        option2: JSON.stringify(option2), 
                        option3: JSON.stringify(option3)
    });
    await request.save();
}

async function getAllRequests(user){ // return: {[reqId, title, withWho, option1, option2, option3]}
    await main();
    const requests = await Request.find({withWho: user});
    let res = []
    requests.forEach(unit => {
        res.push({
            title: unit.title, 
            withWho: unit.withWho,
            option1: JSON.parse(unit.option1),
            option2: JSON.parse(unit.option2),
            option3: JSON.parse(unit.option3),
            id: unit._id,
            organizer: unit.user,
        });
    });
    return res;
}

async function getRequestById(id){
    await main();
    const request = await Request.find({_id: id});
    return request[0];
}

async function removeRequest(id) {
    await main();

    await Request.deleteOne({_id: id});
}


// ========== EXPORTS ==========


module.exports = {
    register, accountExists, login, getMeetings, createMeeting, addParticipant,
    createRequest, getAllRequests, getMeetingsById, getMeetingById, removeMeeting, 
    removeParticipant, getRequestById, removeRequest
}
