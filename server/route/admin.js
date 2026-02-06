const express=require('express');
const router=express.Router();
//this is used to research and retrieve data froom the database
const Post=require('../models/post');
// this is for the user schema, we can start using it 
const User=require('../models/user');
// this bcrypt for encryption and decryption of password
const bcrypt= require('bcrypt');
// this wil help us with the cookie
const jwt= require('jsonwebtoken');


// here we create a global call for the admin layout
// this makes sure that the content of the body is thrown into the body and sandwitched within the header and the footer
const adminLayout='../views/layouts/admin';
// we can now use this directory to pass and send to the render route
const jwtSecret=process.env.JWT_SECRET;




// lets clear of middle ware
// check login
const authMiddleware=(req, res, next)=>{
  console.log('Middleware triggered!');
  const token=req.cookies.token;

  if(!token){
    console.log('No token found');
    return res.status(401).json({ message: 'unauthorized'});
  }

  try{
    const decoded=jwt.verify(token, jwtSecret);
    req.userId=decoded.userId;
    console.log('Token Validated - Moving to Dashboard');
    next();
  }catch(error){
    res.status(401).json({message: 'unauthorized '});
  }
}
// we use this for pages that requires login, we add this middleware to the pages




//GET Admin - Login Pgae
router.get('/admin', async (req, res) => {
    
    try{
        const locals = {
        title: "Admin blog",
        description: "simple blog created with Express"
    }
      
      res.render('admin/index', {locals, layout:adminLayout});
    } catch(error){
      console.log(error);
    }
});






// Post Admin Check Login

router.post('/admin', async (req, res) => {
    
    try{
      const {username, password}= req.body;
      const user=await User.findOne({ username });
      if(!user){
        return res.status(401).json({ message: 'invalid credentials'});
      }
      const ispasswordvalid=await bcrypt.compare(password, user.password);

      if(!ispasswordvalid){
        return res.status(401).json({ message: 'invalid credentials'});
      }

      const token=jwt.sign({userId: user.Id}, jwtSecret);
      // this jwt is declared in the env file and also a const line above of the page for importing
      res.cookie('token', token, {httpOnly:true});
      // this token is for the jwt above it

      res.redirect('/dashboard');


    } catch(error){
      console.log(error);
    }
});




// Post Admin check login for then dashboard
//Get Admin dashboard 
router.get('/dashboard', authMiddleware, async(req, res) =>{
  try{
    const locals = {
      title: 'Dashboard',
      description: 'Simple Blog created with Node.js, Express & MongoDB.'}
    const data=await Post.find(); 
    res.render('admin/dashboard', {
      locals,
      data,
      layout:adminLayout
    });

  }catch (error){
    console.log(error);
  }   
})


// Get Admin Create new post
router.get('/add-post', authMiddleware, async(req, res) =>{
  try{
    const locals = {
      title: 'Add Post',
      description: 'Simple Blog created with Node.js, Express & MongoDB.'}
    const data=await Post.find(); 
    res.render('admin/add-post', {
      locals,
      layout:adminLayout
    });

  }catch (error){
    console.log(error);
  }   
})


//Post Admin create New Post
router.post('/add-post', authMiddleware, async(req, res) =>{
  try{

    // now inserting into the database
    try{
      const newPost=new Post({
        title:req.body.title,
        body: req.body.body
      });
      await Post.create(newPost);
      res.redirect('/dashboard');
    }catch(error){
      console.log(error);
    }
    
  }catch (error){
    console.log(error);
  }   
})



// PUT
// Admin- creat post
router.post('/add-post', authMiddleware, async(req, res) =>{
  try{

    // now inserting into the database
    try{
      const newPost=new Post({
        title:req.body.title,
        body: req.body.body
      });
      await Post.create(newPost);
      res.redirect('/dashboard');
    }catch(error){
      console.log(error);
    }
    
  }catch (error){
    console.log(error);
  }   
})




// // Post Admin Check Login (initial stage)

// router.post('/admin', async (req, res) => {
    
//     try{
//       const {username, password}= req.body;


//       // this if statement is uesd to check / validation after the creation of username and password
//       if(req.body.username ==='admin' && req.body.password=== 'password'){
//         res.send('you are logged in')
//       }else{
//         res.send('wrong username and password');
//       }



//       console.log(req.body);
//       res.redirect('/admin');
//     } catch(error){
//       console.log(error);
//     }
// });



// note we have to get before we can edit or update
//GET
// Edit and update a post
router.get('/edit-post/:id', authMiddleware, async(req, res) =>{
  try{
    const locals={
      title:"Edit Post",
      description:"Free blog user management",
    };
     const data=await Post.findOne({ _id:req.params.id});
     res.render('admin/edit-post',{
      locals,
      data,
      layout:adminLayout
     });
 }catch (error){
    console.log(error);
  }   
})






//PUT
// Edit and update a post
router.put('/edit-post/:id', authMiddleware, async(req, res) =>{
  try{
     await Post.findByIdAndUpdate(req.params.id,{
      title: req.body.title,
      body: req.body.body,
      UpdateAt:Date.now()
     });

     res.redirect(`/edit-post/${req.params.id}`);
  }catch (error){
    console.log(error);
  }   
})





// Delect
// Admin- create New Post
router.delete('/delete-post/:id', authMiddleware, async(req, res)=>{
  try{
    await Post.deleteOne({ _id: req.params.id});
    res.redirect('/dashboard');
  }catch(error){
    console.log(error);

  }
} )




//GET
//Log out
router.get('/logout', (req, res)=>{
  res.clearCookie('token');
  // res.json({message: 'Logout successful'});
  res.redirect('/');

});






router.post('/register', async (req, res) => {
    
    try{
      const {username, password}= req.body;
      const hashedPassword=await bcrypt.hash(password, 10);
      try{
        const user=await User.create({username, password:hashedPassword });
        res.status(201).json({message: 'user Created', user});
      }catch(error){
        console.log("DETAILED DATABASE ERROR:", error);

        if(error.code===11000){
          return res.status(409).json({message:'user already in use'});
        }
        res.status(500).json({message: 'internal server error'});

      }

    } catch (error) {
        console.log("Hashing Error:", error);
        res.status(500).json({ message: 'Error hashing password' });
    }
});




module.exports=router;