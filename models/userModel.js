const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true
        //  unique: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email.']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'A password must have more or equal then 8 characters']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
