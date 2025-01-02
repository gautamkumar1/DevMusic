const { leaderboardKey } = require("../cacheKey/cacheKey");
const SingingActivity = require("../models/SingingActivityModel");
const songPlayingTimeModel = require("../models/song-playingTime")
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const SingingActivityCreate = async (req, res) => {
    try {
      const { userId, date, count } = req.body;
  
      // Validate input
      if (!userId || !date || typeof count !== 'number') {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      // Check if an entry exists for the user on the given date
      let activity = await SingingActivity.findOne({ userId, date });
  
      if (activity) {
        // Update the count
        activity.count += count;
      } else {
        // Create a new entry
        activity = new SingingActivity({ userId, date, count: count });
      }
      const cacheKey = "singing-activity";
      cache.del(cacheKey);
      await activity.save();
  
      // Notify success
      res.status(200).json({ success: true, activity });
    } catch (error) {
      console.error('Error logging singing activity:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const SingingActivityGet = async (req, res) => {
    try {
      const { userId } = req.params;
      const cacheKey = "singing-activity";
      const cachedActivities = cache.get(cacheKey);
      if (cachedActivities) {
        console.log("Returning cached activities");
        return res.status(200).json({ success: true, activities: cachedActivities });
      }
      console.log("Fetching activities from database");
      const activities = await SingingActivity.find({ userId }).sort({ date: 1 }).select('-userId -__v -_id');
      const formattedActivities = activities.map(activity => ({
        date: activity.date,
        count: activity.count
      }));
      cache.set(cacheKey, formattedActivities);
      res.status(200).json({ success: true, activities: formattedActivities });
    } catch (error) {
      console.error('Error fetching singing activity:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const addSongPlayingTime = async (req, res) => {
  try {
    const cacheKey = leaderboardKey;
    cache.del(cacheKey);
    const { userId, songPlayingTime, songId } = req.body;

    if (!userId || !songPlayingTime) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if the user exists and update the arrayOfSongPlayingTime field
    const userActivity = await songPlayingTimeModel.findOneAndUpdate(
      { userId },
      { $push: { arrayOfSongPlayingTime: songPlayingTime } ,songId},
      { new: true, upsert: true } // Create the document if it doesn't exist
    );

    res.status(200).json({ success: true, userActivity });
  } catch (error) {
    console.error('Error adding song playing time:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const cacheKey = leaderboardKey;
    const cachedLeaderboard = cache.get(cacheKey);
    if (cachedLeaderboard) {
      console.log("Returning cached leaderboard");
      return res.status(200).json({ success: "Returning cached leaderboard", leaderboard: cachedLeaderboard });
    }
    // Aggregate data to calculate total song-playing time for each user
    const leaderboardData = await songPlayingTimeModel.aggregate([
      {
        $addFields: {
          totalPlayingTime: { $sum: "$arrayOfSongPlayingTime" },
        },
      },
      {
        $lookup: {
          from: "users", // Name of the User collection
          localField: "userId",
          foreignField: "_id", // The field in User collection that matches userId
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Flatten the array created by lookup
      },
      {
        $project: {
          fullName: "$userDetails.fullName",
          totalPlayingTime: 1,
        },
      },
      {
        $sort: { totalPlayingTime: -1 }, // Sort by total playing time in descending order
      },
    ]);

    if (leaderboardData.length === 0) {
      return res.status(404).json({ success: false, message: "No data available for leaderboard" });
    }

    // Add rank dynamically based on sorted data
    const leaderboard = leaderboardData.map((user, index) => ({
      rank: index + 1,
      fullName: user.fullName,
      totalPlayingTime: user.totalPlayingTime,
    }));

    cache.set(cacheKey, leaderboard);
    res.status(200).json({ success: true, leaderboard: leaderboard });
  } catch (error) {
    console.error("Error generating leaderboard:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { SingingActivityCreate, SingingActivityGet,addSongPlayingTime,getLeaderboard };