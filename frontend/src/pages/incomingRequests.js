import {useState, useEffect} from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import './acceptBooking.css'
import RequestCard from "../components/requestCard";
import { useNavigate } from 'react-router-dom';

const IncomingRequests = () => {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);

    const getRequests = async () => {
        // try to fetch the requests
        try {
            const res = await axios.get(`https://mcmeet-13f052a6cf31.herokuapp.com/api/getRequests`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                }
            })
            // success
            setRequests(res.data.requests);
        }
        catch (err) {
            // error
            console.log(err.response ? err.response.data : "error: no connection")
        }
    }

    const acceptRequest = async (op, id) => {
        try {
            const res = await axios.post('https://mcmeet-13f052a6cf31.herokuapp.com/api/acceptRequest', 
                {id: id, option: op}, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('user')}`
                    }
                }
            );

            // delete the request
            const res2 = await axios.post('https://mcmeet-13f052a6cf31.herokuapp.com/api/deleteRequest', 
                {id: id}, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('user')}`
                    }
                }
            );

            navigate(0);
        }
        catch (err) {
            alert(err)
        }
    }

    const sendAlt = async (id, organizer) => {
        console.log(id);
        // delete this request and send an alternative to the organizer
        // delete the request
        const res = await axios.post('https://mcmeet-13f052a6cf31.herokuapp.com/api/deleteRequest', 
            {id: id}, 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                }
            }
        );

        navigate(`/request-booking/${organizer}`)
    }

    useEffect(() => {
        getRequests()
    }, [])

    return (
        <div className="accept-booking">
            <div className="bookings-container">
                <h1>Incoming Requests</h1>
               
                {requests.map((req) => (
                    <RequestCard
                        title={req.title}
                        organizer={req.organizer}
                        key={req.id}
                        id={req.id}
                        op1={req.option1}
                        op2={req.option2}
                        op3={req.option3}
                        acceptRequest={acceptRequest}
                        sendAlt={sendAlt} />
                ))}
            </div>
        </div>
    )
}

export default IncomingRequests