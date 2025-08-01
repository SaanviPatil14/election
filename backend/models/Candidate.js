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
    isRejected: { // <-- NEW FIELD
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
    // You can add more candidate-specific fields like party, symbol etc.
});

// Hash password before saving
CandidateSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
CandidateSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Candidate', CandidateSchema);