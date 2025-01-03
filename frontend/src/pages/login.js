import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

import './login.css'

const Login = () => {

    // page data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // functions

    // redirect to dashboard if already logged in

    // called when submit button is clicked
    const handleSubmit = async (e) => {
        setLoading(true);
        // prevent page refresh
        e.preventDefault();

        // create the payload object
        const user = {
            email: email,
            password: password
        }
        
        // attempt to login
        try {
            const res = await axios.post('https://mcmeet-13f052a6cf31.herokuapp.com/api/auth/login', user)
            // login successful

            // save the email, and token
            localStorage.setItem('user', res.data);
            // create a event that triggers when the local storage changes
            window.dispatchEvent(new Event("storage"));
            // redirect to dashboard
            navigate('/dashboard');
        } 
        catch (err) {
            // login failed
            alert(err.response ? err.response.data : "error: no connection");
            setLoading(false);
        }
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                <button type="submit">Login</button>
                {loading ? <p>Loading...</p> : ''}
            </form>
        </div>
    )
}

export default Login