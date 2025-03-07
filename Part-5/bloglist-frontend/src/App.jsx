import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import blogService from './services/blogs';
import BlogForm from './components/BlogForm';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user');
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON);
        setUser(user);
        blogService.setToken(user.token);
        fetchBlogs(user.token);
      } catch (error) {
        console.error('Error during user session handling:', error);
      }
    }
  }, []);

  const fetchBlogs = async (token) => {
    try {
      const blogs = await blogService.getAll(token);
      console.log('Fetched blogs:', blogs); // Debugging log to check the structure of blogs
      setBlogs(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      console.log(user, 'user from app');
      setUser(user);
      window.localStorage.setItem('user', JSON.stringify(user));
      blogService.setToken(user.token);
      fetchBlogs(user.token);
      setUsername('');
      setPassword('');
    } catch (error) {
      setNotification('Wrong username or password');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      setUsername('');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setBlogs([]);
    setUsername('');
    setPassword('');
    window.localStorage.removeItem('user');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const blogObject = {
        title: newBlog.title,
        author: user.name,
        url: newBlog.url,
      };

      const createdBlog = await blogService.create(blogObject);
      console.log('Created Blog:', createdBlog); // Check the structure of the created blog

      setBlogs([...blogs, createdBlog]);
      setNotification(`Blog "${createdBlog.title}" added successfully!`);
      setTimeout(() => setNotification(null), 5000);
      setNewBlog({ title: '', author: '', url: '' });
    } catch (error) {
      console.error('Error creating blog:', error);
      setNotification('Failed to create blog.');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value,
    }));
  };

  const userBlogs = blogs.filter((blog) => blog.user.username === user.username);

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );

  const blogForm = () => (
    <Togglable buttonLabel="create new blog">
      <BlogForm
        onSubmit={handleSubmit}
        title={newBlog.title}
        author={newBlog.author}
        url={newBlog.url}
        handleChange={handleChange}
      />
    </Togglable>
  );

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p> <button onClick={handleLogout}>logout</button>
          {blogForm()}
          <h2>Your Blogs</h2>
          <p>{userBlogs.length} blog(s) found</p>
          {userBlogs.length > 0 ? (
            userBlogs.map((blog) => <Blog key={blog.id} blog={blog} />)
          ) : (
            <p>You haven't created any blogs yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
