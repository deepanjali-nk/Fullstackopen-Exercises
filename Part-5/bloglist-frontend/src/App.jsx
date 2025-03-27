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


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user');
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON);
        setUser(user);
        blogService.setToken(user.token);
        fetchBlogs(user.token);
        console.log('User session restored:', user.token);
      } catch (error) {
        console.error('Error during user session handling:', error);
      }
    }
  }, []);

  const fetchBlogs = async (token) => {
    try {
      const blogs = await blogService.getAll(token);
      console.log('Fetched blogs:', blogs);
      const sortedBlogs=blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if(confirmDelete){
      try{
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog.id !== id));
        setNotification('Blog deleted successfully');
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
      catch(error){
        console.error('Error deleting blog:', error);
        setNotification('Error deleting blog');
        setTimeout(() => {
          setNotification(null);
        }, 5000);
    }
  }}

  const handleLogout = () => {
    setUser(null);
    setBlogs([]);
    setUsername('');
    setPassword('');
    window.localStorage.removeItem('user');
  };

  const addBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog);
      const updatedBlog = {
        ...createdBlog,
        user: {
          username: user.username,
          name: user.name,
        },
      };
      setBlogs((prevBlogs) => [...prevBlogs, updatedBlog]);  // Add new blog immediately to the state
      setNotification(`A new blog is added`);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error('Error creating blog:', error);
      setNotification('Error creating blog');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const updateLikes = async (id, updatedBlog) => {
    try {
      const response = await blogService.update(id, updatedBlog);
      console.log('response:', response);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === id ? { ...blog, likes: response.likes } : blog
        )
      );
    } catch (error) {
      console.error("Error updating likes:", error);
      setNotification("Error updating likes");
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setNewBlog((prevBlog) => ({
  //     ...prevBlog,
  //     [name]: value,
  //   }));
  // };

  // const userBlogs = user ? blogs.filter((blog) => blog.user.username === user.username) : [];

  const userBlogs= blogs;
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
      <BlogForm createBlog={addBlog}/>
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
          <p>{user.name} logged-in</p> <button onClick={handleLogout} id='logout'>logout</button>
          {blogForm()}
          <h2>Your Blogs</h2>
          {/* <p>{userBlogs.length} blog(s) found</p> */}


          {userBlogs.length > 0 ? (
            userBlogs.map((blog) => <Blog key={blog.id} blog={blog} updateLikes={updateLikes} handleDelete={handleDelete} />)
          ) : (
            <p>You have not created any blogs yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
