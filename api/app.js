const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
require('dotenv').config();
require('./db')
const userRouter = require('./routes/user');
const { errorHandler } = require('./middlewares/error');

const app = express()
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/user', userRouter)

app.use(errorHandler)

app.listen(8000, () => {
  console.log('App listening on port 8000')
})