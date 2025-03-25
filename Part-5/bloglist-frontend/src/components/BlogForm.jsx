import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title:
          <input
            id='title'
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div>
          Author:
          <input
            id='author'
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Enter author"
            required
          />
        </div>
        <div>
          URL:
          <input
            id='url'
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="Enter blog URL"
            required
          />
        </div>
        <button type="submit" id='create'>Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
