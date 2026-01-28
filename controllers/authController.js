import User from '../models/User.js';
import bcrypt from 'bcryptjs';

/* Login Page */
export const loginPage = (req, res) => {
  res.render('login');
};

/* Register Page */
export const registerPage = (req, res) => {
  res.render('register');
};

/* Register User */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.render('register', { error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.render('register', { error: 'Something went wrong' });
  }
};

/* Login User */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.render('login', { error: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render('login', { error: 'Invalid email or password' });
  }

  res.redirect('/');
};
