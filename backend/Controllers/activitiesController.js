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
        activityEvidence: req.body.activityEvidence
    });

    await newActivity.save();
    return res.status(200).json({ message: "Activity created" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    return res.status(200).json({ activities });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    return res.status(200).json({ activity });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const editActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    let updates = {
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
        activityEvidence: req.body.activityEvidence
    }

    const updatedActivity = await Activity.findOneAndUpdate({_id: id}, updates, {new: true})

    if(!updatedActivity){
        return res.status(500).json({error: "Activity does not exist"})
    }

    return res.status(200).json({ message: "Activity updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const insertCommentActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    let updates = {
        comments: req.body,
    }
    console.log(req.body)
    console.log(updates)

    const updatedActivity = await Activity.findOneAndUpdate({_id: id}, updates, {new: true})

    if(!updatedActivity){
        return res.status(500).json({error: "Activity does not exist"})
    }

    return res.status(200).json({ message: "Activity updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    await Activity.findByIdAndDelete(id);

    return res.status(200).json({ message: "Activity deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { registerActivity, getAllActivities, getActivity, editActivity, deleteActivity, insertCommentActivity };
