const express = require('express');
const router = express.Router();
const {createComment, getCommentsByFileId} = require('../controllers/commentController');

router.post('/', createComment); 
router.get('/:file_id', getCommentsByFileId); 

module.exports = router;
