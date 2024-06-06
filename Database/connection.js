const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE).then(()=>(
  console.log("database connected")
))
.catch(error=>console.log(error.message))