const express = require('express');
const router = express.Router();
const { getFilesByEmail, uploadFile , deleteFile} = require('../controllers/filesController')
const authenticate = require('../middleware/autheticate');
const multer = require('multer');
const upload = multer(); 
router.get('/:email', authenticate, getFilesByEmail);
router.post('/', authenticate, upload.single('file'),  uploadFile);
router.delete('/:id', authenticate, deleteFile);

module.exports = router;
