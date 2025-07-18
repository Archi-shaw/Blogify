const { Router } = require('express');
const user = require('../models/user');

const router = Router();

router.get('/signin', (req, res) => {
    return res.render('signin');
});

router.get('/signup', (req, res) => {
    return res.render('signup');
});

router.post('/signin', async (req, res) => {
    const {email, password } = req.body;
    try{
    const token = await user.matchpasswordAndGenerateToken(email,password);

    return res.cookie("token",token).redirect("/");
    }
    catch(err){
     return res.render("signin",{
        error: "Invalid email or password"
     })
    }
});

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    await user.create({
        name,
        email,
        password
    });
    return res.redirect('/');
});

router.get('/logout' ,(req,res) => {
    return res.clearCookie("token").redirect("/");
})


module.exports = router; 
