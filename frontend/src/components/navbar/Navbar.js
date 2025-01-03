import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../../logo.png';


import './navbar.css'


const Navbar = () => {
    const location = useLocation();
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [email, setEmail] = useState('');

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    const getEmail = async () => {
        try {
            const res = await axios.get("https://mcmeet-13f052a6cf31.herokuapp.com/api/email", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                }
            })
            setEmail(res.data)
        }
        catch (err) {
            // error
            console.log(err.response ? err.response.data : "error: no connection")
        }
    }

    // listen for changes to local storage and updates the user
    window.addEventListener('storage', () => {
        setUser(localStorage.getItem('user'));
        getEmail();
    })

    useEffect(() => {
        getEmail();
    }, [])

    return (
        
        <div className="navbar">
                {user ?
                <div className='logged-in'>
                    <Link 
                        className={location.pathname === '/dashboard' ? 'active' : ''} 
                        to='/dashboard'>Dashboard</Link>

                    <p style={{color: 'white'}}>Logged in as:   {email}</p>

                    <div className="right-links">
                        <Link 
                            className={location.pathname === '/incoming-requests' ? 'active' : ''} 
                            to='/incoming-requests'>Incoming Requests</Link>
                        <Link 
                            className={location.pathname === '/create-booking' ? 'active' : ''} 
                            to='/create-booking'>Create Booking</Link>
                        <Link 
                            className={location.pathname.startsWith('/request-booking') ? 'active' : ''} 
                            to='/request-booking/def'>Request Booking</Link>
                        <Link 
                            className={location.pathname === '/' ? 'active' : ''} 
                            to='/'
                            onClick={handleLogout}>Logout</Link>
                    </div>
                </div>
                :
                <div className='logged-out'>
                    <Link 
                        className={location.pathname === '/' ? 'active logo' : 'logo'} 
                        to='/'><img src={logo} alt="logo" /></Link>

                    <div className="right-links">
                        <Link 
                            className={location.pathname === '/login' ? 'active' : ''} 
                            to='/login'>Login</Link>
                        <Link 
                            className={location.pathname === '/register' ? 'active' : ''} 
                            to='/register'>Register</Link>
                    </div>
                </div>
                }
        </div>
    )
}

export default Navbar