require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

if (!url) {
  console.error('Error: MONGODB_URI is not set');
  process.exit(1);
}

mongoose.set("strictQuery", false);
mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

const phonebookSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      minlength: [3, 'Name must be at least 3 characters long'],
      trim: true
    },
    number: { 
      type: String, 
      minlength: [8, 'Number must be at least 8 characters long'],
      validate: {
        validator: function(v) {
          return /^\d{2,3}-\d+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number! Format must be XX-XXXXXX or XXX-XXXXXXX`
      },
      required: [true, 'Number is required']
    }
  });
  

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model("Person", phonebookSchema);
module.exports = { Person };
