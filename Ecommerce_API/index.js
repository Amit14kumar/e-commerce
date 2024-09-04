const express = require ("express");
const cors = require("cors"); 
const app= express();
const mongoose =require ("mongoose");



const userRoute =require("../Ecommerce_API/routes/user")
const authRoute=require("../Ecommerce_API/routes/Auth")
const productRoute=require("../Ecommerce_API/routes/Product")
const cartRoute=require("../Ecommerce_API/routes/Cart")
const orderRoute=require("../Ecommerce_API/routes/Order")

Db_url="mongodb://localhost:27017/E-commerce";
mongoose.connect(Db_url);
const conn=mongoose.connection;

conn.once('open',()=>{
 console.log('successfuly database connected');

})

conn.on('error',()=>{
    console.log('error connecting to database');
    process.exit();
   })

app.use(express.json())
app.use(cors()); //sharing between API server and React App are hostel on differect origin.
app.use('/api/user',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/products',productRoute)
app.use('/api/carts',cartRoute)
app.use('/api/orders',orderRoute)


app.listen(5001,() =>{
 console.log("Backend is Running");
});

