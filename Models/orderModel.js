const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({
  orderItems : [{
    type : ObjectId,
    ref: "OrderItems",
    required : true
  }],
  user: {
    type : ObjectId,
    ref: "User",
    required: true
  },
  street: {
    type : String,
    required : true
  },
  city : {
    type : String,
    required: true
  },
  zipcode:{
    type: String,
    required : true
  },
  country:{
    type: String,
    required: true
  },
  phone: {
    type : String,
    required : true
  },
  total:{
    type : Number,
    required: true
  },
  order_status:{
    type : String,
    default: "pending"
  },
  payment_info:{
    type : String
  }
})


module.exports = mongoose.model("Order",orderSchema)