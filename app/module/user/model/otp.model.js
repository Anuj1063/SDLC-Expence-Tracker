const mongoose=require('mongoose')

const emailVerificationSchema=new mongoose.Schema({
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
        otp:{type:String,required:true},
        createdAt:{type:Date,default:Date.now,expires:"10m"}

},{versionKey:false})

const emailVerificationModel= mongoose.model("emailVerification",emailVerificationSchema)

module.exports=emailVerificationModel;