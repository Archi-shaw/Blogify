const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost:27017/blogfy')
    .then((e) => {
        console.log('Mongodb Conncted');
    })


const userRoute = require('./routes/user');

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Fixed line
app.use(express.urlencoded({ extended: false })); 

app.get('/', (req, res) => {
    return res.render("home");
});

app.use('/user', userRoute);

app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});
