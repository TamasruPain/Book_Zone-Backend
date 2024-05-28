import express from 'express';
import jwt from 'jsonwebtoken';
import UserAdmin from '../models/userAdminModel.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// UserAdmin Signup
router.post('/useradminsignup', async (req, res) => {
  const { userAdminName, userAdminEmail, userAdminPassword, userAdminInstitute, userAdminGender } = req.body;

  try {
    const existingUserAdmin = await UserAdmin.findOne({ userAdminEmail });
    if (existingUserAdmin) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(userAdminPassword, 10);

    const newUserAdmin = new UserAdmin({
      userAdminName,
      userAdminEmail,
      userAdminPassword: hashedPassword,
      userAdminInstitute,
      userAdminGender,
    });

    await newUserAdmin.save();
    return res.status(201).json({ status: true, message: 'Record registered' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// UserAdmin Login
router.post('/useradminlogin', async (req, res) => {
  const { userAdminEmail, userAdminPassword, userAdminInstitute } = req.body;

  try {
    const userAdmin = await UserAdmin.findOne({ userAdminEmail });
    if (!userAdmin) {
      return res.status(400).json({ message: 'User not registered' });
    }

    const isPasswordValid = await bcrypt.compare(userAdminPassword, userAdmin.userAdminPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

    const token = jwt.sign({ id: userAdmin._id }, 'your_jwt_secret', { expiresIn: '1h' });
    return res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Get user admin details
router.get('/me', async (req, res) => {
  const token = req.headers['authorization'];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userAdmin = await UserAdmin.findById(decoded.id).select('-userAdminPassword');
    res.json(userAdmin);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ json: true });
});

//------------------------------------------------------------------------------------------------------------------------------

// Create
router.post("/adduseradmin", async (req, res) => {
  const { userAdminName, userAdminEmail, userAdminPassword, userAdminInstitute, userAdminGender } = req.body;
  console.log("Received data:", req.body); // Add this line for logging

  if (!userAdminName || !userAdminEmail || !userAdminPassword || !userAdminInstitute || !userAdminGender) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userAdminPassword, salt);

    // Create a new owner admin with the hashed password
    const newOwnerAdmin = await UserAdmin.create({
        userAdminName,
        userAdminEmail,
        userAdminGender,
        userAdminInstitute,
        userAdminPassword: hashedPassword
    });

    res.json(newOwnerAdmin);
} catch (err) {
    res.status(500).json({ error: err.message });
}
});

// Showing all
router.get('/userAdmins', (req, res) => {
  UserAdmin.find({})
    .then(userAdmins => res.json(userAdmins))
    .catch(err => res.status(500).json({ error: err.message }));
});

// View by ID
router.get('/userAdmin/:id', (req, res) => {
  const id = req.params.id;
  UserAdmin.findById(id)
    .then(userAdmin => {
      if (!userAdmin) {
        return res.status(404).json({ error: "User Admin not found" });
      }
      res.json(userAdmin);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Update
router.put('/updateUserAdmin/:id', (req, res) => {
  const id = req.params.id;
  const { userAdminName, userAdminEmail, userAdminPassword, userAdminInstitute, userAdminGender } = req.body;

  if (!userAdminName || !userAdminEmail || !userAdminPassword || !userAdminInstitute || !userAdminGender) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  UserAdmin.findByIdAndUpdate(id, { userAdminName, userAdminEmail, userAdminPassword, userAdminInstitute, userAdminGender }, { new: true })
    .then(userAdmin => res.json(userAdmin))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Delete
router.delete('/deleteUserAdmin/:id', (req, res) => {
  const id = req.params.id;
  UserAdmin.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

export { router as UserAdminRouter };
