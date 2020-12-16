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
        tour: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Tour'
            }
        ],
        user: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ],
        
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }

)

//Query Middleware to Populate users && tours

// reviewSchema.pre(/^find/, function(next){
//     this.populate()
//     next()
// })



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review