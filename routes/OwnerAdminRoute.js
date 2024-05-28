import express, { json } from 'express';
import OwnerAdmin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// OwnerAdmin Signup
router.post('/owneradminsignup', async (req, res) => {
    const { ownerAdminName, ownerAdminEmail, ownerAdminGender, ownerAdminPassword } = req.body;

    try {
        const existingAdmin = await OwnerAdmin.findOne({ ownerAdminEmail });
        if (existingAdmin) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(ownerAdminPassword, 10);

        const newOwnerAdmin = new OwnerAdmin({
            ownerAdminName,
            ownerAdminEmail,
            ownerAdminGender,
            ownerAdminPassword: hashedPassword
        });

        await newOwnerAdmin.save();
        return res.status(201).json({ status: true, message: "Record registered" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// OwnerAdmin Login
router.post('/owneradminlogin', async (req, res) => {
    const { ownerAdminEmail, ownerAdminPassword } = req.body;

    try {
        const ownerAdmin = await OwnerAdmin.findOne({ ownerAdminEmail });
        if (!ownerAdmin) {
            return res.status(400).json({ message: "User not registered" });
        }

        const isPasswordValid = await bcrypt.compare(ownerAdminPassword, ownerAdmin.ownerAdminPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: ownerAdmin._id }, 'your_jwt_secret', { expiresIn: '1h' });
        return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get OwnerAdmin details
router.get('/me', async (req, res) => {
    const token = req.headers['authorization'];
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const ownerAdmin = await OwnerAdmin.findById(decoded.id).select('-ownerAdminPassword');
        res.json(ownerAdmin);
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

router.post("/addowneradmin", async (req, res) => {
    const { ownerAdminName, ownerAdminEmail, ownerAdminPassword, ownerAdminGender } = req.body;

    if (!ownerAdminName || !ownerAdminEmail || !ownerAdminPassword || !ownerAdminGender) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ownerAdminPassword, salt);

        // Create a new owner admin with the hashed password
        const newOwnerAdmin = await OwnerAdmin.create({
            ownerAdminName,
            ownerAdminEmail,
            ownerAdminGender,
            ownerAdminPassword: hashedPassword
        });

        res.json(newOwnerAdmin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Showing all
router.get('/ownerAdmins', (req, res) => {
    OwnerAdmin.find({})
        .then(ownerAdmins => res.json(ownerAdmins))
        .catch(err => res.status(500).json({ error: err.message }));
});

// View by ID
router.get('/ownerAdmin/:id', (req, res) => {
    const id = req.params.id;
    OwnerAdmin.findById(id)
        .then(ownerAdmin => {
            if (!ownerAdmin) {
                return res.status(404).json({ error: "Owner Admin not found" });
            }
            res.json(ownerAdmin);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Update
router.put('/updateOwnerAdmin/:id', (req, res) => {
    const id = req.params.id;
    const { ownerAdminName, ownerAdminEmail, ownerAdminGender } = req.body;

    if (!ownerAdminName || !ownerAdminEmail || !ownerAdminGender) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    OwnerAdmin.findByIdAndUpdate(id, { ownerAdminName, ownerAdminEmail, ownerAdminGender }, { new: true })
        .then(ownerAdmin => res.json(ownerAdmin))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Delete
router.delete('/deleteOwnerAdmin/:id', (req, res) => {
    const id = req.params.id;
    OwnerAdmin.findByIdAndDelete(id)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});





export { router as OwnerAdminRouter };
