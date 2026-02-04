import User from '../models/User.js';

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
