const nodemailer = require('nodemailer')

const generateOTP = (otpLength = 6) => {
  let OTP = ''

  for (let i = 1; i <= otpLength; i++) {
    const randomVal = Math.round(Math.random() * 9)
    OTP += randomVal
  }

  return OTP
}

const generateMailTransporter = () => 
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USERID,
      pass: process.env.MAILTRAP_PASSWORD
    }
  });

module.exports = {
  generateOTP,
  generateMailTransporter
}