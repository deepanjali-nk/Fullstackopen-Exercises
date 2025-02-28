const app = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

// Fetch all blogs
app.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user');
    response.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error.message);  
    next(error);
  }
});

// Create a new blog
app.post('/',userExtractor, async (request, response, next) => {
  const { title, author, url, likes } = request.body;
  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error saving blog:", error.message);
    next(error);
  }
});

// Delete a blog
app.delete('/:id',userExtractor, async (request, response, next) => {
  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'Unauthorized to delete this blog' });
    }
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Update blog likes
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
