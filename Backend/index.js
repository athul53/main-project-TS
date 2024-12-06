require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");

const { authenticateToken } = require("./utilities");

const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");
const { error } = require("console");


mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // Fixed the typo

// Create Account
app.post("/Create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" }); // Fixed typo
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json({
        error: false,
        user: { fullName: user.fullName, email: user.email }, // Fixed case
        accessToken,
        message: "Registration Successful", // Fixed typo
    });
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: true, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: true, message: "Invalid Credentials" }); // Fixed response structure
    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.json({
        error: false,
        message: "Login successful", // Fixed typo
        user: { fullName: user.fullName, email: user.email },
        accessToken,
    });
});

// Get user
app.get("/get-user", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });

    if (!isUser) {
        return res.status(401) //.json({ error: true, message: "User not found" }); // Changed to structured response
    }

    return res.json({
        user: isUser,
        message: "User retrieved successfully",
    });
});

//Routes to handle image upload
app.post("/image-upload", upload.single("image"),async (req,res)=>{
    try{
        if(!req.file) {
            return res
            .status(400)
            .json({ error: true, message:"No image Uploaded"});
       }

       const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

       res.status(200).json({ imageUrl }) ;
    }catch (error) {
        res.status(500).json({error:true, message: error.message });
    }
});

//Delete an image from Uploads folder
app.delete("/delete-image", async (req, res) => {     
    const { imageUrl } = req.query;          
    
    if (!imageUrl) {         
        return res
            .status(400)         
            .json({ error: true, message: "imageUrl parameter is required" });     
    }     
    
    try {         
        // Extract the filename from the imageUrl         
        const filename = path.basename(imageUrl);              
        
        // Define the file path          
        const filepath = path.join(__dirname, 'uploads', filename);          
        
        // Check if the files exists         
        if (fs.existsSync(filepath)) {           
            // Delete the file from the uploads folder           
            fs.unlinkSync(filepath);           
            res.status(200).json({ message: "image deleted successfully" });         
        } else {             
            res.status(200).json({ error: true, message: "Image not found" });         
        }     
    } catch (error) {         
        res.status(500).json({ error: true, message: error.message });     
    } 
});

//Serve static files from the upload and assets directory
app.use("/uploads", express.static(path.join(__dirname,"uploads")));
app.use("/assets", express.static(path.join(__dirname,"assets")));

// Add travel story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    // Convert visitedDate from milliseconds to a Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save(); // Corrected line
        res.status(201).json({ story: travelStory, message: 'Added Successfully' });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
});


//Get all Travel Stories
app.get("/get-all-stories",authenticateToken,async (req,res)=>{
    const {userId} = req.user;

    try{
        const travelStories = await TravelStory.find({ userId: userId}).sort({
            isFavourite: -1,
        });
        res.status(200).json({ stories: travelStories });
    }catch (error){
        res.status(500).json({error: true, message: error.message});
    }
});

//Edit Travel story
app.put("/edit-story/:id",authenticateToken,async (req,res)=>{
const { id } = req.params;
const { title, story, visitedLocation, imageUrl , visitedDate } = req.body;
const { userId } = req.user;

 //validate required fields
 if(!title || !story || !visitedLocation || !visitedDate){
    return res.status(400).json({error:true, message:"all fields are required"});
}

// Convert visitedDate from milisecond to date object
const parsedVisitedDate = new Date(parseInt(visitedDate));
try {
    //find the travel story by id and ensure it belong to the authenticated user
    const travelStory = await TravelStory.findOne({_id:id, userId: userId});

    if(!travelStory){
        return res.status(404).json({ error: true, message: "Travel story not found"});
    }
    const placeholderImgUrl = `http://localhost:6000/assets/Himajal.jpg`;

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImgUrl;
    travelStory.visitedDate = parsedVisitedDate;

    await travelStory.save();
    res.status(200).json({ story:travelStory, message:'Updated Succesful'});
 } catch (error) {
    res.status(500).json({ error:  true, message: error.message });
 }


});

//Delete a travel story
app.delete("/delete-story/:id",authenticateToken,async (req,res)=>{
    const { id } = req.params;
    const { userId } = req.user;

    try{
        // find the travel story by id and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({_id: id, userId: userId });


    if (! travelStory){
        return res
        .status(404)
        .json({ error: true, message: " Travel story not found" });
    }

    // delete the travel story from the database 
    await travelStory.deleteOne({_id: id, userId: userId});

    // Extract the filename from the imageUrl
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    //define the file path
    const filepath = path.join(__dirname, 'uploads',filename);

    // Delete the image file from the uploads folder
    fs.unlink(filepath, (err) => {
        if (err){
            console.error("Failed to delete image file:", err);
            // optionally, you could still responce with a success status here
            //if you dont want to treat this as a critical error.
        }
    });

      res.status(200).json({ message: " Travel story deleted successfully"});
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//Update isFavourite
app.put("/update-is-favourite/:id",authenticateToken,async (req,res)=>{
 const { id } = req.params;
 const { isFavourite } = req.body;
 const { userId } = req.user;

 try{
    const travelStory = await TravelStory.findOne({_id: id, userId: userId})

    if(!travelStory){
        return res.status(404).json({ error: true, message: "Travel story not found "});
    }
    travelStory.isFavourite = isFavourite;

    await travelStory.save();
    res.status(200).json({ story:travelStory, message:'Update Successful'});
 } catch (error) {
    res.status(500).json({ error: true, message: error.message });
 }
})
    
//Search travel stories
app.get("/search",authenticateToken,async (req,res)=>{
 const { query } = req.query;
 const { userId } = req.user;

 if (!query){
    return res.status(404).json({error: true, message: "query is required"});
 }

 try{
    const searchResults = await TravelStory.find({
        userId: userId,
        $or: [
            { title: { $regex: query, $options: "i"} },
            { story: { $regex: query, $options:"i"} },
            { visitedLocation: {$regex: query, $options:"i"} },
        ],
      }).sort({ isFavourite: -1 });
     
      res.status(200).json({stories: searchResults});
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
     }
})

//Filter travel stories bt date range
app.get("/travel-stories/filter",authenticateToken,async (req,res)=>{
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try{
    // Convert startDate and endDate from millisecond to Date object
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    //find travel stories that belong to the authenticated user and fall within the date range
    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: {$gte: start, $lte: end },
    }).sort({ isFavourite: -1 });


    res.status(200).json({stories: filteredStories})
  }catch (error) {
    res.status(500).json({ error: true, message: error.message });
 }
});



// Get all travel stories for the main page
app.get("/get-all-travel-stories", async (req, res) => {
    try {
        const travelStories = await TravelStory.find().sort({ createdOn: -1 }); // Fetch all stories sorted by creation date
        res.status(200).json({ stories: travelStories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});





  
app.listen(8000);
module.exports = app;
