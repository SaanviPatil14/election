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
    hasVoted: { // New field to track if voter has cast a vote
        type: Boolean,
        default: false,
    },
    votedCandidate: { // Optional: to store which candidate they voted for
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        default: null,
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

VoterSchema.pre('save', async function (next) {
    if (this.isModified('password')) { 
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

VoterSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Voter', VoterSchema);