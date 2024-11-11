const express = require('express');
const router = express.Router();
const { getMilk, addMilk, editMilk, deleteMilk } = require('../controllers/milkController.js');

router.get('/', getMilk);
router.post('/create', addMilk); 
router.patch('/edit/:id', editMilk);
router.delete('/delete/:id', deleteMilk);

module.exports = router;
    