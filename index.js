const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
const Blog = require('./models/blog');

const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost:27017/blogfy')
    .then((e) => {
        console.log('Mongodb Conncted');
    })


const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const { checkForAuthenficationCookie } = require('./middleware/auth');

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Fixed line
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(checkForAuthenficationCookie('token'));


app.get('/', async(req, res) => {
    const allBlog = await Blog.find({}).sort({ 'Created'})
    return res.render("home",{
        user: req.user,
    });

});

app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});
