import { useState } from 'react';

const Blog = ({ blog ,updateLikes, handleDelete }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLikes = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: typeof blog.user === 'object' && blog.user.id ? blog.user.id : blog.user
    };
    updateLikes(blog.id, updatedBlog);
  };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 2,
    marginBottom: 5,
  };

  return (
    <div className='blog' style={blogStyle}>
      <div className='blog-summary'>
        Blog:{blog.title} by Author: {blog.author}
        <button onClick={toggleVisibility} id='view'>{visible ? 'Hide' : 'View'}</button>
      </div>

      {visible && (
        <div className='blog-details'>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes} <button onClick={handleLikes} id='like'>Like</button></p>
          <p>Added by: {blog.user?.name || 'Unknown'}</p>
          {blog.user && blog.user.username === JSON.parse(localStorage.getItem('user')).username && (
            <button onClick={() => handleDelete(blog.id)} id='delete'>Delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;