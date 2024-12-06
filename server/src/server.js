const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const app = express();

app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});