const express = require('express');
const app = express();


//importing routes
const reportRoutes = require('./routes/reportRoutes');
const soldItemRoutes = require('./routes/soldItemRoutes');
const ItemRoutes = require('./routes/itemsRoutes')
const debtRoutes = require('./routes/debtRoutes')
const milkRoutes = require('./routes/milkRoutes')
//Databse connection
const connectDB = require('./config/databse');

//dotevnv and invoking db connection funciton
require('dotenv').config();
connectDB();

//json middleware
app.use(express.json());

// Use report routes
app.use('/api/reports', reportRoutes);

// Use sold item routes
app.use('/api/solditems', soldItemRoutes);

//use Item routes
app.use('/api/items', ItemRoutes)

//use Debt routes
app.use('/api/debt', debtRoutes)

//use milk routes
app.use('/api/milk',milkRoutes)

app.get('/',(req,res)=>{
  res.send('hello there')
  console.log('user hit the resources')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
