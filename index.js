const express = require('express')
require('dotenv').config()
require('./Database/connection')

// routes/endpoints import
const CategoryRoute = require('./routes/catrgoryRoute')
const ProductRoute = require('./routes/productRoute')
const UserRoute = require('./routes/userRoute')
const OrderRoute = require('./routes/orderRoute')
const cors = require('cors')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())

// using routes
app.use('/api',CategoryRoute)
app.use('/api',ProductRoute)
app.use('/api',UserRoute)
app.use('/api',OrderRoute)

app.use('/public/uploads',express.static('public/uploads'))

app.get('/',(request,response)=>{
  response.send("Hello");
})


app.listen(port,()=>{
  console.log("App started successfully")
})