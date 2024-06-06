const User = require('../Models/userModel')
const bcrypt = require('bcrypt')
const saltRounds = 10
const crypto = require('crypto')
const Token = require('../Models/tokenModel')
const sendEmail = require('../utils/emailSender')
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')

//register
exports.register = async (req,res)=>{
  let {username, email, password} = req.body
  //check if username is avialable
  let userExists = await User.findOne({username})
  if(userExists){
    return res.status(400).json({error:"Username is not available."})
  }
  //check if email is not registered
  userExists = await User.findOne({email})
  if(userExists){
    return res.status(400).json({error:"Email already registered."})
  }
  //password
  let salt = await bcrypt.genSalt(saltRounds)
  let hashed_password = await bcrypt.hash(password,salt)

  let newUser = await User.create({
    username,
    email,
    password: hashed_password
  })
  if(!newUser){
    return res.status(400).json({error:"Something went wrong"})
  }

  // send verification link in email
  let token = await Token.create({
    token: crypto.randomBytes(16).toString('hex'),
    user: newUser._id
  })
  if(!token){
    return res.status(400).json({error: "Something went wrong"})
  }

  // const  URL = `http://localhost:5000/verifyuser/${token.token}`
  const  URL = `${process.env.FRONTEND_URL}/verifyuser/${token.token}`

  sendEmail({
    from: 'noreply@something.com',
    to: email,
    subject: "verify your email",
    text : `Please click on the link to verify your account ${URL}`,
    html : `<a href = ${URL}><button>Verify Account</button></a>`
  })

  res.send(newUser)
}


// verify user

exports.verifyAccount = async (req, res) => {
  // check if token is valid
  let token = await  Token.findOne({token: req.params.token})
  if(!token){
    return res.status(400).json({error:"Invalid token or token may have expired"})
  }
  // find user
  let user = await User.findById(token.user)
  if(!user){
    return res.status(400).json({error:"User associated with token not found"})
  }
  // check if already verified
  if(user.isVerified){
    return res.status(400).json({error:"User already verified, login to continue"})
  }
  // verify user
  user.isVerified = true
  let saveUser = await user.save()
  if(!saveUser){
    return res.status(400).json({error:"Failed to verify. Try agian later"})
  }
  res.send({message:"User verified successfully."})
}


//resendVerification
exports.resendVerification = async (req, res) =>{
  //check if email is registered
  let user = await User.findOne({email: req.body.email})
  if(!user){
    return res.status(400).json({error:"Email not registered"})
  }
  //check if already verified
  if(user.isVerified){
    return res.status(400).json({error:"USer alreay verified, login to continue"})
  }
  //generate token and send in email
  let token = await Token.create({
    token: crypto.randomBytes(16).toString('hex'),
    user: user._id
  })
  if(!token){
    return res.status(400).json({error: "Something went wrong"})
  }

  const  URL = `${process.env.FRONTEND_URL}/resendVerification/${token.token}`

  //send email
  sendEmail({
    from: 'noreply@something.com',
    to: user.email,
    subject: "verify your email",
    text : `Please click on the link to verify your account ${URL}`,
    html : `<a href = ${URL}><button>Verify Account</button></a>`
  })
  res.send({message:"Email verification link has been sent to your email."})
}


//fogert passsword
exports.forgetPassword = async(req,res)=>{
  let user = await User.findOne({email: req.body.email})
  if(!user){
    return res.status(400).json({error: "Email not registered"})
  }

  //generate token
  let token = await Token.create({
    token : crypto.randomBytes(16).toString('hex'),
    user: user._id
  })
  if(!token){
    return res.status(400).json({error: "Soomething went wrong"})
  }
  const  URL = `${process.env.FRONTEND_URL}/resetpassword/${token.token}`

  //send email
  sendEmail({
    from: 'noreply@something.com',
    to: user.email,
    subject: "verify your email",
    text : `Please click on the link to reset your password ${URL}`,
    html : `<a href = ${URL}><button>Reset Password</button></a>`
  })
  res.send({message:"Email verification link has been sent to your email."})
}

// Reset Password

exports.resetPassword = async (req,res)=>{
  //check token
  let token =  await Token.findOne({token: req.params.token})
  if(!token){
    return res.status(400).json({error: "Invalid token or token may have expired"})
  }
  //find user
  let user = await User.findById(token.user)
  if(!user){
    return res.status(400).json({error: "User not found"})
  }
  //hash password / save password
  let salt = await bcrypt.genSalt(saltRounds)
  user.password = await bcrypt.hash(req.body.passowrd, salt)

  if(!user){
    return res.status(400).json({error:"Something went wrong. Try again later"})
  }
  //send message to user
  res.send({message:"Password reset successfully"})
}

//signin
exports.signin = async (req,res)=>{
  //check if email is registered or not
  const {email,password} = req.body
  const user = await User.findOne({email})
  if(!user){
    return res.status(400).json({error:"Email not registered"})
  }
  //check if password is correct or not
  const validPasssword = await bcrypt.compare(password, user.password)
  if(!validPasssword){
    return res.status(400).json({error:"Invalid Password or password doesn't match"})
  }
  // check if user is verified or not
  if(!user.isVerified){
    return res.status(400).json({error:"Email not verified"})
  }
  const {_id,username, role} = user
  // generate login token using jwt
  let token = jwt.sign({
    _id,
    email,
    role,
    username
  },process.env.JWT_SECRET)
  //set data in cookies
  res.cookie('myCookie',token,{expire:86400})

  //send login info to frontend
  res.send({token, user:{_id,email,role,username}})
}

//userList
exports.getUserList = async(req,res)=>{
  let users = await User.find()
  if(!users){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(users)
}

//userDetails
exports.getUserDetails = async(req,res)=>{
  let user = await User.findById(req.params.id)
  if(!user){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(user)
}

// authorization
//login
exports.requireUser = (req, res, next) =>{
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
  })(req,res,(error)=>{
    if(error){
      return res.status(401).json({error:"You need to login to access the resource."})
    }
    else{
      next()
    }
  })
}

//admin
exports.requireAdmin = (req,res,next) => {
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'auth'
  })(req,res,(error)=>{
    if(error){
      return res.status(400).json({error:"You need to login to access this resource"})
    }
    else if(req.auth.role !== "admin"){
      return res.status(400).json({error:"You dont have the premission to access this resource"})
    }
    else{
      next()
    }
  })
}


//logout

exports.logout = (res,req) =>{
  res.clearCookie("myCookie")
  res.send({msg:"Logout Successfull"})
}

