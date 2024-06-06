const multer = require('multer')
let fs = require('fs')      // filesystem
let path = require('path') //file path


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destination = 'public/uploads'
    if(!fs.existsSync(destination)){
      fs.mkdirSync(destination,{recursive:true})
    }
    cb(null, destination)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const filename = path.basename(file.originalname, ext) + uniqueSuffix + ext
    cb(null, filename)
  }
})

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/[.](jpg|JPG)/)) {
    cb(new Error("Invalid file format. Only JPG/JPEG files are allowed."), false);
  } else {
    cb(null, true);
  }
};


exports.upload = multer({ storage: storage,
  limits:{
    fileSize : 2000000
  }, fileFilter: fileFilter  })