const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Route to create a new report
router.post('/create', reportController.createReport);

// Route to get a report by date
router.get('/:date', reportController.getReportByDate);

// Route to delete a report along with its sold items
router.delete('/:reportId', reportController.deleteReport);

module.exports = router;
