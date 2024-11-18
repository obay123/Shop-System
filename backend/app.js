const express = require('express');
const app = express();

const verifyToken = require('./middleware/authMiddleware')
//importing routes
const reportRoutes = require('./routes/reportRoutes');
const soldItemRoutes = require('./routes/soldItemRoutes');
const ItemRoutes = require('./routes/itemsRoutes')
const debtRoutes = require('./routes/debtRoutes')
const milkRoutes = require('./routes/milkRoutes')
const authRoutes = require('./routes/authRoutes');

//Databse connection
const connectDB = require('./config/databse');

//dotevnv and invoking db connection funciton
require('dotenv').config();
connectDB();

//json middleware
app.use(express.json());
//verifyToken
//use auth routes 
app.use('/auth', authRoutes);
//verifyToken
// Use report routes
app.use('/api/reports', verifyToken,reportRoutes);
//verifyToken
// Use sold item routes
app.use('/api/solditems',soldItemRoutes);
//verifyToken
//use Item routes
app.use('/api/items',ItemRoutes)
//verifyToken
//use Debt routes
app.use('/api/debts',debtRoutes)
//verifyToken
//use milk routes
app.use('/api/milk', milkRoutes);

app.get('/',(req,res)=>{
  res.send('hello there')
  console.log('user hit the resources')
})

app.use((req,res)=>{
  res.status(404).json({ message: 'Route not found' });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
