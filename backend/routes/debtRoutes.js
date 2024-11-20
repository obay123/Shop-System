const express = require('express');
const router = express.Router();
const { addDebt, getDebts, deleteDebt,editDebt ,getDebtByName} = require('../controllers/debtController');

// Routes for managing debts
router.get('/', getDebts); // Get all debts
router.post('/create', addDebt); // Add a new debt
router.post('/name/:name', getDebtByName);
router.delete('/delete/:id', deleteDebt); // Delete a specific debt
router.patch('/edit/:id',editDebt); //Edit a specific debt
module.exports = router;
