const express = require('express');
const router = express.Router();
const SingingActivityController = require('../controllers/SingingActivityController');
const { isAuthenticated } = require('../middleware/auth-middleware');

router.post('/singing-activity-create', isAuthenticated, SingingActivityController.SingingActivityCreate);
router.get('/singing-activity-get/:userId', SingingActivityController.SingingActivityGet);
router.post('/add-song-playing-time', isAuthenticated,SingingActivityController.addSongPlayingTime);
router.get('/leaderboard-rank',SingingActivityController.getLeaderboard);
module.exports = router;
