import dotenv from 'dotenv';
dotenv.config();

//console.log(".env file loaded?", process.env.MOMO_SUBSCRIPTION_KEY ? "YES" : "NO");

import express from 'express';
import connectDB from './config/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';

const app = express();
connectDB();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Session setup
app.use(session({
  name: 'sid', // session cookie name (optional)
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


app.set('view engine', 'ejs');

// Routes
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import momoRoutes from "./routes/momoRoutes.js";

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use("/momo", momoRoutes);

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on http://localhost:3000');
});
