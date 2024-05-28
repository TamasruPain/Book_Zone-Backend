
import mongoose from 'mongoose';

const ownerAdminSchema = new mongoose.Schema({
    ownerAdminName: {
        type: String,
        required: true,
    },
    ownerAdminGender: {
        type: String,
        required: true,
    },
    ownerAdminEmail:{
        type: String,
        unique: true,
        required: true,
    },
    ownerAdminPassword: { 
        type: String,
        required: true,
    },
    role:{
        type: String,
        default: "Owner Admin"
    }
});

const OwnerAdmin = mongoose.model('OwnerAdmin', ownerAdminSchema);

export default OwnerAdmin;

