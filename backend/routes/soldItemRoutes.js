const express = require('express');
const router = express.Router();
const { getSoldItemsByDaysAgo  ,addSoldItem, editSoldItem, deleteSoldItem } = require('../controllers/soldItemController');

// Routes for managing sold items
router.get('/api/soldItems',getSoldItemsByDaysAgo ) //get today solditems
router.post('/api/soldItems', addSoldItem); // Add a sold item
router.patch('/api/soldItems/:id', editSoldItem); // Edit a sold item
router.delete('/api/soldItems/:id', deleteSoldItem); // Delete a sold item

module.exports = router;
