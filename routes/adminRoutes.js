import express from 'express';
import User from '../models/User.js';
import DataBundle from '../models/DataBundle.js';
import BundleRequest from '../models/BundleRequest.js';

import {
  dashboardPage,
  logoutUser,
  addDataForm,
  createDataBundle,
  listBundles,
  editBundleForm,
  updateBundle,
  deleteBundle,
  toggleBundleStatus,
  viewAllBundleRequests,
  pendingUsers,
  approveUser

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
router.get('/dashboard', isAuthenticated, isAdmin, dashboardPage);

router.get('/add/data', isAuthenticated, isAdmin, addDataForm);
router.post('/data/new', isAuthenticated, isAdmin, createDataBundle);

router.get('/bundles', isAuthenticated, isAdmin, listBundles);

router.get('/bundles/edit/:id', isAuthenticated, isAdmin, editBundleForm);
router.post('/bundles/edit/:id', isAuthenticated, isAdmin, updateBundle);

router.post('/bundles/delete/:id', isAuthenticated, isAdmin, deleteBundle);
router.post('/bundles/toggle/:id', isAuthenticated, isAdmin, toggleBundleStatus);

router.get('/bundle-requests', isAuthenticated, isAdmin, viewAllBundleRequests);



// user approveUser
router.get('/pending-users', isAdmin, pendingUsers);
router.post('/approve/:id', isAdmin, approveUser);


//logout
router.get('/logout', isAuthenticated, logoutUser);

export default router;


