const app = require('express').Router();
const { request } = require('../app');
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

app.delete('/:id', async (request, response, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
    if (!deletedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.put('/:id', async (request, response, next) => {
  try {
    const { likes } = request.body;

    if (likes === undefined) {
      return response.status(400).json({ error: 'Likes field is required' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    response.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error.message);
    next(error);
  }
});


module.exports = app;
