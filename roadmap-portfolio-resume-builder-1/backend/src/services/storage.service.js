const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Function to handle file uploads
const uploadFile = (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', error: err });
        }
        res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
    });
};

// Function to retrieve a file
const getFile = (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'uploads', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'File not found' });
        }
    });
};

module.exports = {
    uploadFile,
    getFile
};