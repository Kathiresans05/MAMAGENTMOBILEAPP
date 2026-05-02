const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
    level: { type: String, enum: ['state', 'district', 'division', 'pincode'], default: 'pincode' },
    assignedArea: { type: String }, // For state, district, division
    assignedPincode: { type: mongoose.Schema.Types.ObjectId, ref: 'Pincode' },
    
    // KYC Data
    kyc: {
        aadhaarNumber: { type: String },
        aadhaarImage: { type: String },
        otherDocType: { type: String }, // PAN, DL, etc.
        otherDocImage: { type: String },
        selfie: { type: String }
    },

    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isActive: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
