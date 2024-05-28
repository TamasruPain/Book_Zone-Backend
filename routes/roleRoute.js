import express from 'express';
import jwt from 'jsonwebtoken';
import UserAdmin from '../models/userAdminModel.js';
import OwnerAdmin from '../models/adminModel.js';
import StudentModel from '../models/studentsModel.js'

const router = express.Router();

router.get('/checkRole', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userAdmin = await UserAdmin.findById(decoded.id);
    const ownerAdmin = await OwnerAdmin.findById(decoded.id);
    const StudentUser = await StudentModel.findById(decoded.id);

    if (userAdmin) {
      return res.status(200).json({ role: 'User Admin' });
    } else if (ownerAdmin) {
      return res.status(200).json({ role: 'Owner Admin' });
    } else if (StudentUser) {
      return res.status(200).json({ role: 'Student' });
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as roleRouter };
