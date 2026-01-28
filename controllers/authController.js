import User from '../models/User.js';

// Show login page
export const loginPage = (req, res) => {
  res.render('login', { error: null });
};

// Handle login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { error: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Incorrect password' });
    }

    // Save session
    req.session.userId = user._id;
    req.session.role = user.role;

    // Redirect based on role
    if (user.role === 'admin') res.redirect('/admin/dashboard');
    else res.redirect('/user/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Try again.' });
  }
};

// Show register page
export const registerPage = (req, res) => {
  res.render('register', { error: null });
};

// Handle register
export const registerUser = async (req, res) => {
  const { name, phone, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { error: 'Email already registered' });
    }

    const user = new User({
      name,
      phone,
      email,
      password,
      role: 'user' // force normal user
    });

    await user.save();
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: err.message });
  }
};

