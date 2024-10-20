const express = require('express');
const router = express.Router();
const { addItem, editItem, deleteItem ,getItems} = require('../controllers/itemController');

// Routes for managing items
router.get('/api/items',getItems);//fetch items
router.post('/api/items', addItem); // Add item
router.patch('/api/items/:id', editItem); // Edit item
router.delete('/api/items/:id', deleteItem); // Delete item

module.exports = router;
