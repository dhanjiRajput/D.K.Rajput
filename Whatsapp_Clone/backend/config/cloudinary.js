const multer=require('multer');
const cloudinary=require('cloudinary');
const dotenv=require('dotenv');
const fs=require('fs');


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});


const uplodFileToCloudinary = async (file) => {
  try {
    const options = {
      resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
    };

    return new Promise((resolve,reject)=>{
        const uploader=file.mimetype.startsWith('video') ? cloudinary.uploader.upload_large : cloudinary.uploader.upload;
        uploader(file.path,options,(error,result)=>{
            fs.unlink(file.path,()=>{});
            if(error){
                return reject(error)
            }
            resolve(result);
        });
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

const multerMiddleware=multer({dest:'uploads/'}).single('media');

module.exports = {uplodFileToCloudinary,multerMiddleware};