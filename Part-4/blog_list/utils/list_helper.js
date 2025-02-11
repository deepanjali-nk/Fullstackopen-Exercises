const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null; 
  const mostLiked = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog);
  return {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes
  };
};

const mostBlogs = (blogs) => {
  const authorBlogsCount = blogs.reduce((authorCount, blog) => {
    authorCount[blog.author] = (authorCount[blog.author] || 0) + 1;
    return authorCount;
  }, {});
  
  const mostBlogsAuthor = Object.keys(authorBlogsCount).reduce((topAuthor, author) => {
    if (authorBlogsCount[author] > authorBlogsCount[topAuthor]) {
      return author;
    }
    return topAuthor;
  });

  return {
    author: mostBlogsAuthor,
    blogs: authorBlogsCount[mostBlogsAuthor]
  };
};
const mostLikes = (blogs) => {
  const authorLikesCount = blogs.reduce((likesCount, blog) => {
    likesCount[blog.author] = (likesCount[blog.author] || 0) + blog.likes;
    return likesCount;
  }, {});

  const mostLikedAuthor = Object.keys(authorLikesCount).reduce((topAuthor, author) => {
    if (authorLikesCount[author] > authorLikesCount[topAuthor]) {
      return author;
    }
    return topAuthor;
  });

  return {
    author: mostLikedAuthor,
    likes: authorLikesCount[mostLikedAuthor]
  };
};

module.exports = {
  dummy, 
  totalLikes, 
  favoriteBlog, mostBlogs , mostLikes
};
