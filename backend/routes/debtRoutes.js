const express = require('express');
const router = express.Router();
const { addDebt, getDebts, deleteDebt,editDebt ,getDebtByName} = require('../controllers/debtController');

// Routes for managing debts
router.post('/', addDebt); // Add a new debt
router.get('/', getDebts); // Get all debts
router.post('/findByName', getDebtByName);
router.delete('/:id', deleteDebt); // Delete a specific debt
router.patch('/:id',editDebt); //Edit a specific debt
module.exports = router;
