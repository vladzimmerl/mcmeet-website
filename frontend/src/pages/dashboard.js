import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

import BookingCard from "../components/bookingCard/BookingCard";
import './dashboard.css'


const Overview = () => {
    let navigate = useNavigate(); 

    //const [bookings, setBookings] = useState()
    const [pastBookings, setPastBookings] = useState();
    const [futureBookings, setFutureBookings] = useState();

    const getBookings = async () => {
        // try to fetch the bookings
        try {
            const res = await axios.get('https://mcmeet-13f052a6cf31.herokuapp.com/api/getMeetings', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                }
            })
            // success
            //setBookings(res.data.meetings)
            setPastBookings(res.data.pastBookings);
            setFutureBookings(res.data.futureBookings);
        }
        catch (err) {
            if (err.response.status === 401) {
                // error
                localStorage.removeItem('user');
                window.dispatchEvent(new Event("storage"));
                navigate('/login');
            }
        }
    }

    const removeMeeting = async (meetingId) => {        
        try {
            const res = await axios.post('https://mcmeet-13f052a6cf31.herokuapp.com/api/removeMeeting', 
                {meetingId}, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('user')}`
                    }
                }
            );
            if (res.data) {
                console.log('test')
                navigate(0);
            }
        }
        catch (err) {
            if (err.response.status === 401) {
                // error
                localStorage.removeItem('user');
                window.dispatchEvent(new Event("storage"));
                navigate('/login');
            }
            else if (err.response.status === 409) {
                // refresh page
                window.location.reload();
            }
        }
    }

    useEffect(() => {
        getBookings();
    }, [])

    return ( // .filter(a => new Date(a.date) < new Date(new Date().toLocaleDateString() + "T00:00:00"))
        <div className="overview">
            <div className="bookings-container">
                <h2 className="label">Past Meetings (Before Today)</h2>
                {typeof pastBookings === 'undefined' ? "LOADING..." : pastBookings.length === 0 ? <p>No meetings</p> : pastBookings.map((booking) => (
                    <BookingCard 
                        title={booking.title} 
                        date={booking.date} 
                        organizer={booking.organizer}
                        time={booking.time.start + " to " + booking.time.end}
                        key={booking.id}
                        id={booking.id}
                        type={booking.type}
                        url={booking.url}
                        capacity={(booking.participants.length-1) + "/" + (booking.capacity-1)}
                        removeMeeting={removeMeeting} />
                ))}
            </div>
            <div className="bookings-container">
                <h2 className="label">Upcoming Meetings (Today and after)</h2>
                {typeof futureBookings === 'undefined' ? "LOADING..." : futureBookings.length === 0 ? <p>No meetings</p> : futureBookings.map((booking) => (
                    <BookingCard 
                        title={booking.title} 
                        date={booking.date} 
                        organizer={booking.organizer}
                        time={booking.time.start + " to " + booking.time.end}
                        key={booking.id}
                        id={booking.id}
                        type={booking.type}
                        url={booking.url}
                        capacity={(booking.participants.length-1) + "/" + (booking.capacity-1)}
                        removeMeeting={removeMeeting} />
                ))}
            </div>
        </div>
    );
};

export default Overview;