const express = require('express');
const session = require ('express-session');
const bodyParser = require("body-parser");
const PORT = 3000;

const app = express();




const blogPosts = [
    {
      id: 1,
      title: 'The Breaking Bad',
      content: 'This is the content of the first blog post.',
      author: 'John Doe',
      date: '2023-09-15',
    },
    
    {
        id: 2,
        title: 'Suits',
        content: 'This is the content of the first blog post.',
        author: 'John Doe',
        date: '2023-09-15',
      },

      {
        id: 3,
        title: 'Peaky Blinders',
        content: 'This is the content of the first blog post.',
        author: 'John Doe',
        date: '2023-09-15',
      },
  ];

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.set('view engine', 'ejs')
  app.set('views', './views')

  app.get("/", (req, res) => {
    res.render('home', {blogPosts: blogPosts});
  })
//get a post 
app.get('/blogPosts/:id', (req,res) => {
  const id = parseInt(req.params.id);
  const blog = blogPosts.find((x) => x.id === id);
if (blog){
  res.render(blog);
}else{
  res.status(404).send('Nothing matches your research');
}
})

//create new post
  app.post("/blogPosts", (req, res) => {
    const { title, content, author, date} = req.body;
    const newPost = {
        id: blogPosts.length +1, 
        title,
        content,
    }
    blogPosts.push(newPost);
    res.status(201).send('article added !!');
  })
//modifier blog 

app.put('/blogPosts/:id', (req, res) => {
  const blogId = parseInt(req.params.id);
  const blogIndex = blogPosts.findIndex((blog) => blog.id === blogId);

  if (blogIndex !== -1) {
    // Update the blog post with the new data from the request body
    blogPosts[blogIndex] = {
      ...blogPosts[blogIndex],
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    };
    res.redirect('/'); // Redirect to the home page after updating
  } else {
    res.status(404).send('Blog post not found');
  }
});


//delete post 
  app.delete('/blogPosts/:id',(req,res) => {
    const blogId = parseInt(req.params.id);
    const blogIndex = blogPosts.findIndex((article)=> article.id === blogId);
    
    if(blogIndex !== -1) {
        blogPosts.splice(blogIndex, 1);
        res.status(204).send('article deleted')
    }else{
        res.status(404).send('article not found');
    }
  })

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
})
