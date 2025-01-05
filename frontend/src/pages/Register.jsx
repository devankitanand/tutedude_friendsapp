import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, { username, password });
            console.log(response.data.message);
            alert('Registration successful. Please login to continue');
            navigate('/');
        } catch (error) {
            alert('Registration failed or User already exists');
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className='bg'>
            <div className='wrap-div'>
            <div className='login'>Register</div>
            <form onSubmit={handleSubmit}>
                
                    
                    <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                
                    
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
               
                    <input type="password" placeholder='Confrim Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                
                <button type="submit" className='lgnbtn'>Register</button>
            </form>
            <div className='register-link'>
                    <span>Already Registered? </span>
                    <Link to="/" className='redirect'>Login</Link>
                </div>
            </div>
            
        </div>
    );
}

export default Register;