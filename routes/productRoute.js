const { addProduct, getAllProducts, updateProduct, getProductBycategory, getProduct, deletePrdouct, getFilteredProducts, getRelatedProducts} = require('../controller/productController')
const { requireAdmin } = require('../controller/userController')
const { upload } = require('../utils/fileUpload')
const { productRules, validationMethod } = require('../validation')

const router = require('express').Router()

router.post('/addproduct',requireAdmin,upload.single('image'), productRules, validationMethod, addProduct) //requireAdmin,productRules, validationMethod
router.get('/products', getAllProducts)
router.get('/getproduct/:id',getProduct)
router.put('/updateproduct/:id',requireAdmin,updateProduct)
router.get('/getproductbycategory/:categoryid',getProductBycategory)
router.delete('/deleteproduct/:id',deletePrdouct) // requireAdmin
router.post('/getfilteredproducts',getFilteredProducts)
router.get('/relatedproducts/:id',getRelatedProducts)
module.exports = router
