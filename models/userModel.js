const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, 'The name is required'],
        
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String
    },
    role: {
       type: String,
       enum: ['user', 'guide', 'lead-guide', 'admin'],
       default: 'user' 
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLenght: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //Only works on CREATE & SAVE document. 
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same'
            
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  }  
);


userSchema.pre('save', async function(next) {

    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
})


userSchema.methods.correctPassword = function(passToValidate, userPassword) {
    console.log('hola modelo')
    return bcrypt.compare(passToValidate, userPassword);
}

userSchema.methods.changedPasswordAfter = function(jwtTimeStamp) {
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/ 1000, 10)
       console.log(changedTimeStamp, jwtTimeStamp)

       return jwtTimeStamp < changedTimeStamp; //true, means changed
    }
    return false;
}

//GENERATE RANDOM TOKEN 

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

        console.log({resetToken}, this.passwordResetToken)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;

}

const User = mongoose.model('User', userSchema);

module.exports = User;

