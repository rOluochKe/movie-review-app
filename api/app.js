const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
require('dotenv').config();
const cors = require('cors')
require('./db')
const { errorHandler } = require('./middlewares/error');
const { handleNotFound } = require('./utils/helper');

const userRouter = require('./routes/user');
const actorRouter = require('./routes/actor')
const movieRouter = require('./routes/movie')

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/actor', actorRouter)
app.use('/api/movie', movieRouter)

app.use('/*', handleNotFound)
app.use(errorHandler)

app.listen(8000, () => {
  console.log('App listening on port 8000')
})