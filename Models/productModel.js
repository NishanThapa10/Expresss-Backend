const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
  title:{
    type:String,
    required: true,
    trim: true
  },
  price:{
    type:Number,
    required: true
  },
  description:{
    type:String,
    required: true
  },
  count_in_stock:{
    type:Number,
    required: true
  },
  image:{
    type:String
  },
  rating:{
    type:Number,
    default: 1
  },
  category:{
    type: ObjectId,
    ref: "Category",
    required : true
  }
},{timestamps:true})

module.exports = mongoose.model("Product", productSchema)
