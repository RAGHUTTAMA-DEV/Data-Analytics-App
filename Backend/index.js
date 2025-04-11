const express = require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const {UserModel}=require('./models/Schema');
const userRoute=require('./routes/user');
const dataRoute=require('./routes/data');

const cors=require('cors');

const app=express();  
app.use(express.json());
app.use(cors());
dotenv.config();
app.use('/api/v1/user',userRoute);
app.use('/api/v1/data',dataRoute);

async function  main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongodb");
    app.listen(process.env.PORT,()=>{
        console.log("server is running on ${process.env.MONGO_URL}" );
    });
} 

main()