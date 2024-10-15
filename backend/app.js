const connectDB = require('./config/databse');

const express = require('express')
const app = express()

app.use(express.json()) 


connectDB()

app.get('/',(req,res)=>{
    console.log('user hit the resource')
    res.status(200).send('home page')
})


app.listen(5000, ()=>
console.log('server is runnning on port 5000......')
)