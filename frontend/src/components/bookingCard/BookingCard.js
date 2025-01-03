import { GoTrash } from "react-icons/go";

import './bookingCard.css'

const BookingCard = (props) => {

    const handleClick = () => {
        props.removeMeeting(props.id);
    }

    return (
        <div className="booking-card">
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
                    <p className='property-label'>Type: </p> <p>{props.type === 'true' ? 'recurring' : 'one-time'}</p>
                </div>

                <div className='property'>
                    <p className='property-label'>Url: </p> <p>{props.url}</p>
                </div>
            </div>

            <button onClick={handleClick}>
                <GoTrash className="trash" />
            </button>
        </div>
    )
}   

export default BookingCard