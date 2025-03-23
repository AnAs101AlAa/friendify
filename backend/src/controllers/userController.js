const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
};

exports.createUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExists = await User.fetchId({ username });
        const existPassword = await User.fetchPassword({ password });
        if (userExists != null || existPassword != null) {
            return res.status(400).json({ message: 'username or password is already taken' });
        }
        const newUser = await User.create({ username, password });
        const token = generateToken(newUser);
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login({ username, password });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

exports.fetchId = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.fetchId({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

exports.addFriend = async (req, res) => {
    try {
        const { username, friendName } = req.body;
        const updatedUser = await User.addFriend({ username, friendName });
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error adding friend', error });
    }
};

exports.getFriend = async (req, res) => {
    const { username } = req.body;
    try {
        const friend = await User.searchfriend({ username });
        res.status(200).json({ friend });
    } catch (error) {
        res.status(500).json({ message: 'Error searching friend', error });
    }
};

exports.acceptFriend = async (req, res) => {
    try {
        const { username, friendName } = req.body;
        const updatedUser = await User.acceptFriend({ username, friendName });
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend', error });
    }
};

exports.rejectFriend = async (req, res) => {
    try {
        const { username, friendName } = req.body;
        const updatedUser = await User.rejectFriend({ username, friendName });
        res.status(200).json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting friend', error });
    }
};