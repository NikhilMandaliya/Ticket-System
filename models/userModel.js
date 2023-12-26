const mongoose = require('mongoose');
const validator = require('validator');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: [true, 'Name is required'] },

    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email is invalid'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be 8 characters long'],
        trim: true,
        // select: false,
    },
    passwordConfirm: {
        type: String,
        required: [
            function () {
                return this.isNew || this.isModified('password');
            },
            'Confirm password is required',
        ],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password and confirm password must be same',
        },
    },

    role: {
        type: String,
        enum: ['admin', 'manager', 'employee', 'client'],
        required: true,
    },

    date: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // Hash password
    this.password = await bcrypt.hash(this.password, 10);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;

    next();
});

// Check password
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Generating tokens
userSchema.methods.generateAuthToken = async function () {
    try {
        return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: '90d',
        });
    } catch (error) {
        throw createError.BadRequest(error);
    }
};

module.exports = new mongoose.model('User', userSchema);
