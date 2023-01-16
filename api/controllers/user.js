const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken')
const { isValidObjectId } = require('mongoose')
const { generateOTP, generateMailTransporter } = require('../utils/mail')
const { sendError } = require('../utils/helper')

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

  res.status(201).json({ message: 'Please verify your email. OTP has been sent to your email account!' })
}

const verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body

  if (!isValidObjectId(userId)) return res.json({ error: 'Invalid user!' })

  const user = await User.findById(userId)
  if (!user) return sendError(res, 'user not found!', 404)

  if (user.isVerified) return sendError(res, 'user is already verified!')

  const token = await EmailVerificationToken.findOne({ owner: userId })
  if (!token) return sendError(res, 'token not found!', 404)

  const isMatched = await token.compaireToken(OTP)

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

module.exports = {
  create,
  verifyEmail,
  resendEmailVerificationToken
}