// to create a schema of fields
const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
  // it takes all the fields along with validation, etc
  /*
  if no validations is needed
name: String
*/
  name: {
    type: String, //type
    required: [true, 'Please add a name'], // required field
    unique: true, // no 2 bootcamps can have the same name
    trim: true, // trim whitespaces
    maxlength: [50, 'Name cannot be more than 50 characters'], //maximum length of 50 characters
  },
  slug: String, // slug is basically a URL friendly version of the name in this case and the reason we want a slug is for the frontend in case you want to go to /bootcamp/nameofbootcamp
  // Devcentral Bootcamp      slug would be devcentral-bootcamp
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  website: {
    type: String,
    // doing custom validation using regular expression (Regex if you want to ensure URL starts with HTTP/HTTPS)
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  // address will be sent from the server to the client
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: {
    // GeoJSON Point : https://mongoosejs.com/docs/geojson.html
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    // Array of string
    type: [String],
    required: true,
    // only available values that careers can have
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  },
  // averageRating isn't going to get inserted with a request; its going to be generated.
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must not be more than 10'],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg', //when you have your frontend, just put this jpg file in your folder
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  /*
  Later on, we're going to have a user field because we need a user associated with the boot camp.
  So, we know who added which bootcamp, but we don't have user functionality, authentication or anything yet so not going to add it now.
  */
});

// Create bootcamp slug from the name
// pre is going to run before the document is saved.
// Use normal function here; Arrow function handle scope different, they handle the 'this' keyword differently.
BootcampSchema.pre('save', function (next) {
  // console.log('Slugify ran', this.name);
  this.slug = slugify(this.name, { lower: true });
  next(); // so it knows to move on to the next piece of middleware
});

// Geocode & create location field
BootcampSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address in DB
  this.address = undefined;
  next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
