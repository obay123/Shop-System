const express = require('express');
const router = express.Router();
const { addDebt, getDebts, deleteDebt } = require('../controllers/debtController');

// Routes for managing debts
router.post('/', addDebt); // Add a new debt
router.get('/', getDebts); // Get all debts
router.delete('/:id', deleteDebt); // Delete a specific debt

module.exports = router;
