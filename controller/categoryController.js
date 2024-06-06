const Category = require('../Models/categoryModel')

//to add Category
exports.postCategory = async (req,res)=>{
  try {
    let category = await Category.findOne({category_name: req.body.category_name})
    if (category){
      return res.status(400).json({error:"Category already exists"})
    }
    let categoryToAdd = await Category.create({
      category_name : req.body.category_name
    })
    if(!categoryToAdd){
      return res.status(400).json({error:"Something went wrong"})
    }
    res.send(categoryToAdd)
  }
  catch(error){
    return res.status(500).json({error:error.message})
  }
}


//to get all category
exports.getAllCategories = async(req,res)=>{
  let categories = await Category.find() 
  if(!categories){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(categories)
}

//to get category details

exports.getCategory = async (req,res) => {
  let category = await Category.findById(req.params.id)
  if(!category){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(category)
}

//to update category

exports.updateCategory = async (req,res) => {
  let categoryToUpdate = await Category.findByIdAndUpdate(req.params.id,{
    category_name : req.body.category_name
  },{new:true})
  if(!categoryToUpdate){
    return res.status(400).json({error:"Something went wrong"})
  }
  res.send(categoryToUpdate)
}


//to delete category

exports.deleteCategory = async (req,res)=>{
  try{
    let deletedCategory = await Category.findByIdAndDelete(req.params.id)
    if(!deletedCategory){
      return res.status(400).json({error:"Category not found"})
    }
    res.send({message:"Category deleted successfully"})
  }
  catch(error){
    res.status(400).json({error: error.message})
  }
}