const express = require('express')
const jwt = require('jsonwebtoken')
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn } = require('../controllers/user')
const { userValidator, validate, validatePassword, signInValidator } = require('../middlewares/validator')
const { isValidPasswordResetToken } = require('../middlewares/user')
const User = require('../models/user')
const { sendError } = require('../utils/helper')
// const { isAuth } = require('../middlewares/auth')

const router = express.Router()

router.post('/create', userValidator, validate, create)
router.post('/sign-in', signInValidator, validate, signIn)
router.post('/verify-email', verifyEmail)
router.post('/resend-email-verification-token', resendEmailVerificationToken)
router.post('/forget-password', forgetPassword)
router.post('/verify-password-reset-token', isValidPasswordResetToken, sendResetPasswordTokenStatus)
router.post('/reset-password', validatePassword, validate, isValidPasswordResetToken, resetPassword)

router.get('/is-auth', async (req, res) => {
  const token = req.headers?.authorization
  const jwToken = token.split('Bearer ')[1]

  if (!jwToken) return sendError(res, 'Inavlid token!')
  const decode = jwt.verify(jwToken, process.env.JWT_SECRET)
  const { userId } = decode

  const user = await User.findById(userId)
  if (!user) return sendError(res, 'Invalid token user not found!', 404)  

  res.json({ user: { id: user._id, name: user.name, email: user.email } })
})

module.exports = router