
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


exports.sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
        if (!senderId || !receiverId) {
            return res.status(400).json({ message: 'Sender ID and Receiver ID are required' });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!receiver.friendRequests.includes(senderId)) {
            receiver.friendRequests.push(senderId);
            await receiver.save();
            res.status(200).json({ message: 'Friend request sent!' });
        } else {
            res.status(400).json({ message: 'Friend request already sent.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};



exports.acceptFriendRequest = async (req, res) => {
    const { userId, requestId } = req.body;
    try {
        const user = await User.findById(userId);
        const requester = await User.findById(requestId);
        if (user.friendRequests.includes(requestId)) {
            user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
            user.friends.push(requestId);
            requester.friends.push(userId);
            await user.save();
            await requester.save();
            res.status(200).json({ message: 'Friend request accepted!' });
        } else {
            res.status(400).json({ message: 'Friend request not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.rejectFriendRequest = async (req, res) => {
    const { userId, requestId } = req.body;
    try {
        const user = await User.findById(userId);
        if (user.friendRequests.includes(requestId)) {
            user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
            await user.save();
            res.status(200).json({ message: 'Friend request rejected!' });
        } else {
            res.status(400).json({ message: 'Friend request not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.unfriendUser = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Unfriended successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};



exports.getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends');
        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friendRequests');
        res.status(200).json(user.friendRequests);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};



