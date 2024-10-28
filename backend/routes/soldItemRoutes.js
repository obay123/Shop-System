const express = require('express');
const router = express.Router();
const soldItemController = require('../controllers/soldItemController');

// Route to add a sold item to a report
router.post('/:reportId/add', soldItemController.addSoldItemToReport);

// Route to edit a specific sold item in a report
router.put('/:reportId/edit/:soldItemId', soldItemController.editSingleSoldItemInReport);

// Route to delete a specific sold item from a report
router.delete('/:reportId/delete/:soldItemId', soldItemController.deleteSingleSoldItemFromReport);

module.exports = router;
