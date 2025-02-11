const app = require('express').Router();
const Blog = require('../models/blog');

app.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    console.log("Fetched blogs:", blogs); 
    response.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error.message);  
    next(error);
  }
});

app.post('/', async (request, response, next) => {
  try {
    if (!request.body.title || !request.body.url) {
      return response.status(400).json({ error: 'Title and URL are required' });
    }
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0  
    });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error saving blog:", error.message);
    next(error);
  }
});


module.exports = app;
