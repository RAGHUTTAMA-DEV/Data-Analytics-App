const mongoose = require('mongoose');

const schema =mongoose.Schema;

const User=new schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }


})

const UploadData=new schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    datasetName:String,
    rawData:[mongoose.Schema.Types.Mixed],
    uploadedAt:{
        type:Date,
        default:Date.now
    }

})

const Analytics=new schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    dataset:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UploadData',
    },
    matrics:{
    type:mongoose.Schema.Types.Mixed},
    createdAt:{
        type:Date,
        default:Date.now
    }

})


const UserModel = mongoose.model('User',User);
const  UploadDataModel = mongoose.model('UploadData',UploadData);
const AnalyticsModel = mongoose.model('Analytics',Analytics);

module.exports={
    UserModel,
    UploadDataModel,AnalyticsModel
};