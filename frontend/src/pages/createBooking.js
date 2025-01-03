import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import './createBooking.css'
import TimePicker from "../components/timePicker/TimePicker";
import BookingCard from "../components/bookingCard/BookingCard";

const CreateBooking = () => {

    let navigate = useNavigate(); 

    // STATES
    const [recurring, setRecurring] = useState('daily');
    const [dateRange, setDateRange] = useState({'start': new Date().toISOString().split('T')[0], 'end': ''});
    const [dateErr, setDateErr] = useState('');
    const [timeRange, setTimeRange] = useState({
        'monday': {'checked': true, 'start': '00:00', 'end': '00:00'},
        'tuesday': {'checked': true, 'start': '00:00', 'end': '00:00'},
        'wednesday': {'checked': true, 'start': '00:00', 'end': '00:00'},
        'thursday': {'checked': true, 'start': '00:00', 'end': '00:00'},
        'friday': {'checked': true, 'start': '00:00', 'end': '00:00'},
        'saturday': {'checked': true, 'start': '00:00', 'end': '00:00'},
        'sunday': {'checked': true, 'start': '00:00', 'end': '00:00'}
    });
    const [timeErr, setTimeErr] = useState('');
    const [participants, setParticipants] = useState(1);

    const [title, setTitle] = useState('');



    // FUNCTIONS

    const handleStartDateChange = (e) => {
        if (e.target.value > dateRange['end'] && dateRange['end'] !== '') {
            console.log("start date cannot be after end date")
            setDateErr("start date cannot be after end date")
        }
        else if (e.target.value < new Date().toISOString().split('T')[0]) {
            console.log("start date cannot be before today")
            setDateErr("start date cannot be before today")
        }
        else {
            setDateRange({'start': e.target.value, 'end': dateRange['end']})
            console.log("start date changed")
            setDateErr('')
        }
    }

    const handleEndDateChange = (e) => {
        if (e.target.value < dateRange['start']) {
            console.log("end date cannot be before start date")
            setDateErr("end date cannot be before start date")
        }
        else if (e.target.value < new Date().toISOString().split('T')[0]) {
            console.log("end date cannot be before today")
            setDateErr("end date cannot be before today")
        }
        else {
            setDateRange({'start': dateRange['start'], 'end': e.target.value})
            console.log("end date changed")
            setDateErr('')
        }
    }

    const handleRecurringChange = (e) => {
        // set the recurring state
        setRecurring(e.target.value);

        // change the time range state format accordingly
        if (e.target.value === 'one' || e.target.value === 'daily') {
            Object.keys(timeRange).forEach(day => {
                timeRange[day].checked = true;
            });
        }
        else if (e.target.value === 'weekly') {
            Object.keys(timeRange).forEach(day => {
                timeRange[day].checked = false;
                timeRange[day].start = '00:00';
                timeRange[day].end = '00:00';
            });
        }
    }

    const handleTimeChangeStart = (time, day) => {
        // check what the recurring state is
        if (recurring === 'one' || recurring === 'daily') {
            Object.keys(timeRange).forEach(day => {
                timeRange[day].start = time;
            });
        }
        else if (recurring === 'weekly') {
            timeRange[day].start = time;
        }
    }

    const handleTimeChangeEnd = (time, day) => {
        // check what the recurring state is
        if (recurring === 'one' || recurring === 'daily') {
            Object.keys(timeRange).forEach(day => {
                timeRange[day].end = time;
            });
        }
        else if (recurring === 'weekly') {
            timeRange[day].end = time;
        }
    }


    const handleCheckbox = (e) => {
        if (e.target.checked) {
            // if checked add this day to the days in time range
            setTimeRange({...timeRange, [e.target.value]: {...timeRange[e.target.value], checked: true}})
        }
        else {
            // if unchecked remove this day from the days in time range
            setTimeRange({...timeRange, [e.target.value]: {...timeRange[e.target.value], checked: false}})
        }
    }



    const handleSubmit = async (e) => {
        // prevent page refresh
        e.preventDefault();

        // validate time ranges
        setTimeErr('')
        for (const day in timeRange) {
            if (timeRange[day].end <= timeRange[day].start && timeRange[day].checked === true) {
                setTimeErr('Please make sure all time ranges are valid')
                return;
            }
        };

        // validate capacity
        if (participants < 1) {
            setTimeErr('Please make sure capacity is at least 1.')
            return;
        }

        // ensure at least 1 day is checked for weekly
        if (recurring === 'weekly') {
            const allUnchecked = Object.values(timeRange).every(day => !day.checked);
            if (allUnchecked) {
                setTimeErr('Please check at least 1 day.')
                return;
            }
        }

        let rec;
        let end;
        // check if its recurring
        if (recurring === 'weekly' || recurring === 'daily') {
            rec = true;
            end = dateRange.end;
        }
        else {
            rec = false;
            end = dateRange.start;
        }

        // create booking object
        const booking = {
            'title': title,
            'dateRange': {start: dateRange.start, end: end},
            'timeRange': timeRange,
            'isRecurring': rec,
            'capacity': participants
        }

        // try to send to api {title, dateRange, timeRange, isRecurring, capacity}
        try {
            const res = await axios.post('https://mcmeet-13f052a6cf31.herokuapp.com/api/createBooking', 
                booking, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('user')}`
                    }
                }
            );
            alert('Share this URL with your participants: ' + res.data.url)
            navigate('/dashboard')
        } 
        catch (err) {
            // error
            alert(err.response ? err.response.data : "error: no connection")
        }
    }


    return (
        <div className="create-booking">
            <h1>Create a Booking</h1>

            <form onSubmit={handleSubmit}>
            <h2>
                Title
            </h2>

            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

            <h2>Recurring</h2>

            <select 
                id='recurring' 
                value={recurring} 
                onChange={handleRecurringChange}>
                <option value="one">One Time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
            </select>


            {recurring === 'one' ?
            <>
                <h2>Date</h2>
                <input 
                    type="date" 
                    onChange={(e) => setDateRange({'start': e.target.value, 'end': dateRange['end'] ?? ''})}
                    value={dateRange['start']}
                />
            </>
            :
            <>
            <h2>Date Range</h2>
                <div className="date-range">
                    <div className="input-container">
                        <h3>Start</h3>
                        <input 
                            type="date" 
                            onChange={handleStartDateChange}
                            value={dateRange['start']}
                        />
                    </div>

                    <div >
                        <h3>End</h3>
                        <input 
                            type="date" 
                            onChange={handleEndDateChange}
                            value={dateRange['end']}
                        />
                    </div>
                </div>
                </>
            }

            <p className="err">{dateErr}</p>

                <h2>Time Range</h2>

                {recurring === 'daily' || recurring === 'one' ?
                    <div className="time-picker-container">
                        <TimePicker onChange={(time) => handleTimeChangeStart(time)} />
                        <p>To</p>
                        <TimePicker onChange={(time) => handleTimeChangeEnd(time)} />
                    </div>
                    : recurring === 'weekly' ?
                    <div className="weekly-time-range">
                        <div className="check-container">
                            <input type="checkbox" value="monday" onChange={handleCheckbox} /> 
                            <p className={timeRange.monday.checked ? 'day' : 'day-disabled'}>Monday</p> 
                            <div className={ timeRange.monday.checked ? "time-picker-container" : "time-picker-container-disabled"}>
                                <TimePicker onChange={(time) => handleTimeChangeStart(time, 'monday')} />
                                <p>To</p>
                                <TimePicker onChange={(time) => handleTimeChangeEnd(time, 'monday')} />
                            </div>
                        </div>

                        <div className="check-container">
                            <input type="checkbox" value="tuesday" onChange={handleCheckbox} /> 
                            <p className={timeRange.tuesday.checked ? 'day' : 'day-disabled'}>Tuesday</p> 
                            <div className={ timeRange.tuesday.checked ? "time-picker-container" : "time-picker-container-disabled"}>
                                <TimePicker onChange={(time) => handleTimeChangeStart(time, 'tuesday')} />
                                <p>To</p>
                                <TimePicker onChange={(time) => handleTimeChangeEnd(time, 'tuesday')} />
                            </div>
                        </div>

                        <div className="check-container">
                            <input type="checkbox" value="wednesday" onChange={handleCheckbox} /> 
                            <p className={timeRange.wednesday.checked ? 'day' : 'day-disabled'}>Wednesday</p> 
                            <div className={ timeRange.wednesday.checked ? "time-picker-container" : "time-picker-container-disabled"}>
                                <TimePicker onChange={(time) => handleTimeChangeStart(time, 'wednesday')} />
                                <p>To</p>
                                <TimePicker onChange={(time) => handleTimeChangeEnd(time, 'wednesday')} />
                            </div>
                        </div>

                        <div className="check-container">
                            <input type="checkbox" value="thursday" onChange={handleCheckbox} /> 
                            <p className={timeRange.thursday.checked ? 'day' : 'day-disabled'}>Thursday</p> 
                            <div className={ timeRange.thursday.checked ? "time-picker-container" : "time-picker-container-disabled"}>
                                <TimePicker onChange={(time) => handleTimeChangeStart(time, 'thursday')} />
                                <p>To</p>
                                <TimePicker onChange={(time) => handleTimeChangeEnd(time, 'thursday')} />
                            </div>
                        </div>

                        <div className="check-container">
                            <input type="checkbox" value="friday" onChange={handleCheckbox} /> 
                            <p className={timeRange.friday.checked ? 'day' : 'day-disabled'}>Friday</p> 
                            <div className={ timeRange.friday.checked ? "time-picker-container" : "time-picker-container-disabled"}>
                                <TimePicker onChange={(time) => handleTimeChangeStart(time, 'friday')} />
                                <p>To</p>
                                <TimePicker onChange={(time) => handleTimeChangeEnd(time, 'friday')} />
                            </div>
                        </div>

                        <div className="check-container">
                            <input type="checkbox" value="saturday" onChange={handleCheckbox} /> 
                            <p className={timeRange.saturday.checked ? 'day' : 'day-disabled'}>Saturday</p> 
                            <div className={ timeRange.saturday.checked ? "time-picker-container" : "time-picker-container-disabled"}>
                                <TimePicker onChange={(time) => handleTimeChangeStart(time, 'saturday')} />
                                <p>To</p>
                                <TimePicker onChange={(time) => handleTimeChangeEnd(time, 'saturday')} />
                            </div>
                        </div>

                        <div className="check-container">
                            <input type="checkbox" value="sunday" onChange={handleCheckbox} /> 
                            <p className={timeRange.sunday.checked ? 'day' : 'day-disabled'}>Sunday</p> 
                            <div className={ timeRange.sunday.checked ? "time-picker-container" : "time-picker-container-disabled"}>
                                <TimePicker onChange={(time) => handleTimeChangeStart(time, 'sunday')} />
                                <p>To</p>
                                <TimePicker onChange={(time) => handleTimeChangeEnd(time, 'sunday')} />
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                    </div>
                }


                <h2>Number of Participants</h2>
                <input 
                    type="number" 
                    onChange={(e) => setParticipants(e.target.value)}
                    value={participants}
                /><br />

                <button>Submit</button>

                <p className="err">{timeErr}</p>
                 
            </form>
        </div>
    );
};

export default CreateBooking;