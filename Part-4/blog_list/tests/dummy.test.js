const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const listHelper = require('../utils/list_helper');
const app = require('../app');
const Blog = require('../models/blog');
const { MONGODB_URI } = require('../utils/config');

const api = supertest(app);

before(async () => {
  console.log('Connecting to test database...');
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Test database connected');
  await Blog.deleteMany({});
  console.log('Cleared test database');
});

after(async () => {
  await mongoose.connection.close();
  console.log('Test database connection closed');
});

test('dummy returns one', async () => {
  const blogs = [];
  const result = await listHelper.dummy(blogs); 
  assert.strictEqual(result, 1);
});

describe('Testing GET methods', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('correct number of blogs is returned', async () => {
    const response = await api.get('/api/blogs');
    const blogs = await Blog.find({}); 
    assert.strictEqual(response.body.length, blogs.length);
  });
});

describe('Total likes', () => {
  const blogs = [
    { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 },
    { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 },
    { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 },
    { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 },
    { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 },
    { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
  ];

  test('when the list is empty, total likes is 0', async () => {
    const result = await listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('when the list has only one blog, equals the likes of that', async () => {
    const result = await listHelper.totalLikes([blogs[0]]);
    assert.strictEqual(result, 7);
  });

  test('when there are multiple blogs, equals the sum of all likes', async () => {
    const result = await listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });

  test('when the list has multiple blogs, returns the most liked blog', async () => {
    const result = await listHelper.favoriteBlog(blogs);
    const expected = { title: "Canonical string reduction", author: "Edsger W. Dijkstra", likes: 12 };
    assert.deepStrictEqual(result, expected);
  });

  test('returns the author with the most blogs', async () => {
    const result = await listHelper.mostBlogs(blogs);
    const expected = { author: "Robert C. Martin", blogs: 3 };
    assert.deepStrictEqual(result, expected);
  });

  test('returns the author with the most likes', async () => {
    const result = await listHelper.mostLikes(blogs);
    const expected = { author: "Edsger W. Dijkstra", likes: 17 };
    assert.deepStrictEqual(result, expected);
  });
});

describe('Testing POST methods', () => {
  test('a valid blog can be added', async () => {
    const initialBlogs = await Blog.find({});

    const newBlog = {
      title: 'Test Blog',
      author: 'Author Name',
      url: 'http://example.com',
      likes: 5
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
      const response = await api.get('/api/blogs');
      const contents = response.body.map(r => r.content);
      
      assert.strictEqual(response.body.length, initialBlogs.length + 1);
      assert(contents.includes(newBlog.content)); 
  });
  test('a blog without likes defaults to 0', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Author Name',
      url: 'http://example.com'
    };
  
    const response = await api
      .post('/api/blogs') 
      .send(newBlog)
      .expect(201) 
      .expect('Content-Type', /application\/json/); 
  
      assert.strictEqual(response.body.likes, 0); 
  });
  test('a blog without title and url is not added', async () => {
    const newBlog = {
      author: 'Author Name',
      likes: 5
    };
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

});
