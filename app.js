import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

// Routes
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
//import paymentRoutes from './routes/payment.js';

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
//app.use('/payment', paymentRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on http://localhost:3000');
});
