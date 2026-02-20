import User from '../models/User.js';
import DataBundle from '../models/DataBundle.js';
import BundleRequest from '../models/BundleRequest.js';


//dashboard page
export const dashboardPage = async (req, res) => {
  try {
    const users = await User.find();

    // Count distinct networks
    const networks = await DataBundle.distinct('network');
    const totalNetworks = networks.length;

    // Aggregate total purchases per network
    const totals = await BundleRequest.aggregate([
      {
        $group: {
          _id: "$network",
          total: { $sum: "$price" }
        }
      }
    ]);

    // Prepare totals for easy access
    const totalByNetwork = {
      MTN: 0,
      AIRTELTIGO: 0,
      TELECEL: 0,
      overall: 0
    };

    totals.forEach(t => {
      totalByNetwork[t._id] = t.total;
      totalByNetwork.overall += t.total;
    });

    res.render('admin/dashboard', {
      users,
      totalNetworks,
      totalByNetwork
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('admin/dashboard', {
      users: [],
      totalNetworks: 0,
      totalByNetwork: { MTN: 0, AIRTELTIGO: 0, TELECEL: 0, overall: 0 }
    });
  }
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

//view all bundles requested
export const viewAllBundleRequests = async (req, res) => {
  try {
    // Fetch all bundle requests with bundle info
    const requests = await BundleRequest.find()
      .populate('bundle')
      .sort({ network: 1, createdAt: -1 }); // Sort by network, newest first

    // Calculate totals per network
    const totalsByNetwork = {};
    let overallTotal = 0;

    requests.forEach(r => {
      if (!totalsByNetwork[r.network]) totalsByNetwork[r.network] = 0;
      totalsByNetwork[r.network] += r.price;
      overallTotal += r.price;
    });

    res.render('admin/bundleRequests', {
      requests,
      totalsByNetwork,
      overallTotal
    });

  } catch (error) {
    console.error('Error fetching bundle requests:', error);
    res.render('admin/bundleRequests', {
      requests: [],
      totalsByNetwork: {},
      overallTotal: 0
    });
  }
};

// pendingUsers
export const pendingUsers = async (req, res) => {
  const users = await User.find({ isApproved: false });
  res.render('admin/pending-users', { users });
};

export const approveUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isApproved: true
  });

  res.redirect('/admin/pending-users');
};


