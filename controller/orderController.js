const Order = require('../Models/orderModel')
const OrderItems = require('../Models/orderItemsModel')


//place order
exports.placeOrder = async (req,res) =>{
  let orderItemsIds = await Promise.all(
    req.body.OrderItems.map(async orderItem=>{
      let ORDERITEM = await OrderItems.create({
        product: orderItem.product,
        quantity : orderItem.quantity
      })
      if(!ORDERITEM){
        return res.status(400).json({error:"Failed to place order"})
      }
      return ORDERITEM._id
    })
  )
  let individual_total = await Promise.all(
    orderItemsIds.map(async item=>{
      let orderItem = await OrderItems.findById(item).populate('product','price')
      return orderItem.product.price * orderItem.quantity
    })
  )

  let total = individual_total.reduce((a,b)=> a + b)

  let order = await Order.create({
    orderItems : orderItemsIds,
    user: req.body.user,
    total : total,
    street: req.body.street,
    city : req.body.city,
    zipcode : req.body.zipcode,
    country: req.body.country,
    phone: req.body.phone
  })
  if(!order){
    return res.status(400).json({error:"Failed to place order"})
  }

  res.send(order)

}

// to get all orders
exports.getAllOrders = async (req, res) => {
  let orders = await Order.find().populate('user').populate({path:"orderItems",populate:{path:"product",populate:"category"}})
  if (!orders) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(orders);
};


// to get order details
exports.getOrderDetails = async (req, res) => {
  let orders = await Order.findById(req.params.id).populate({path:"orderItems",populate:{path:"product"}})
  if (!orders) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(orders);
};

//order by user
exports.orderByUser = async (req, res) => {
  let orders = await Order.find({user:req.params.id}).populate('user').populate({path:"orderItems",populate:{path:"product",populate:"category"}})
  if (!orders) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(orders);
};

//updtae order
exports.updateOrder = async (req,res)=>{
  let orderToUpdate = await Order.findByIdAndUpdate(req.params.id,{
    order_status: req.body.status
  },{new:true})
  if(!orderToUpdate){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(orderToUpdate)
}


// delete order

exports.deleteOrder = (req,res) =>{
  Order.findByIdAndDelete(req.params.id)
  .then(order =>{
    if(!order){
      return res.status(400).json({error:"Order not found"})
    }
    order.orderItems.map(orderItem=>{
      OrderItems.findByIdAndDelete(orderItem)
      .then(orderitem=>{
        if(!orderitem){
          return res.status(400).json({error:"Something went wrong"})
        }
      })
    })
    res.send({message:"Order deleted successsfully"})
  })
  .catch(error=>{
    return res.status(400).json({error: error.message})
  })
}


