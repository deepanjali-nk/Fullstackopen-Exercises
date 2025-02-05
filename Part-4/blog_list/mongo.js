require('dotenv').config();
const { info } = require('./utils/logger');
const mongoose = require('mongoose');
const { MONGODB_URI } =require('./utils/config');

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    info('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

module.exports = mongoose;

