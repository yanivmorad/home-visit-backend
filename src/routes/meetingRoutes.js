// src/routes/meetingRoutes.js
const express = require("express");
const router = express.Router();
const { handleErrors } = require("../middleware/errorHandler");
const { validateMeeting } = require("../utils/validation");
const {
  getAllMeetings,
  getMeetingsByChildId,
  getMeetingById,
  addMeeting,
  updateMeeting,
  deleteMeeting,
} = require("../data/meetingsData");

// Get all meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await getAllMeetings();
    res.json(meetings);
  } catch (error) {
    handleErrors(res, error, "Error fetching meetings");
  }
});

// Get by child
router.get("/child/:childId", async (req, res) => {
  try {
    const meetings = await getMeetingsByChildId(req.params.childId);
    res.json(meetings);
  } catch (error) {
    handleErrors(res, error, "Error fetching child meetings");
  }
});

// Get one meeting
router.get("/:meetingId", async (req, res) => {
  try {
    const meeting = await getMeetingById(req.params.meetingId);
    if (!meeting) return handleErrors(res, null, "Meeting not found", 404);
    res.json(meeting);
  } catch (error) {
    handleErrors(res, error, "Error fetching meeting");
  }
});

// Add meeting
router.post("/", async (req, res) => {
  try {
    const errMsg = validateMeeting(req.body);
    if (errMsg) return handleErrors(res, null, errMsg, 400);
    const meeting = await addMeeting(req.body.childId, req.body);
    res.status(201).json({ success: true, meeting });
  } catch (error) {
    handleErrors(res, error, "Error adding meeting");
  }
});

// Update meeting
router.put("/:meetingId", async (req, res) => {
  try {
    const errMsg = validateMeeting(req.body);
    if (errMsg) return handleErrors(res, null, errMsg, 400);
    const updated = await updateMeeting(req.params.meetingId, req.body);
    if (!updated)
      return handleErrors(res, null, "Meeting or child not found", 404);
    res.json({ success: true, meeting: updated });
  } catch (error) {
    handleErrors(res, error, "Error updating meeting");
  }
});

// Delete meeting
router.delete("/:meetingId", async (req, res) => {
  try {
    const success = await deleteMeeting(req.params.meetingId);
    if (!success) return handleErrors(res, null, "Meeting not found", 404);
    res.json({ success: true });
  } catch (error) {
    handleErrors(res, error, "Error deleting meeting");
  }
});

module.exports = router;
