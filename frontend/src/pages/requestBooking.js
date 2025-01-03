import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import './requestBooking.css'
import TimePicker from '../components/timePicker/TimePicker'

const RequestBooking = () => {
    let navigate = useNavigate(); 
    const { target } = useParams();

    const [who, setWho] = useState("");

    const [timeRange, setTimeRange] = useState({
        'option1': {'date': new Date().toISOString().split('T')[0], 'start': '00:00', 'end': '00:00'},
        'option2': {'date': new Date().toISOString().split('T')[0], 'start': '00:00', 'end': '00:00'},
        'option3': {'date': new Date().toISOString().split('T')[0], 'start': '00:00', 'end': '00:00'}
    });
    const [title, setTitle] = useState('');

    const [emailErr, setEmailErr] = useState('');
    const [dateErr, setDateErr] = useState('');
    const [timeErr, setTimeErr] = useState('');

    const handleTimeStartChange = (time, op) => {
        setTimeRange({...timeRange, [op]: {...timeRange[op], start: time}})
    }

    const handleTimeEndChange = (time, op) => {
        setTimeRange({...timeRange, [op]: {...timeRange[op], end: time}})
    }

    const handleDateChange = (e, op) => {
        setTimeRange({...timeRange, [op]: {...timeRange[op], date: e.target.value}})
    }

    const handleSubmit = async (e) => {
        // prevent page refresh
        e.preventDefault();

        // validate inputs
        setEmailErr('')
        setDateErr('')
        setTimeErr('')
        if (who === '') {
            setEmailErr('Please enter a valid email')
            return
        }

        for (const op in timeRange) {
            if (timeRange[op].start >= timeRange[op].end || timeRange[op].end === '00:00') {
                setTimeErr('Please enter a valid time range')
                return
            }
            if (timeRange[op].date < new Date().toISOString().split('T')[0]) {
                setDateErr('Please enter a date starting from today')
                return
            }
        }

        const request = {
            who: who,
            title: title,
            option1: timeRange.option1,
            option2: timeRange.option2,
            option3: timeRange.option3
        }

        // try to send to api {title, dateRange, timeRange, isRecurring, capacity}
        try {
            const res = await axios.post('https://mcmeet-13f052a6cf31.herokuapp.com/api/createRequest', 
                request, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('user')}`
                    }
                }
            );

            if (res.status === 200) {
                alert("Request Sent");
                navigate('/dashboard');
            }
        } 
        catch (err) {
            // error
            alert(err.response ? err.response.data : "error: no connection")
        }
    }

    useEffect(() => {
        if (target !== 'def') {
            setWho(target)
        }
    }, [])

    return (
        <div className="request-booking">
            <h1>Request a Booking</h1>

            <form onSubmit={handleSubmit}>
                <h2>Title</h2>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                
                <h2>With Who</h2>
                <input required type="email" placeholder="person@email" value={who} onChange={(e) => setWho(e.target.value)} />

                <h2>Possible Times</h2>

                <div className="times">
                    <div>
                        <h2>Option 1</h2>
                        <h2>Date</h2>
                        <input value={timeRange.option1.date} type="date" onChange={(e) => handleDateChange(e, 'option1')} />

                        <h2>Time Range</h2>
                        
                        <div className="time-range">
                            <TimePicker onChange={(time) => handleTimeStartChange(time, 'option1')} />
                            <p>To</p>
                            <TimePicker onChange={(time) => handleTimeEndChange(time, 'option1')} />
                        </div>
                    </div>

                    <div>
                        <h2>Option 2</h2>
                        <h2>Date</h2>
                        <input value={timeRange.option2.date} type="date" onChange={(e) => handleDateChange(e, 'option2')} />
                        
                        <h2>Time Range</h2>

                        <div className="time-range">
                            <TimePicker onChange={(time) => handleTimeStartChange(time, 'option2')} />
                            <p>To</p>
                            <TimePicker onChange={(time) => handleTimeEndChange(time, 'option2')} />
                        </div>
                    </div>

                    <div>
                        <h2>Option 3</h2>
                        <h2>Date</h2>
                        <input value={timeRange.option3.date} type="date" onChange={(e) => handleDateChange(e, 'option3')} />
                        

                        <h2>Time Range</h2>

                        <div className="time-range">
                            <TimePicker onChange={(time) => handleTimeStartChange(time, 'option3')} />
                            <p>To</p>
                            <TimePicker onChange={(time) => handleTimeEndChange(time, 'option3')} />
                        </div>
                    </div>
                </div>
                <br /><button className="sub" type="submit">Submit</button>
                <p className="err">{emailErr}</p>
                <p className="err">{dateErr}</p>
                <p className="err">{timeErr}</p>
            </form>
        </div>
    )
}

export default RequestBooking