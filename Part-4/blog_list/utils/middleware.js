const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Centralized error handler
const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'Malformatted ID' });
    }
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    }
    if(error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'Invalid token' });
    }
    next(error);
  };

  const tokenExtractor = (request, response, next) => {
    // console.log("Incoming Request Headers:", request.headers); // Debugging

    const authorization = request.get("authorization");
    // console.log("Authorization Header:", authorization); // Debugging

    if (authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "");
    } else {
        request.token = null; // Ensure request.token is explicitly set
    }

    console.log("Extracted Token:", request.token); // Debugging
    next();
};



const userExtractor = async (request, response, next) => {
    try {
        if (!request.token) {
            return response.status(401).json({ error: 'Token missing' });
        }
        const decodedToken = jwt.verify(request.token, process.env.SECRET);
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'Invalid token' });
        }

        // Fetch the user from database
        request.user = await User.findById(decodedToken.id);
        if (!request.user) {
            return response.status(401).json({ error: 'User not found' });
        }
        next(); 
    } catch (error) {
        next(error);
    }
};

  

module.exports = { errorHandler, tokenExtractor, userExtractor };