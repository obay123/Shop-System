const express = require('express');
const { registerShop, loginShop, deleteShop } = require('../controllers/authController');
const  router = express.Router();
const verifyToken = require('../middleware/authMiddleware')

router.post('/register', registerShop); 
router.post('/login', loginShop);
router.delete('/deleteShop/:id' ,deleteShop)

module.exports = router;
