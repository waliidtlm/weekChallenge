const express = require('express');
const session = require ('express-session');
const bodyParser = require("body-parser");
const PORT = 3000;

const app = express();

const blogPosts = [
    {
      id: 1,
      title: 'The Breaking Bad',
      content: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
      author: 'Vince Gilligan',
      date: '2008-2013',
      image: "/breaking bad.jpg"
    },
    
    {
        id: 2,
        title: 'Suits',
        content: "On the run from a drug deal gone bad, brilliant college dropout Mike Ross finds himself working with Harvey Specter, one of New York City's best lawyers",
        author: 'Aaron Korsh',
        date: '2011–2019',
        image: "/suits.jpg"
      },

      {
        id: 3,
        title: 'Peaky Blinders',
        content: 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.',
        author: 'Steven Knight',
        date: '2013-2022',
        image: "/Peaky Blinders.jpg"
      },
  ];
  
  app.use(express.static (__dirname + '/public'));
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
