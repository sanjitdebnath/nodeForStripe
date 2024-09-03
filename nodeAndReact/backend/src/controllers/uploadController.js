const { get_All_Media, set_media, delete_single_media,get_Media_count_db } = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
}).single('file');

// Upload image endpoint
exports.upload = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).send('Error uploading file');
        }
        let result = await set_media(req.file);
        if (result.acknowledged) {
            res.send({ status: "true", message: "File uploaded successfully"});
        } else {
            res.send({ status: "false", message: "File Failed to upload" });
        }
    });
};

// Get all media endpoint
exports.get_AllMedia = async (req, res) => {
    try {
        const result = await get_All_Media();
        res.send({ status: "success", data: result });
    } catch (error) {
        console.error('Error fetching all media:', error);
        res.status(500).send({ status: "error", message: "Failed to fetch media" });
    }
};

exports.get_Media_count = async (req, res) => {
    try {
        const count = await get_Media_count_db();
        res.send({ status: "success", data: {count : count} });
    } catch (error) {
        console.error('Error fetching all media:', error);
        res.status(500).send({ status: "error", message: "Failed to fetch media" });
    }
};

// Delete single media endpoint
exports.delete_single_data = async (req, res) => {
    const { id,filename } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    try {
        const result = await delete_single_media(id);
        if(result)
        {
            const filePath = path.join(__dirname, '../../uploads',filename);
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).send({ status: "failed", message: "Error deleting file" });
              }
              console.log('File deleted successfully');
              res.send({ status: "success", message: "File deleted successfully" });
            });
        }
        else{
            return res.status(500).send({ status: "failed", message: "Error deleting file" });
        }
    } catch (error) {
        console.error('Error deleting media:', error);
        res.status(500).json({ status: "error", message: "Failed to delete media" });
    }
};
