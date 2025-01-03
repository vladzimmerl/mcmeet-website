import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

import './register.css'

const Register = () => {

    // page data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // functions

    // called when submit button is clicked
    const handleSubmit = async (e) => {
        setLoading(true);
        // prevent page refresh
        e.preventDefault();

        // check that passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // create the payload object
        const payload = {
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }

        // attempt to register
        try {
            const res = await axios.post('https://mcmeet-13f052a6cf31.herokuapp.com/api/auth/register', payload)
            // registration successful
            navigate('/login');
        } catch (err) {
            alert(err.response ? err.response.data : "error: no connection");
            setLoading(false);
        }
    }

    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                <input required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" />
                <button type="submit">Register</button>
            </form>
            {loading ? <p>Loading...</p> : ''}
        </div>
    )
}

export default Register