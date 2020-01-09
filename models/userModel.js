const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'A password must have more or equal then 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // this only works on CREATE or SAVE (.create() or .save())!!!
            validator: function(el) {
                return el === this.password; // return true / false
            },
            message: 'Passwords are not the same!'
        },
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modidied
    if (!this.isModified('password')) return next();

    // hash the password with code of 12
    this.password = await bcrypt.hash(this.password, 12);

    // delete passwordConfirm field
    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
    // this point to current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function(
    canditatePassword,
    userPassword
) {
    return await bcrypt.compare(canditatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        console.log('cac', changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp; // return true if time created token less than time changed password -> changed password is true
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    console.log(
        { resetToken },
        this.passwordResetToken,
        this.passwordResetExpires
    );

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
