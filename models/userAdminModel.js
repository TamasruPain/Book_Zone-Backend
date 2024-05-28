import mongoose from 'mongoose';

const userAdminSchema = new mongoose.Schema({
    userAdminName: {
        type: String,
        required: true,
    },
    userAdminEmail: {
        type: String,
        unique: true,
        required: true,
    },
    userAdminInstitute: {
        type: String,
        required: true,
    },
    userAdminPassword: {
        type: String,
        required: true,
    },
    userAdminGender: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        default: "User Admin"
    }
});

const UserAdmin = mongoose.model('UserAdmin', userAdminSchema);

export default UserAdmin;
