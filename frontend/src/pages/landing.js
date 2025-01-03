import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import hero from "../hero.jpg";
import './landing.css'

const Landing = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // check if user is logged in
        if (localStorage.getItem('user')) {
            navigate('/dashboard');
        }
    }, [])

    return (
        <div className="landing">
            <div className="hero-container">
                <img src={hero} alt="" />
                <h1>Plan Your Next Meeting with Ease</h1>
            </div>

            <div className="container-h">
                <h2 style={{color: 'var(--2)'}}>Get Started For Free</h2>
                <Link className="btn" to='/register'>Sign Up Now!</Link>
            </div>

            <div className="container-h">
                <div className="sub">
                <div></div>
                </div>
                <div className="sub">
                    <h2>Create Bookings</h2>
                    <p>With McMeet you can create one time and recurring meetings with ease,
                        just fill out the create booking form, and send the public link 
                        to your attendees.
                    </p>
                </div>
            </div>

            <div className="container-h">
                <div className="sub">
                    <h2>Register for Meetings</h2>
                    <p>With a booking URL, you can register for meetings with 
                        or without an account.
                    </p>
                </div>
                <div className="sub">
                <div></div>
                </div>
            </div>

            <div className="container-h">
                <div className="sub">
                <div></div>
                </div>
                <div className="sub">
                    <h2>Request Special Meeting</h2>
                    <p>Sometimes none of the time options are right for you.
                        With special requests you can ask for a meeting at a specific date and time. 
                    </p>
                </div>
            </div>

            <div className="footer">
                <p className="left-align">Created by Emry Mcgill, Vlad Zimmerl, Mykyta Bychkov</p>
                <p className="right-align">Photo by <a href="https://unsplash.com/@erothermel?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Eric Rothermel</a> on <a href="https://unsplash.com/photos/white-printer-paperr-FoKO4DpXamQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a></p>
            </div>
        </div>
    )
}

export default Landing