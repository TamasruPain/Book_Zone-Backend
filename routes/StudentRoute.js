import express, { json } from 'express';
import StudentModel from '../models/studentsModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Student Signup
router.post('/studentsignup', async (req, res) => {
    const {
        Std_Name,
        Std_Id,
        Std_DOB,
        Std_Email,
        Std_Department,
        Std_Semester,
        Std_AdmissionYear,
        Std_Institute,
        Std_Gender,
    } = req.body;

    try {
        const existingStudent = await StudentModel.findOne({ Std_Id });
        if (existingStudent) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newStudent = new StudentModel({
            Std_Name,
            Std_Id,
            Std_DOB,
            Std_Email,
            Std_Department,
            Std_Semester,
            Std_AdmissionYear,
            Std_Institute,
            Std_Gender,
        });

        await newStudent.save();
        return res.status(201).json({ status: true, message: "Record registered" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Student Login
router.post('/studentlogin', async (req, res) => {
    const { Std_Id, Std_DOB } = req.body;

    try {
        const student = await StudentModel.findOne({ Std_Id });
        if (!student) {
            return res.status(400).json({ message: "User not registered" });
        }

        if (student.Std_DOB !== Std_DOB) {
            return res.status(400).json({ message: "Invalid date of birth" });
        }

        const token = jwt.sign({ id: student._id }, 'your_jwt_secret', { expiresIn: '1h' });
        return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get student details
router.get('/me', async (req, res) => {
    const token = req.headers['authorization'];
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const student = await StudentModel.findById(decoded.id).select('-Std_DOB');
        res.json(student);
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

//Logout
router.get('/logout', (req, res)=>{
    res.clearCookie('token')
    return res.json({json: true})
})

//Students API---------------------------------------------------------------------------

// Create
router.post("/addStudents", (req, res) => {
    const { Std_Name, Std_Id, Std_DOB, Std_Email, Std_Department, Std_Semester, Std_AdmissionYear, Std_Institute, Std_Gender } = req.body;

    // Validation logic
    if (!Std_Name || !Std_Id || !Std_DOB || !Std_Email || !Std_Department || !Std_Semester || !Std_AdmissionYear || !Std_Institute || !Std_Gender) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    StudentModel.create({ Std_Name, Std_Id, Std_DOB, Std_Email, Std_Department, Std_Semester, Std_AdmissionYear, Std_Institute, Std_Gender})
        .then(student => res.json(student))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Showing all Std
router.get('/students', (req, res) => {
    StudentModel.find({})
        .then(student => res.json(student))
        .catch(err => res.status(500).json({ error: err.message }));
});

// MCA 
router.get('/mca_students', async (req, res) => {
    try {
        const mcaStudents = await StudentModel.find({ Std_Department: 'MCA' });
        res.json(mcaStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// BCA 
router.get('/bca_students', async (req, res) => {
    try {
        const bcaStudents = await StudentModel.find({ Std_Department: 'BCA' });
        res.json(bcaStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Btech 
router.get('/btech_students', async (req, res) => {
    try {
        const btechStudents = await StudentModel.find({ Std_Department: 'B.Tech' });
        res.json(btechStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mtech 
router.get('/mtech_students', async (req, res) => {
    try {
        const mtechStudents = await StudentModel.find({ Std_Department: 'M.Tech' });
        res.json(mtechStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// BBA 
router.get('/bba_students', async (req, res) => {
    try {
        const bbaStudents = await StudentModel.find({ Std_Department: 'BBA' });
        res.json(bbaStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MBA
router.get('/mba_students', async (req, res) => {
    try {
        const mbaStudents = await StudentModel.find({ Std_Department: 'MBA' });
        res.json(mbaStudents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View
// Get Student by id
router.get('/student/:id', (req, res) => {
    const id = req.params.id;
    StudentModel.findById(id)
        .then(student => {
            if (!student) {
                return res.status(404).json({ error: "Student not found" });
            }
            res.json(student);
        })
        .catch(err => {
            console.error("Error retrieving student:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

// Updating 
// Get data
router.get('/getStudent/:id', (req, res) => {
    const id = req.params.id;
    StudentModel.findById(id)
        .then(student => res.json(student))
        .catch(err => res.status(500).json({ error: err.message }));
});

router.put('/updateStudent/:id', (req, res) => {
    const id = req.params.id;
    const { Std_Name, Std_Id, Std_DOB, Std_Email, Std_Department, Std_Semester, Std_AdmissionYear, Std_Institute, Std_Gender } = req.body;

    // Validation logic
    if (!Std_Name || !Std_Id || !Std_DOB || !Std_Email || !Std_Department || !Std_Semester || !Std_AdmissionYear || !Std_Institute || !Std_Gender) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    StudentModel.findByIdAndUpdate(id, {
        Std_Name, Std_Id, Std_DOB, Std_Email, Std_Department, Std_Semester, Std_AdmissionYear, Std_Institute, Std_Gender
    })
        .then(student => res.json(student))
        .catch(err => res.status(500).json({ error: err.message }));
});

//

// Delete
router.delete('/deleteStudent/:id', (req, res) => {
    const id = req.params.id;
    StudentModel.findByIdAndDelete(id)
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ error: err.message }));
});

export { router as StudentRouter };