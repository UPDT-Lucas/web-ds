const Activity = require("../Models/Activity");
const mongoose = require("mongoose");

const registerActivity = async (req, res) => {
  try {
    const exists = await Activity.findOne({
      activityName: req.body.activityName,
    });

    if (exists) {
      return res.status(400).json({ error: "Activity already exists" });
    }

    const newActivity = new Activity({
        typeOfActivity: req.body.typeOfActivity,
        activityName: req.body.activityName,
        responsibles: req.body.responsibles,
        executionDate: req.body.executionDate,
        executionWeek: req.body.executionWeek,
        announcementDate: req.body.announcementDate,
        reminderDates: req.body.reminderDates,
        comments: req.body.comments,
        isRemote: req.body.isRemote,
        virtualActivityLink: req.body.virtualActivityLink,
        activityPoster: req.body.activityPoster,
        currentState: req.body.currentState,
    });

    await newActivity.save();

  } catch {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
