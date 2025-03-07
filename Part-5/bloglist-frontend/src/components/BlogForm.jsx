const BlogForm = ({ onSubmit, title, author, url, handleChange }) => {
    return (
      <div>
        <h2>Create a new blog</h2>
        <form onSubmit={onSubmit}>
          <div>
            Title:
            <input name="title" value={title} onChange={handleChange} />
          </div>
          <div>
            Author:
            <input name="author" value={author} onChange={handleChange} />
          </div>
          <div>
            URL:
            <input name="url" value={url} onChange={handleChange} />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  };
  
  export default BlogForm;
  