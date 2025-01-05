const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');


router.get('/',reportController.getReports)
router.get('/:date', reportController.getReportByDate);
router.post('/create', reportController.createReport);
router.delete('/delete/:reportId', reportController.deleteReport);
router.put('/:id', reportController.updateReport);

module.exports = router;
