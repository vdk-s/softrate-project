const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { requireAuth } = require('../middleware/auth');

router.get('/', authorController.getAuthors);
router.get('/:id', authorController.getAuthorById);
router.post('/', requireAuth, authorController.createAuthor);
router.put('/:id', requireAuth, authorController.updateAuthor);
router.delete('/:id', requireAuth, authorController.deleteAuthor);

module.exports = router;
