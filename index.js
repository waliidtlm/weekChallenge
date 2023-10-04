const express = require('express');
const session = require ('express-session');
const passport = require('passport');
const csurf = require ('csurf');
const cookieparser = require ('cookie-parder');
const bodyParser = require("body-parser");
const PORT = 3000;

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

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.render("newBlogPost");
  })

  app.post("/", (req, res) => {
    const { title, content } = req.body;
    const newPost = {
        id: blogPosts.length + 1; 
        title,
        content,
    }
    blogPosts.push(newPost);
    res.redirect("/");
  })

  app.delete('/blogPosts/:id',(req,res) => {
    const blogId = parseInt(req.params.id);
    const blogIndex = blogPosts.findIndex((article)=> blogPosts.id === blogId);
    
    if(blogIndex !== -1) {
        blogPosts.splice(blogIndex, 1);
        res.status(204).send('article delete')
    }else{
        res.status(404).send('article not found');
    }
  })

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})
