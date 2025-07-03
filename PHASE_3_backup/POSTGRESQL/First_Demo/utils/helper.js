import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileName=`${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
});

const uploads = multer({storage:storage});
export default uploads;

export const generateRandomNum=()=>{
    return uuidv4();
};

export const removeImage = (imagePath) => {
    if (!imagePath) return;

    // Remove leading slash if present: "/uploads/image.jpg" → "uploads/image.jpg"
    const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    const fullPath = path.join(process.cwd(), normalizedPath); // Safe and cross-platform

    if (fs.existsSync(fullPath)) {
        try {
            fs.unlinkSync(fullPath);
            console.log(`🗑️ Removed image: ${fullPath}`);
        } catch (err) {
            console.error(`❌ Failed to remove image: ${err.message}`);
        }
    } else {
        console.warn(`⚠️ Image not found at: ${fullPath}`);
    }
};