const express = require('express');
const router = express.Router();
const {
  getSharedUsers,
  getSharedFilesByEmail,
  shareFile,
  updateLastAccessed,
  shareFileByLink,
  shareFileByEmail,
  getFileByLinkId,
} = require('../controllers/sharedController');

router.get('/sharedFiles/:email', getSharedFilesByEmail);
router.get('/:fileId', getSharedUsers);
router.post('/share', shareFile);
router.put('/access', updateLastAccessed);
router.post('/link', shareFileByLink);
router.post('/email', shareFileByEmail);
router.get('/link/:linkId', getFileByLinkId);

module.exports = router;
