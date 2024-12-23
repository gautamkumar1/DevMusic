const express = require('express');
const router = express.Router();
const SingingActivityController = require('../controllers/SingingActivityController');
const { isAuthenticated } = require('../middleware/auth-middleware');

router.post('/singing-activity-create', isAuthenticated, SingingActivityController.SingingActivityCreate);
router.get('/singing-activity-get/:userId', isAuthenticated, SingingActivityController.SingingActivityGet);

module.exports = router;
