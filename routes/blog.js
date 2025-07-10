const {Router} =require('express');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const router = Router();
const comment = require('../models/comment');


router.get('/addnew' , (req,res) => {
    return res.render('addblog' , {
        user: req.user,
    })
})

const storage = multer.diskStorage({
    destination: function(req, file,cb) {
        cb(null, path.resolve(`./public/uploads`));
    },
    filename: function(req,file,cb){
       const filename = `${Date.now()} - ${file.originalname}`;
       cb(null, filename);
    }
})

const upload = multer({ storage: storage});

router.get('/:id', async(req,res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    return res.render('blog' ,{
        user: req.user,
        blog: blog,
    })
})

router.post('/comment/:blogId', async(req,res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})


router.post('/' , upload.single("coverImage"), async(req,res) => {
    const {title, body} = req.body;
       const blog = await Blog.create({
        title,
        body,
        coverImage: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
       })
    return res.redirect(`/blog/${blog._id}`);
})

module.exports = router;
