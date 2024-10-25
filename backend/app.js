const express = require('express');
const app = express();
const reportRoutes = require('./routes/reportRoutes');
const soldItemRoutes = require('./routes/soldItemRoutes');
const connectDB = require('./config/databse');


require('dotenv').config();
connectDB();

app.use(express.json());

// Use report routes
app.use('/api/reports', reportRoutes);

// Use sold item routes
app.use('/api/solditems', soldItemRoutes);

app.get('/',(req,res)=>{
  res.send('hello there')
  console.log('user hit the resources')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
