const app= require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

app.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs');
    response.json(users);
  } catch (error) {
    next(error);
  }
});

app.post('/', async (request, response, next) => {
    try{
    const {username, name, password} = request.body;
    if(!username || !password){
        return response.status(400).json({error: 'username and password are required'});
    }
    if(username.length < 3 || password.length < 3){
        return response.status(400).json({error: 'username and password must be at least 3 characters long'});
    }
    const saltrounds = 10;
    const passwordHash = await bcrypt.hash(password, saltrounds);
    const user = new User({
      username,
      name,
      passwordHash
    });
    const existingUser = await User.findOne({ username });
      if (existingUser) {
         return response.status(400).json({ error: 'Username must be unique' });
  }
 
    const savedUser = await user.save();
    response.status(201).json(savedUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message });
          }
        next(error);
    }

})
module.exports = app;