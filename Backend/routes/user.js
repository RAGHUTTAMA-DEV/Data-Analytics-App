const jwt =require('jsonwebtoken');
const bcrypt=require('bcrypt');
const express=require('express');
const zod=require('zod');
const { UserModel } = require('../models/Schema');

const router=express.Router();

router.post('/signup',async (req,res)=>{
   try{
    const {username,password,email}=req.body;

   const validate=zod.object({
    username:zod.string().min(3).max(20),
    password:zod.string().min(6).max(20),
    email:zod.string().email()
   })

   const isValid=validate.safeParse({username,password,email});

   if(!isValid.success){
    return res.status(400).json({error:isValid.error});
   }

   const hashPassword=await bcrypt.hash(password,10);

   const user= await UserModel.create({username,password:hashPassword,email});
   const token=jwt.sign(user._id.toString(),process.env.JWT_SECRET);
   res.status(201).json({message:"user created successfully"},token);

   }catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
   }
})

router.post('/signin',async (req,res)=>{
  
    try{
        const {email,password}=req.body;

        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({error:"user not found"});
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({error:"invalid credentials"});
        }
        const token=jwt.sign({ _id: user._id },process.env.JWT_SECRET);
        res.status(200).json({message:"signin successful",token});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"});
    }
})

module.exports=router;