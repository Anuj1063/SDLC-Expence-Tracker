
const transporter = require("../config/email.config");


const sendWelcomeEmail = async (user) => {
    console.log("Sending welcome email to:", user.email); // 👈

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "🎉 Registration Successful",
    html: `<p>Dear ${user.firstName},</p>
           <p>Your email has been successfully verified and your account is now fully active.</p>
           <p>You can now log in and start using our services.</p>
           <br><p>Thank you for joining us!</p>`
  });
};

module.exports = sendWelcomeEmail;
