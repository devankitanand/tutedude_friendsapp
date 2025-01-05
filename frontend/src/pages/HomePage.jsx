
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const userId = localStorage.getItem('userId');
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setLoggedInUser(response.data);
                
            } catch (error) {
                console.error('Error fetching logged-in user:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchFriendsAndRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const [friendsResponse, requestsResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/users/friends`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`${process.env.REACT_APP_API_URL}/users/friendRequests`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                setFriends(friendsResponse.data);
                setFriendRequests(requestsResponse.data);
            } catch (error) {
                console.error('Error fetching friends and requests:', error);
            }
        };


        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        } else {
            fetchLoggedInUser();
            fetchUsers();
            fetchFriendsAndRequests();
        }
    }, [navigate]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };


    const filteredUsers = users.filter(user =>
        user._id !== loggedInUser._id && 
        !friends.some(friend => friend._id === user._id) && 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSendFriendRequest = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const senderId = localStorage.getItem('userId');
            await axios.post(
                `${process.env.REACT_APP_API_URL}/users/sendFriendRequest`,
                { senderId, receiverId: userId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setSentRequests([...sentRequests, userId]);
            console.log('Friend request sent successfully');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleAcceptFriendRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_API_URL}/users/acceptFriendRequest`,
                { userId: localStorage.getItem('userId'), requestId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const acceptedFriend = users.find(user => user._id === requestId);
            setFriends([...friends, acceptedFriend]);
            setFriendRequests(friendRequests.filter(request => request._id !== requestId));
            console.log('Friend request accepted successfully');
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectFriendRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_API_URL}/users/rejectFriendRequest`,
                { userId: localStorage.getItem('userId'), requestId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setFriendRequests(friendRequests.filter(request => request._id !== requestId));
            console.log('Friend request rejected successfully');
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const handleUnfriend = async (friendId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_API_URL}/users/unfriend`,
                { userId: localStorage.getItem('userId'), friendId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setFriends(friends.filter(friend => friend._id !== friendId));
            console.log('Unfriended successfully');
        } catch (error) {
            console.error('Error unfriending:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <div className='home-wrap'>
            <div className='home-container'>
            <div className='login fa'>Friends App</div>
            <div className='home-header'>
            <div>Welcome, {loggedInUser.username}!</div>
            <button onClick={handleLogout} className='lgnbtn out'>Logout</button>
            </div>
            
            <input
                type="text"
                placeholder="Search Friends"
                value={searchTerm}
                onChange={handleSearch}
            />

            

            <div className='title'>You May know Them</div>
            <ul>
                {filteredUsers.map(user => (
                    <li key={user._id}>
                        {user.username}
                        {sentRequests.includes(user._id) ? (
                            <button disabled>Friend Request Sent</button>
                        ) : (
                            <button className='lgnbtn add' onClick={() => handleSendFriendRequest(user._id)}>Add Friend</button>
                        )}
                    </li>
                ))}
            </ul>
            <h2>Friend Requests</h2>
            <ul>
                {friendRequests.map(request => (
                    <li key={request._id}>
                        {request.username}
                        <button className='acceptbtn' onClick={() => handleAcceptFriendRequest(request._id)}>Accept</button>
                        <button className='rejectbtn' onClick={() => handleRejectFriendRequest(request._id)}>Reject</button>
                    </li>
                ))}
            </ul>
            <h2>Friends List</h2>
            <ul>
                {friends.map(friend => (
                    <li key={friend._id}>
                        {friend.username} <button className='rejectbtn un' onClick={() => handleUnfriend(friend._id)}>Unfriend</button>
                    </li>
                ))}
            </ul>
           
            </div>
            
        </div>
    );
}

export default HomePage;
