const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Pincode = require('../models/Pincode');
const TieUp = require('../models/TieUp');
const Task = require('../models/Task');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    next();
};

// @route    GET api/admin/agents
// @desc     Get all agents
// @access   Private (Admin only)
router.get('/agents', [auth, adminAuth], async (req, res) => {
    try {
        const agents = await User.find({ role: 'agent' }).populate('assignedPincode');
        res.json(agents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/admin/tie-ups
// @desc     Get all tie-ups
// @access   Private (Admin only)
router.get('/tie-ups', [auth, adminAuth], async (req, res) => {
    try {
        const tieUps = await TieUp.find().populate('agentId', 'name email');
        res.json(tieUps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    POST api/admin/assign-task
// @desc     Assign task to agent
// @access   Private (Admin only)
router.post('/assign-task', [auth, adminAuth], async (req, res) => {
    const { assignedTo, title, description, dueDate } = req.body;
    try {
        const newTask = new Task({
            adminId: req.user.id,
            assignedTo,
            title,
            description,
            dueDate
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/admin/tie-up/:id
// @desc     Approve/Reject tie-up
// @access   Private (Admin only)
router.put('/tie-up/:id', [auth, adminAuth], async (req, res) => {
    const { status } = req.body;
    try {
        let tieUp = await TieUp.findById(req.params.id);
        if (!tieUp) return res.status(404).json({ msg: 'Tie-up request not found' });

        tieUp.status = status;
        await tieUp.save();
        res.json(tieUp);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/admin/activate-agent/:id
// @desc     Activate/Deactivate agent
// @access   Private (Admin only)
router.put('/activate-agent/:id', [auth, adminAuth], async (req, res) => {
    const { isActive } = req.body;
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isActive = isActive;
        await user.save();

        // If activated, update pincode record
        if (isActive && user.assignedPincode) {
            await Pincode.findByIdAndUpdate(user.assignedPincode, { activeAgentId: user.id });
        } else if (!isActive && user.assignedPincode) {
            await Pincode.findByIdAndUpdate(user.assignedPincode, { activeAgentId: null });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/admin/check-agent
// @desc     Check if a pincode already has an active agent
// @access   Private (Admin only)
router.get('/check-agent', [auth, adminAuth], async (req, res) => {
    const { pincode } = req.query;
    if (!pincode) return res.status(400).json({ msg: 'Pincode is required' });

    try {
        const pinRecord = await Pincode.findOne({ code: pincode });
        if (!pinRecord) {
            return res.json({ assigned: false, exists: false });
        }
        return res.json({ 
            assigned: !!pinRecord.activeAgentId, 
            exists: true,
            details: pinRecord
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    POST api/admin/save-pincode
// @desc     Save newly fetched pincode data to DB
// @access   Private (Admin only)
// @route    PUT api/admin/approve-agent/:id
// @desc     Approve or Reject agent KYC
// @access   Private (Admin only)
router.put('/approve-agent/:id', [auth, adminAuth], async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.status = status;
        if (status === 'approved') {
            user.isActive = true;
            // If approved, update pincode record
            if (user.assignedPincode) {
                await Pincode.findByIdAndUpdate(user.assignedPincode, { activeAgentId: user.id });
            }
        } else {
            user.isActive = false;
        }
        
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/save-pincode', [auth, adminAuth], async (req, res) => {
    const { pincode, postOffice, district, state, division, region, deliveryStatus } = req.body;
    try {
        let pinRecord = await Pincode.findOne({ code: pincode });
        if (!pinRecord) {
            pinRecord = new Pincode({
                code: pincode,
                name: postOffice,
                postOffice,
                district,
                state,
                division,
                region,
                deliveryStatus
            });
            await pinRecord.save();
        }
        res.json(pinRecord);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/admin/update-agent/:id
// @desc     Update agent details
// @access   Private (Admin only)
router.put('/update-agent/:id', [auth, adminAuth], async (req, res) => {
    const { name, email, level } = req.body;
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (level) user.level = level;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
