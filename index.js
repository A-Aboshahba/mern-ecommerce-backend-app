// const path = require('path');
// const database = "mongodb://localhost:27017/shop"
// const {database} = require('./config/database')
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv")
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute')
const cartRoute = require('./routes/cartRoute')
const orderRoute = require('./routes/orderRoute')


// config the env file --------------------------------------
dotenv.config();


// connect to db---------------------------------------------------------------------------

/*        first_method     */
// mongoose.connect( database , 
//                 ()=>{console.log('connect to database')}, // callback functiob when connected to the database
//                 e => console.error(e)                     // if there is any error 
//                 );
/*         second_method       */
mongoose.connect( process.env.MONGO_URL )
.then(()=>{console.log('connected successfully to database')})
.catch((err) => console.error(err))

// initialize app--------------------------------------------------------------
const app = express();       
app.use(express.json())        

// view engine setup---------------------------------------------------------
// app.set('views',path.join(__dirname,'views'));
// app.set('view engine','ejs');

// set public folder -------------------------------------------
// app.use(express.static(path.join(__dirname,'public')));
app.use("/api/auth" , authRoute)
app.use('/api/users', userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)

// start the server -------------------------------------------------
app.listen( process.env.PORT || 5000 , ()=>{
    console.log(`server started on port ${process.env.PORT}`)
})