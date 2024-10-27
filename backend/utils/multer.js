const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    },
});

const upload = multer({
    storage,
});

module.exports = upload;
