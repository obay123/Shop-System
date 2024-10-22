const connectDB = require('./config/databse');
const express = require('express');
const app = express();

require('dotenv').config();
connectDB();

app.use(express.json()); 

// Import  routes
const deptRoutes = require('./routes/deptRoutes');
const soldItemRoutes = require('./routes/soldItemRoutes');
const itemsRoutes = require('./routes/itemsRoutes');

// Use  routes 
app.use('/', itemsRoutes);  // Correct usage of items route
app.use('/', soldItemRoutes);  // Correct usage of sold items route
app.use('/api/debt', deptRoutes);  // Correct usage of debt route

// Simple test route
app.get('/', (req, res) => {
  console.log('user hit the resource');
  res.status(200).send('home page');
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}...`)
);
