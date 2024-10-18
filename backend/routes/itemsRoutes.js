const express  = require('express')
const router = express.Router()


const  {
    getItemsByDaysAgo,
    addItem,
    editItem,
    deleteItem
       }=require('../controllers/itemController')


    router.route('/').get(getItemsByDaysAgo).post(addItem)
    router.route('/:id').patch(editItem).delete(deleteItem)



    module.exports = router;  