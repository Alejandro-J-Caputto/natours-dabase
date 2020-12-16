const mongoose = require('mongoose');
const validator = require('validator');


const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty!']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createtAt: {
            type: Date,
            default: Date.now()
        },
        tour: 
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Tour',
                required: [true, 'Review must belong to a tour']
            
            }
        ,
        user: 
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: [true, 'Review must have an user']
            }
        ,
        
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
})

// Query Middleware to Populate users && tou
reviewSchema.pre(/^find/, function(next){
    this.populate('tour', 'name id -guides').populate('user', 'name email')
    // this.populate('user', 'name email')
    next()
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

