const express = require('express');
const router = express.Router();
const { addItem, editItem, deleteItem ,getItems} = require('../controllers/itemController');

// Routes for managing items
router.get('/',getItems);//fetch items
router.post('/create', addItem); // Add item
router.patch('/edit/:id', editItem); // Edit item
router.delete('/delete/:id', deleteItem); // Delete item

module.exports = router;
