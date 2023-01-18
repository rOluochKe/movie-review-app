const jwt = require('jsonwebtoken')
const { sendError } = require("../utils/helper")
const User = require('../models/user')

exports.isAuth = () => async (req, res, next) => {
  const token = req.headers?.authorization
  const jwToken = token.split('Bearer ')[1]

  if (!jwToken) return sendError(res, 'Inavlid token!')
  const decode = jwt.verify(jwToken, process.env.JWT_SECRET)
  const { userId } = decode

  const user = await User.findById(userId)
  if (!user) return sendError(res, 'Invalid token user not found!', 404)

  req.user = user
  next()
}