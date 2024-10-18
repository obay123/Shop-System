const connectDB = require('./config/databse');
const express = require('express')
const app = express()

require('dotenv').config
connectDB()

app.use(express.json()) 






const itemRoutes = require('./routes/itemsRoutes')
app.use('api/items',itemRoutes)

app.get('/',(req,res)=>{
    console.log('user hit the resource')
    res.status(200).send('home page')
})


app.listen(process.env.PORT, ()=>
console.log('server is runnning on port 5000......')
)