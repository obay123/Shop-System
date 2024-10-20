const express = require('express')
const router = express.Router()
const {getDebts} = require('../controllers/deptController')

router.get('api/Debts', getDebts)

module.exports = router