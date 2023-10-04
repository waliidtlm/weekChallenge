const express = require('express');
const session = require ('express-session');
const passport = require('passport');
const csurf = require ('csurf');
const cookieparser = require ('cookie-parder');
const app = express();


const blogPosts = [
    {
      id: 1,
      title: 'First Blog Post',
      content: 'This is the content of the first blog post.',
      author: 'John Doe',
      date: '2023-09-15',
    },
    
    {
        id: 2,
        title: 'Second Blog Post',
        content: 'This is the content of the first blog post.',
        author: 'John Doe',
        date: '2023-09-15',
      },

      {
        id: 3,
        title: ' Third Blog Post',
        content: 'This is the content of the first blog post.',
        author: 'John Doe',
        date: '2023-09-15',
      },
  ];

  const userProfiles = [
    {
      id: 1,
      username: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      // Other user profile information...
    },
    {
        id: 2,
        username: 'albert column',
        name: 'John Doe',
        email: 'john@example.com',
        // Other user profile information...
      },
      {
        id: 3,
        username: 'david raw',
        name: 'John Doe',
        email: 'john@example.com',
        // Other user profile information...
      },
  ];


