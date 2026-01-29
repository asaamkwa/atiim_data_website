import express from 'express';
import User from '../models/User.js';

import {
  logoutUser 
 } from '../controllers/adminController.js';


const router = express.Router();

// Middleware
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session.role === 'admin') return next();
  res.send('Access denied');
}

// Admin dashboard
router.get('/dashboard', isAuthenticated, isAdmin, async (req, res) => {
  const users = await User.find();
  res.render('admin/dashboard', { users });
});


//logout
router.get('/logout', isAuthenticated, logoutUser);

export default router;
