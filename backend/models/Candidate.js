// backend/models/Candidate.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CandidateSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    pitch: {
        type: String,
        required: true,
    },
    tagline: {
        type: String,
        required: true,
        maxlength: 100,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isRejected: {
        type: Boolean,
        default: false,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
    votes: {
        type: Number,
        default: 0,
    }
});

// Hash password before saving
CandidateSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

CandidateSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Candidate', CandidateSchema);