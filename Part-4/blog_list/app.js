const express = require('express');
const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');
const blogsController = require('./controllers/blogs');
const UserController = require('./controllers/users');
const loginController = require('./controllers/login');


app.use(cors())
app.use(express.json())
app.use('/api/users', UserController);
app.use('/api/login', loginController);
app.use(middleware.tokenExtractor);

app.use('/api/blogs',blogsController);

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/Testing')
    app.use('/api/testing', testingRouter)
}


module.exports = app;
