import User from '../models/User.js';
import DataBundle from '../models/DataBundle.js';
import BundleRequest from '../models/BundleRequest.js';

//data page
export const buyDataPage = (req, res) => {
  res.render('users/buydatapage');
};


// controllers/userController.js
export const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/user/dashboard');
    }
    res.clearCookie('connect.sid'); // optional
    res.redirect('/auth/login');
  });
};


//form for submiting data by registered users
export const registeredUsersDataForm = (req, res) => {
  res.render('users/userBuyMTN');
};


// controllers/userController.js

// Show profile page
export const userProfilePage = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('users/profile', { user });
};


export const getBundlesByNetwork = async (req, res) => {
  try {
    const { network } = req.params;

    // Fetch active bundles only
    const bundles = await DataBundle.find({ network, isActive: true }).sort({ price: 1 });

    res.json(bundles); // Send as JSON to frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const submitBundleRequest = async (req, res) => {
  try {
    const { network, payerNumber, bundleId } = req.body;

    if (!network || !payerNumber || !bundleId) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/user/buy-data');
    }

    const bundle = await DataBundle.findById(bundleId);
    if (!bundle) {
      req.flash('error', 'Selected bundle not found.');
      return res.redirect('/user/buy-data');
    }

    await BundleRequest.create({
      network,
      phoneNumber: payerNumber,
      bundle: bundle._id,
      price: bundle.price
    });

    req.flash('success', 'Submitted successfully! Payment Mode: Direct Momo Transfer, Make your payment into our momo number: 0541255719 Name: Atiim Jonah Atiibawom. Please use your order number as the reference');
    res.redirect('/user/buy-data');

  } catch (error) {
    console.error('Error submitting bundle request:', error);
    req.flash('error', 'Server error, please try again.');
    res.redirect('/user/buy-data');
  }
};

