const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken')
const { isValidObjectId } = require('mongoose')
const jwt = require('jsonwebtoken')
const { generateOTP, generateMailTransporter } = require('../utils/mail')
const { sendError, generateRandomByte } = require('../utils/helper')
const PasswordResetToken = require('../models/passwordResetToken')
const user = require('../models/user')

const create = async (req, res) => {
  const { name, email, password } = req.body

  const oldUser = await User.findOne({ email })
  if (oldUser) sendError(res, 'This email is already in use!')

  const newUser = new User({ name, email, password })
  await newUser.save()

  // generate a 6 digit otp
  let OTP = generateOTP()

  // store otp inside the db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP
  })
  await newEmailVerificationToken.save()

  // send opt to the user
  var transport = generateMailTransporter()

  transport.sendMail({
    from: 'no-reply@moviereviewapp.com',
    to: newUser.email,
    subject: 'Email Verification',
    html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>
    `
  })

  res.status(201).json({ 
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    }
   })
}

const verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body

  if (!isValidObjectId(userId)) return res.json({ error: 'Invalid user!' })

  const user = await User.findById(userId)
  if (!user) return sendError(res, 'user not found!', 404)

  if (user.isVerified) return sendError(res, 'user is already verified!')

  const token = await EmailVerificationToken.findOne({ owner: userId })
  if (!token) return sendError(res, 'token not found!', 404)

  const isMatched = await token.compareToken(OTP)

  if (!isMatched) return sendError(res, 'Please submit a valid OTP!')

  user.isVerified = true
  await user.save()

  await EmailVerificationToken.findByIdAndDelete(token._id)

  var transport = generateMailTransporter()

  transport.sendMail({
    from: 'no-reply@moviereviewapp.com',
    to: user.email,
    subject: 'Welcome Email',
    html: '<h1>Welcome to our Movie Review App and thanks for choosing us.'
  })

  res.json({ message: 'Your email is verified.' })
}

const resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body

  const user = await User.findById(userId)
  if (!user) return sendError(res, 'user not found!', 404)

  if (user.isVerified) return sendError(res, 'This email ID is already verified!')

  const alreadyHasToken = await EmailVerificationToken.findOne({ owner: userId })
  if (alreadyHasToken) return sendError(res, 'Only after 1 hour, you can request for another token!')

  // generate a 6 digit otp
  let OTP = generateOTP()

  // store otp inside the db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP
  })
  await newEmailVerificationToken.save()

  // send opt to the user
  var transport = generateMailTransporter()

  transport.sendMail({
    from: 'no-reply@moviereviewapp.com',
    to: user.email,
    subject: 'Email Verification',
    html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>
    `
  })

  res.json({ message: 'New OTP has been sent to your registered email account!' })
}

const forgetPassword = async (req, res) => {
  const { email } = req.body

  if (!email) return sendError(res, 'email is missing!')

  const user = await User.findOne({ email })
  if (!user) return sendError(res, 'user not found!', 404)

  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id })
  if (alreadyHasToken) return sendError(res, 'Only after 1 hour you can request for another token!')

  const token = await generateRandomByte()
  const newPasswordResetToken = await PasswordResetToken({ owner: user._id, token })
  await newPasswordResetToken.save()

  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}$id=${user._id}`

  var transport = generateMailTransporter()

  transport.sendMail({
    from: 'no-reply@moviereviewapp.com',
    to: user.email,
    subject: 'Reset Password Link',
    html: `
      <p>Click here to reset password</p>
      <a href='${resetPasswordUrl}'>Change Password</a>
    `
  })

  res.json({ message: 'Link sent to your email!' })
}

const sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true })
}

const resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body

  const user = await User.findById(userId)
  const matched = await user.comparePassword(newPassword)
  if (matched) return sendError(res, 'The new password must be different from the old one!')

  user.password = newPassword
  await user.save()

  await PasswordResetToken.findByIdAndDelete(req.resetToken._id)

  const transport = generateMailTransporter()

  transport.sendMail({
    from: 'no-reply@moviereviewapp.com',
    to: user.email,
    subject: 'Password Reset Successfully.',
    html: `
      <p>Password reset successfully</p>
      <p>Now you can use the new password</p>
    `
  })

  res.json({ message: 'Password reset successfully, now you can use your new password!' })

}

const signIn = async (req, res, next) => {
  const { email, password } = req.body 

  try {
    const user = await User.findOne({ email })
    if (!user) return sendError(res, 'Email or Password do not match!')
  
    const matched = await user.comparePassword(password)
    if (!matched) return sendError(res, 'Email or Password do not match!')
  
    const { _id, name } = user
  
    const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET)
  
    res.json({ user: { id: _id, name, email, token: jwtToken } })
  } catch (error) {
    next(error.message)
  }
}

module.exports = {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
  signIn
}