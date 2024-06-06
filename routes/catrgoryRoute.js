const {postCategory, getAllCategories, getCategory, updateCategory, deleteCategory} = require('../controller/categoryController')
const { requireAdmin } = require('../controller/userController')
const { validationMethod, categoryRules } = require('../validation')
const router = require('express').Router()

router.post('/addcategory',requireAdmin,categoryRules,validationMethod,postCategory)
router.get('/getallcategories',getAllCategories)
router.get('/getcategory/:id',getCategory)
router.put('/updatecategory/:id',requireAdmin,updateCategory)
router.delete('/deletecategory/:id',deleteCategory)
module.exports = router