const mongoose = require('mongoose');

const TieUpSchema = new mongoose.Schema({
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: { type: String, required: true }, // e.g., Hospital, Hostel, Bus
    businessName: { type: String, required: true },
    location: { type: String, required: true },
    proofImage: { type: String }, // URL to image
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TieUp', TieUpSchema);
