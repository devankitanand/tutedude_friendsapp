
const express = require('express');
const { registerUser, loginUser, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getUsers, getFriends, getFriendRequests, getUserById, unfriendUser, getFriendRecommendations, updateHobbies, getHobbies } = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/sendFriendRequest', sendFriendRequest);
router.post('/acceptFriendRequest', acceptFriendRequest);
router.post('/rejectFriendRequest', rejectFriendRequest);
router.get('/', getUsers);
router.get('/friends', authenticate, getFriends);
router.get('/friendRequests', authenticate, getFriendRequests);
router.get('/:id', authenticate, getUserById);
router.post('/unfriend', authenticate, unfriendUser);


module.exports = router;
