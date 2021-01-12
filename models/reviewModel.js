const mongoose = require('mongoose');
const Tour = require('./tourModel');
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
    this.populate('tour', 'name id -guides').populate('user', 'name email photo')
    // this.populate('user', 'name email')
    next()
})


reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
      {
          $match: {tour: tourId}
      },
      {
          $group: {
              _id: '$tour',
              nRating: {$sum: 1}, //muestra el conteo en la agregacion 
              avgRating: {$avg: '$rating'},
          }
      }
  ]);
  
  console.log(stats);
if(stats.length > 0) {

    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    })
} else {
    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5
    })
}

}

//AVOID DUPLICATE REVIEW////////////////////////////////
reviewSchema.index({tour:1, user: 1}, { unique: true });
////////////////////////////////////////////////////////


reviewSchema.post('save', function() {

    this.constructor.calcAverageRatings(this.tour)

})


//FINDBYIDANDUPDATE && FINDBYIDANDDELETE REVIEW RATING 

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.reviewTemp = await this.findOne();
    console.log(this.reviewTemp);
    next();
})
reviewSchema.post(/^findOneAnd/, async function(){
    await this.reviewTemp.calcAverageRatings(this.reviewTemp.tour);
})

////////////////////////////////////////////////////////////////////

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

