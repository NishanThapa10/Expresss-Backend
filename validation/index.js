const {check, validationResult} = require('express-validator')

const categoryRules = [
  check('category_name',"Category name is required").notEmpty()
  .isLength({min:3}).withMessage("Category must be at least 3 characters")
  .matches(/^[a-zA-Z]+$/).withMessage("Category must only be alphabets")
]

const  productRules = [
  check('title',"Product name is required").notEmpty()
  .isLength({min:3}).withMessage("Product name must be at least 3 characters"),
  check('price',"Price is required").notEmpty()
  .isNumeric().withMessage("Price must be numbers"),
  check('description',"Description is required").notEmpty()
  .isLength({min:20}).withMessage("Description must be at least 20 characteers"),
  check('count_in_stock',"Count is required").notEmpty()
  .isNumeric().withMessage("Count must be a number"),
  check('category',"Product category is required").notEmpty()
  .matches(/^[0-9abcdef]{24}$/i).withMessage("Category Error")
]

const userRules = [
  check('username',"Username is required").notEmpty()
  .isLength({min:3}).withMessage("Usernamee must be at least 3 characters"),
  check('email',"Email is required").notEmpty()
  .isEmail().withMessage("Inavlid Email"),
  check('password',"Password is required").notEmpty()
  .matches(/[a-z]/).withMessage("Password must contain at least 1 lowercase alphabet")
  .matches(/[A-Z]/).withMessage("Password must contain at least 1 uppercase alphabet")
  .matches(/[0-9]/).withMessage("Password must contain at least 1 number")
  .matches(/[@#$%&*()]/).withMessage("Password must contain at least 1 special characters")
  .isLength({min:8}).withMessage("Password must be at least 8 characters")
  .isLength({max:30}).withMessage("Password must not be more than 30 characters")
]

const validationMethod = (req,res, next) =>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({error:errors.array()[0].msg})
  }
  next()
}

module.exports = {validationMethod, categoryRules, productRules,userRules}