import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.IMAGE_PATH)
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
    }
});

const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true);
    },
    storage: storage,
    limits: { fileSize: 10000000 }
});

export function handleUploadError(error, req, res, next) {
    res.status(415).send({ error: error.message })
}

export default upload;