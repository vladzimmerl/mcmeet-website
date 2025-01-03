import { GoTrash } from "react-icons/go";

import './bookingRequestCard/bookingRequestCard.css'

const RequestCard = (props) => {

    const handleClick = (op) => {
        props.acceptRequest(op, props.id);
    }

    const handleAltClick = () => {
        props.sendAlt(props.id, props.organizer);
    }

    return (
        <div className="request-card">
            <div className="info">
                <h2>{props.title}</h2>

                <div className='property'>
                    <p className='property-label'>Organizer: </p> <p>{props.organizer}</p>
                </div>

                <div className="option-container">
                    <div>
                        <h3>Option 1:</h3>
                        <p className='property-label'>Date: </p> <p>{props.op1.date}</p>
                        <p className='property-label'>Time: </p> <p>{props.op1.start} to {props.op1.end}</p>
                        <button onClick={() => handleClick('1')}>Accept</button>
                    </div>
                    <div>
                        <h3>Option 2:</h3>
                        <p className='property-label'>Date: </p> <p>{props.op2.date}</p>
                        <p className='property-label'>Time: </p> <p>{props.op2.start} to {props.op2.end}</p>
                        <button onClick={() => handleClick('2')}>Accept</button>
                    </div>
                    <div>
                        <h3>Option 3:</h3>
                        <p className='property-label'>Date: </p> <p>{props.op3.date}</p>
                        <p className='property-label'>Time: </p> <p>{props.op3.start} to {props.op3.end}</p>
                        <button onClick={() => handleClick('3')}>Accept</button>
                    </div>
                </div>
                <button onClick={handleAltClick} className="alt-btn">Send Alternative Request</button>
                
            </div>
        </div>
    )
}   

export default RequestCard