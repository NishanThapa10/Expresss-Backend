const Product = require('../Models/productModel')

// to add new product

exports.addProduct = async (req, res) => {

  if(!req.file){
    return res.status(400).send({error:"File is missing"})
  }
  let product = await Product.create ({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    count_in_stock: req.body.count_in_stock,
    image: req.file?.path,
    category: req.body.category
  })
  if(!product){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(product)
}


//to get all products

exports.getAllProducts = async (req,res) =>{
  let products = await Product.find().populate('category','category_name')
  // .select('title').select('price').select('description')
  if(!products){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(products)
} 


//get product details

exports.getProduct = async(req,res)=>{
  let product = await Product.findById(req.params.id)
  if(!product){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(product)
}

//update product


exports.updateProduct = async (req,res)=>{
  let productToUpdate = await Product.findByIdAndUpdate(req.params.id,{
    title: req.body.title,
    price : req.body.price,
    description: req.body.description,
    count_in_stock: req.body.count_in_stock,
    category: req.body.category
  },{new:true})
  if(!productToUpdate){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(productToUpdate)
}


//delete 

exports.deletePrdouct = async (req,res)=>{
  try{
    let deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct){
      return res.status(400).json({error:"Something went wrong"})
    }
    res.send({message:"Product deleted sucessfully"})
  }
  catch(error){
    res.status(400).json({error:error.message})
  }
}


//get product by category

exports.getProductBycategory = async (req,res)=>{
  let products = await Product.find({category: req.params.categoryid}).populate('category','category_name')
  if(!products){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(products)
}



exports.getFilteredProducts = async (req,res) =>{
  let filters = req.body
  let filter = {}
  for(var key in filters){
    if(filters[key].length>0){
      if(key==="category"){
        filter[key]=filters[key]
      }
      else{
        filter[key]={
          "$gte": filters[key][0],
          "$lte": filters[key][1]
        }
      }
    }
  }
  let products = await Product.find(filter).populate('category')
  if(!products){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(products)
}


exports.getRelatedProducts = async (req,res) =>{
  let product = await Product.findById(req.params.id)
  let products = await Product.find({
    category : product.category,
    _id: {"$ne":product._id}
  })
  if(!product){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(products)
}