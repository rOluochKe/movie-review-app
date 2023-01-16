const mongoose = require('mongoose')

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB is connected!')
}).catch((ex) => {
  console.log('DB connection failed!: ', ex)
})