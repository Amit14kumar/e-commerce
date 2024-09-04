const router=require("express").Router()
const User = require('../models/users')
const CryptoJS= require("crypto-js")
const jwt = require("jsonwebtoken")


const secretKey = "amit14kumar";//Need to keep this one as my own encrypted secret key
const jwtSecret = "amit14kumar";


//Register end-point
router.post('/register', async (req, res) => {
  try {

      // Check if user with the same username already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
}

    // Encrypt the password using AES
    const encryptedPassword = CryptoJS.AES.encrypt(req.body.password,secretKey ).toString(); 

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: encryptedPassword, // Store the encrypted password
        isAdmin: req.body.isAdmin || false  // Default to false if not provided
    });


      // Save the user to the database
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);  // Return the saved user as a response
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error inserting user", error: err });
    }
  });

    
  router.post('/login', async (req, res) => {
    try {
      // Find the user by email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      // Decrypt the stored password
      const decryptedPassword = CryptoJS.AES.decrypt(user.password, secretKey).toString(CryptoJS.enc.Utf8);
  
      // Compare the decrypted password with the one provided
      if (decryptedPassword !== req.body.password) {
        return res.status(401).json({ message: "Incorrect password" });
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        jwtSecret,
        { expiresIn: "2h" }  // Token expires in 2 hours
      );
  
      // Return the token and user details
      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error during login", error: err });
    }
  });




module.exports=router