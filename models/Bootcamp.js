// to create a schema of fields
const mongoose = require('mongoose');

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
      // required: true,
    },
    coordinates: {
      type: [Number],
      // required: true,
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

module.exports = mongoose.model('Bootcamp', BootcampSchema);
