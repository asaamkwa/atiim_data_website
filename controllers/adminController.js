import User from '../models/User.js';


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
