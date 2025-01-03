import { GoTrash } from "react-icons/go";
import {useEffect} from 'react';

import './bookingRequestCard.css'

const BookingRequestCard = ({bookMeeting, ...props}) => {

    const handleClick = () => {
        bookMeeting(props.id);
    }

    return (
        <div className="request-card">
            <div className="info">
                <h2>{props.title}</h2>
                
                <div className='property'>
                    <p className='property-label'>Date: </p> <p>{props.date}</p>
                </div>

                <div className='property'>
                    <p className='property-label'>Time: </p> <p>{props.time}</p>
                </div>

                <div className='property'>
                    <p className='property-label'>Organizer: </p> <p>{props.organizer}</p>
                </div>

                <div className='property'>
                    <p className='property-label'>Capacity: </p> <p>{props.capacity}</p>
                </div>

                <div className='property'>
                    <p className='property-label'>Attending: </p> <p>{props.attending ? 'yes' : 'no'}</p>
                </div>
            </div>

            {!props.attending ?
            <button onClick={handleClick}>
                Book
            </button>
            :<div></div>}
        </div>
    )
}   

export default BookingRequestCard