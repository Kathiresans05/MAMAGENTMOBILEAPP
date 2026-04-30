const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Pincode = require('../models/Pincode');
const TieUp = require('../models/TieUp');
const Task = require('../models/Task');

// @route    POST api/agent/join-pincode
// @desc     Join a pincode
// @access   Private
router.post('/join-pincode', auth, async (req, res) => {
    const { pincodeId } = req.body;
    try {
        const pincode = await Pincode.findById(pincodeId);
        if (!pincode) return res.status(404).json({ msg: 'Pincode not found' });
        if (pincode.activeAgentId) return res.status(400).json({ msg: 'Pincode already has an active agent' });

        const user = await User.findById(req.user.id);
        user.assignedPincode = pincodeId;
        // In a real flow, activation happens after payment
        await user.save();

        res.json({ msg: 'Pincode assigned. Please complete payment to activate.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    POST api/agent/tie-up
// @desc     Submit tie-up request
// @access   Private
router.post('/tie-up', auth, async (req, res) => {
    const { serviceType, businessName, location, proofImage } = req.body;
    try {
        const newTieUp = new TieUp({
            agentId: req.user.id,
            serviceType,
            businessName,
            location,
            proofImage
        });
        const tieUp = await newTieUp.save();
        res.json(tieUp);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/agent/tasks
// @desc     Get assigned tasks
// @access   Private
router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/agent/dashboard-stats
// @desc     Get stats for agent dashboard
// @access   Private
router.get('/dashboard-stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const tasks = await Task.find({ assignedTo: req.user.id });
        const tieUps = await TieUp.find({ agentId: req.user.id });
        
        // Mocking downline stats for now
        const downlineCount = await User.countDocuments({ referredBy: req.user.id });

        res.json({
            balance: user.balance,
            tasks: {
                total: tasks.length,
                pending: tasks.filter(t => t.status === 'pending').length,
                completed: tasks.filter(t => t.status === 'completed').length
            },
            tieUps: tieUps.length,
            downline: downlineCount,
            earnings: [4500, 5200, 4800, 6100, 5900, 7200, 8500] // Mock weekly data
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
