const express = require("express");
const router = express.Router();
const { handleErrors } = require("../middleware/errorHandler");
const { addMeeting, deleteMeeting } = require("../logic/meetingLogic");
const {
  getAllMeetings,
  getMeetingsByChildId,
  getMeetingById,
  updateMeeting,
} = require("../data/meetingsData");
const { validateMeeting } = require("../utils/validation");

// Get all meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await getAllMeetings();
    res.json(meetings);
  } catch (error) {
    handleErrors(res, error, "Error fetching meetings");
  }
});

// Get meetings by child ID
router.get("/child/:childId", async (req, res) => {
  try {
    const meetings = await getMeetingsByChildId(req.params.childId);
    res.json(meetings);
  } catch (error) {
    handleErrors(res, error, "Error fetching child meetings");
  }
});

// Get meeting by ID
router.get("/:meetingId", async (req, res) => {
  try {
    const meeting = await getMeetingById(req.params.meetingId);
    if (!meeting) {
      return handleErrors(res, null, "Meeting not found", 404);
    }
    res.json(meeting);
  } catch (error) {
    handleErrors(res, error, "Error fetching meeting");
  }
});

// Add meeting
router.post("/", addMeeting);

// Update meeting
router.put("/:meetingId", async (req, res) => {
  try {
    const updatedMeeting = req.body;
    const validationError = validateMeeting(updatedMeeting);
    if (validationError) {
      return handleErrors(res, null, validationError, 400);
    }
    const meeting = await updateMeeting(req.params.meetingId, updatedMeeting);
    if (!meeting) {
      return handleErrors(res, null, "Meeting or child not found", 404);
    }
    res.json({ success: true, meeting });
  } catch (error) {
    handleErrors(res, error, "Error updating meeting");
  }
});

// Delete meeting
router.delete("/:meetingId", deleteMeeting);

module.exports = router;
