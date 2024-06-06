const {placeOrder, getAllOrders, getOrderDetails, orderByUser, updateOrder, deleteOrder, } = require('../controller/orderController')
const router = require('express').Router()

router.post('/placeorder',placeOrder)
router.get("/orderlist", getAllOrders);
router.get("/orderdetails/:id", getOrderDetails);
router.get("/orderbyuser/:id",orderByUser)
router.put("updateorder/:id",updateOrder)
router.delete("/deleteorder/:id",deleteOrder)
module.exports = router