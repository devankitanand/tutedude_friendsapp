import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user._id); 
            console.log('Login successful');
            navigate('/home');
        } catch (error) {
            alert('Login failed or invalid credentials');
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false); // Set loading state back to false
        }
    };

    return (
        <div className='bg'>
            <div className='wrap-div'>
                <div className='login'>Login</div>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder='Username' 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />

                    <input 
                        type="password" 
                        placeholder='Password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    
                    <button type="submit" className='lgnbtn'>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className='register-link'>
                    <span>Not registered? </span>
                    <Link to="/register" className='redirect'>Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
