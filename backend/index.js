require('dotenv').config()
const express = require('express')
const dbConnection = require('./config/dbConnection')
const authRoutes = require('./routes/authRoutes')


const app = express();

app.use(express.json());
dbConnection();

app.use('/api/v1/auth', authRoutes)

const port = process.env.PORT || 5000;

app.listen(5000, ()=>{
    console.log(`Server is running on port ${port}`);
    
})







