const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    githubId: String,
    username: String,
    displayName: String,
    email: String,
    profileUrl: String,
    avatarUrl: String,
    lastLogin: Date,
});

module.exports = mongoose.model('User', UserSchema);