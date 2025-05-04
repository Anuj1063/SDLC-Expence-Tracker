const  transporter  = require("../config/email.config")
const otpVerifyModel=require('../module/user/model/otp.model')

const sendEmailVerificationOTP=async( user)=>{
    if (!user || !user.email) {
        
        throw new Error("Recipient email not found");
      }
    // Generate a random 4-digit number
  const otp = Math.floor(1000 + Math.random() * 9000);

  // create OTP in Database
  const otpRecord=await otpVerifyModel.create({ userId: user._id, otp: otp })
  console.log(otpRecord,"Otp Record")

  

 

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "OTP - Verify your account",
    html: `<p>Dear ${user.firstName},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
    <h2>OTP: ${otp}</h2>
    <p>This OTP is valid for 15 minutes. If you didn't request this OTP, please ignore this email.</p>`
  })

  return otp
}




module.exports = sendEmailVerificationOTP