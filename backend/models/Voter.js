// backend/models/Voter.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VoterSchema = new mongoose.Schema({
    voterId: {
        type: String,
        required: true,
        unique: true,
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
    name: {
        type: String,
        required: true,
        trim: true,
    },
    hasVoted: {
        type: Boolean,
        default: false,
    },
    votedCandidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        default: null,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
VoterSchema.pre('save', async function(next) {
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

VoterSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Voter', VoterSchema);