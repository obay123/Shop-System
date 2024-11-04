const express = require('express');
const { registerShop, loginShop } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerShop); // Optional if shops are pre-created
router.post('/login', loginShop);

module.exports = router;
