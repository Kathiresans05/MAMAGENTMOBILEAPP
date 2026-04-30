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

module.exports = router;
