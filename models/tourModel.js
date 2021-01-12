const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');




const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a price'],
      unique: true, //not a validator
      trim: true,
      Maxlenght: [40, 'A tour must have less or equal than 40'], 
      Minlenght: [10, 'A tour must have less or equal than 10'], 
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group Size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Dififculty is either: easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be avobe 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price ? true : false
        },
        message: `Discount price ({VALUE}) should be below regular price`
      } 
      
    },
    summary: {
      type: String,
      trim: true,
      required: [true, ' A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// tourSchema.set('toJSON', {virtuals: true})
// tourSchema.set('toObject', {virtuals: true})

// tourSchema.index({price: 1})
tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});

tourSchema.index({startLocation: '2dsphere'});


tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review', 
  foreignField: 'tour',
  localField: '_id'
});



//DOCUMENT MIDDLEWARE runs before. save comands & .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', function (next) {
  console.log('Will save document');
  next();
});

tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id).select('name role'));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
 

//QUERY MIDDLEWARE 
tourSchema.pre('find', function(next) {
  this.find({secretTour: {$ne: true}})
  this.start = Date.now();
  next();
});
tourSchema.pre('findOne', function(next) {
  this.find({secretTour: {$ne: true}})
  next();
});

tourSchema.post(/^find/, function(docs, next){
  console.log(`queryTook ${Date.now() - this.start} milliseconds`)
  // console.log(docs);
  next();
})

tourSchema.pre(/^find/, function(next) {
  this.populate('guides', 'name role email photo')
  next()
})

//AGREGATION MIDDLEWARE

// tourSchema.pre('aggregate', function(next) {
//   // console.log(this.pipeline())
//   this.pipeline().unshift({'$match': {secretTour: {$ne: true}}})
//   next();
// })





const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
