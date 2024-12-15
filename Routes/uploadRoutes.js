import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/')
    },
    filename(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, cb) => {
    const filetypes = /\.(jpe?g|png|webp)$/i; // Match .jpeg, .jpg, .png, .webp (case-insensitive)
    const mimetypes = /image\/(jpe?g|png|webp)/;

    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Images only!"), false);
    }
};


const upload = multer({
    storage,
    fileFilter
})
const uploadSingleImage = upload.single("image")

router.post("/", (req, res) => {
    uploadSingleImage(req, res, err => {
        if(err) {
            return res.status(400).json({ message: err.message });
        } else if(req.file){
            res.status(200).send({
                message: "File uploaded successfully",
                image: `/${req.file.path}`
            });

        }else{
            return res.status(400).json({ message: "No file uploaded" });
        }
    })
})

export default router