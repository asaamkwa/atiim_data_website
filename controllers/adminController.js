import User from '../models/User.js';
import DataBundle from '../models/DataBundle.js';


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



export const addDataForm = (req, res) => {
  res.render('admin/adminAddBundles');
};




//Create a new data bundle (ADMIN)
 
export const createDataBundle = async (req, res) => {
  try {
    const { network, name, price } = req.body;

    if (!network || !name || !price) {
      req.flash('error', 'All fields are required');
      return res.redirect('/admin/add/data');
    }

    await DataBundle.create({ network, name, price });

    req.flash('success', 'Data bundle added successfully');
    res.redirect('/admin/add/data');

  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong');
    res.redirect('/admin/add/data');
  }
};


/* LIST ALL BUNDLES */
export const listBundles = async (req, res) => {
  try {
    const { network } = req.query; // ?network=MTN

    let filter = {};
    if (network) {
      filter.network = network;
    }

    const bundles = await DataBundle.find(filter).sort({ createdAt: -1 });

    res.render('admin/bundles', { bundles, networkFilter: network });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load bundles');
    res.redirect('/admin/dashboard');
  }
};


/* SHOW EDIT FORM */
export const editBundleForm = async (req, res) => {
  const bundle = await DataBundle.findById(req.params.id);
  res.render('admin/editBundle', { bundle });
};

/* UPDATE BUNDLE */
export const updateBundle = async (req, res) => {
  const { network, name, price } = req.body;

  await DataBundle.findByIdAndUpdate(req.params.id, {
    network,
    name,
    price
  });

  req.flash('success', 'Bundle updated successfully');
  res.redirect('/admin/bundles');
};

/* DELETE BUNDLE */
export const deleteBundle = async (req, res) => {
  await DataBundle.findByIdAndDelete(req.params.id);
  req.flash('success', 'Bundle deleted');
  res.redirect('/admin/bundles');
};

/* TOGGLE ACTIVE / INACTIVE */
export const toggleBundleStatus = async (req, res) => {
  const bundle = await DataBundle.findById(req.params.id);
  bundle.isActive = !bundle.isActive;
  await bundle.save();

  req.flash('success', 'Bundle status updated');
  res.redirect('/admin/bundles');
};

