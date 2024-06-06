const mongoose = require('mongoose')
  
const userSchema = new mongoose.Schema({
  username : {
    type:String,
    trim: true,
    required : true
  },
  email : {
    type : String,
    required: true
  },
  password : {
    type : String,
    required : true
  },
  role: {
    type : String,
    default: "client"
  },
  isVerified: {
    type : Boolean,
    default: false
  }
},{timestamps: true})


module.exports = mongoose.model("User",userSchema)