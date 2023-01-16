const express = require('express')
require('dotenv').config();
require('./db')
const userRouter = require('./routes/user')

const app = express()

app.use(express.json())

app.use('/api/user', userRouter)

app.listen(8000, () => {
  console.log('App listening on port 8000')
})