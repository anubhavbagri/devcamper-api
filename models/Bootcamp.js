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
});
