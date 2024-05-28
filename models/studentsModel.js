
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    Std_Name: {
        type: String,
        required: true
    },
    Std_Id: {
        type: String,
        required: true,
        unique: true
    },
    Std_DOB: {
        type: String,
        required: true
    },
    Std_Email: {
        type: String,
        required: true
    },
    Std_Department: {
        type: String,
        required: true
    },
    Std_Semester: {
        type: String,
        required: true
    },
    Std_AdmissionYear: {
        type: String,
        required: true
    },
    Std_Institute: {
        type: String,
        required: true
    },
    Std_Gender: {
        type: String,
        required: true
    },

    role:{
        type: String,
        default: "Student"
    }
});


const StudentModel = mongoose.model('students', studentSchema);
export default StudentModel;