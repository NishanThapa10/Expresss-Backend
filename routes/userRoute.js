const {register, verifyAccount, resendVerification, forgetPassword, resetPassword, signin, requireUser, getUserDetails, getUserList, logout} = require('../controller/userController')
const router = require('express').Router()

router.post('/register',register)
router.get('/verifyuser/:token',verifyAccount)
router.post('/resendVerification',resendVerification)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetPassword)
router.post('/login',signin)
router.get('/userlist',getUserList)
router.get('/profile/:id',requireUser, getUserDetails)
router.get('/logout',logout)

module.exports = router
