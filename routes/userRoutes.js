import express from 'express';
import User from '../models/User.js';
import { 
  buyDataPage,
   logoutUser, 
   registeredUsersDataForm,
  userProfilePage } from '../controllers/userController.js';

const router = express.Router();

// Middleware
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login');
}

function isUser(req, res, next) {
  if (req.session.role === 'user') return next();
  res.send('Access denied');
}

// User dashboard
router.get('/dashboard', isAuthenticated, isUser, async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('users/dashboard', { user });
});


// Buy data page
router.get('/buy-data', isAuthenticated, isUser, buyDataPage);
router.get('/dataform/mtn', isAuthenticated, isUser, registeredUsersDataForm);
router.get('/profile', isAuthenticated, isUser, userProfilePage);


//logout
router.get('/logout', isAuthenticated, logoutUser);


export default router;
