const express = require('express')
const mongoose = require("mongoose")
const dotenv = require('dotenv').config()
const cors = require('cors')
const authController = require('./controllers/authController')
const app = express()

// connect db
mongoose.set('strictQuery', false);
//connect mongodb to record
mongoose.connect('mongodb://0.0.0.0:27017/record');

// routes
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', authController)





// connect server
app.listen(process.env.PORT, () => console.log('Server has been started successfully'))