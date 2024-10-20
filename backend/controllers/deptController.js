const express = require('express')

exports.getDebts=async(res,req)=>{
res.status(200).json({message:"sucess fetching depts"})
}
