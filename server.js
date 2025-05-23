require("dotenv").config();
const express = require('express');
const connectToDb = require('./database/db');
const authRoutes = require('./routes/auth-route')
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-route')
const uploadImageRoutes = require('./routes/image-routes')

// connect to DB
connectToDb();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);

app.listen(PORT,() => {
    console.log(`Server is now running on port ${PORT}`);   
})