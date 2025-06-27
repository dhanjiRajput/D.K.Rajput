import multer from 'multer';

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
}