const express  = require('express')
const router = express.Router

router.get('/api/dept',(req,res)=>{
    res.status(200).json({sucess:true,data:dept})
})