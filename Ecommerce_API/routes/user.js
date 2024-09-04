const router = require('express').Router();
const User = require('../models/users.js');  
const CryptoJS = require("crypto-js");

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../routes/Verify_token");


const secretKey = "amit14kumar";

// UPDATE USER
router.put("/:id",verifyToken, async (req, res) => {
    try {
        // Encrypt the new password if it's being updated
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, secretKey).toString();
        }

        // Update user data
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER (Admin only)
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;  // Exclude password from the response
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL USERS (Admin only)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query 
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  try {
      // Example 1: Count of all users
      const totalUsers = await User.countDocuments();

      // Example 2: Count of users registered in the last month (for example)
      const date = new Date();
      const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

      const usersLastMonth = await User.countDocuments({
          createdAt: { $gte: lastMonth }
      });

      // Example 3: Breakdown of users by role (if you have roles)
      const userRoles = await User.aggregate([
          { $group: { _id: "$role", count: { $sum: 1 } } }
      ]);

      res.status(200).json({
          totalUsers,
          usersLastMonth,
          userRoles
      });
  } catch (err) {
      res.status(500).json(err.message);
  }
});
// Route to get all users
/*  router.get('/all', async (req, res) => {
  try {
    const users = await User.find(); 
    console.log(users)
    res.status(200).json(users);  // Send the users as a JSON response
  } catch (err) {
    console.log (err)
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

router.post('/add', async (req, res) => {
    try {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin || false  // Default to false if not provided
      });
  
      // Save the user to the database
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);  // Return the saved user as a response
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error inserting user", error: err });
    }
  });/*  */






module.exports = router; 
