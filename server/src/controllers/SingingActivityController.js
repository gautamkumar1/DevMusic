const SingingActivity = require("../models/SingingActivityModel");
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
    const { userId, songPlayingTime, songId } = req.body;

    if (!userId || !songPlayingTime) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if the user exists and update the arrayOfSongPlayingTime field
    const userActivity = await SingingActivity.findOneAndUpdate(
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

module.exports = { SingingActivityCreate, SingingActivityGet,addSongPlayingTime };