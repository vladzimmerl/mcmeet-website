import {useState, useEffect} from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import './acceptBooking.css'
import BookingRequestCard from "../components/bookingRequestCard/BookingRequestCard";
import { useNavigate } from 'react-router-dom';

const AcceptBooking = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [logged, setLogged] = useState(false);
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState([]);

    const getEmail = async () => {
        try {
            const res = await axios.get("https://mcmeet-13f052a6cf31.herokuapp.com/api/email", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                }
            })
            setEmail(res.data)
            if (res.data !== "") {
                setLogged(true);
            }
        }
        catch (err) {
            // error
            console.log(err.response ? err.response.data : "error: no connection")
        }
    }

    const getMeetings = async () => {
        // try to fetch the bookings 
        try {
            const res = await axios.get(`https://mcmeet-13f052a6cf31.herokuapp.com/api/getMeetingsById/${id}`)
            // success
            setBookings(res.data.meetings);
        }
        catch (err) {
            // error
            console.log(err.response ? err.response.data : "error: no connection")
        }
    }

    const bookMeeting = async (meetingId) => {
        // check if there is an email
        if (!email) {
            alert("please enter a email")
            return;
        }
        
        // attempt to book the meeting
        try {
            const res = await axios.post('https://mcmeet-13f052a6cf31.herokuapp.com/api/bookMeeting', {email, meetingId})
            window.location.reload();
        }
        catch (err) {
            if (err.response.status === 400) {
                alert(err.response ? err.response.data : "error: no connection");
            }
        }
        
    }

    useEffect(() => {
        getMeetings()
        getEmail()
    }, [])

    return (
        <div className="accept-booking">
            <div className="bookings-container">
                <h1>Book a Meeting</h1>
                {!logged ?
                <div>
                    <p>Enter your email:</p>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />    
                </div>
                :
                <div></div>
                }
                {bookings.map((booking) => (
                    <BookingRequestCard 
                    title={booking.title} 
                    date={booking.date} 
                    organizer={booking.organizer}
                    time={booking.time.start + " to " + booking.time.end}
                    id={booking.id}
                    key={booking.id}
                    capacity={(booking.participants.length-1) + "/" + (booking.capacity-1)}
                    attending={booking.participants.includes(email)}
                    bookMeeting={bookMeeting}
                    />
                ))}
            </div>
        </div>
    )
}

export default AcceptBooking