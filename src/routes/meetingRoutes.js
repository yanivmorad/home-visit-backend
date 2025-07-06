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
    res.json({ success: true, meetings });
  } catch (error) {
    handleErrors(res, error, "Error fetching meetings");
  }
});

// Get all meetings for a specific child
router.get("/child/:childId", async (req, res) => {
  try {
    const meetings = await getMeetingsByChildId(req.params.childId);
    res.json({ success: true, meetings });
  } catch (error) {
    handleErrors(res, error, "Error fetching child meetings");
  }
});

// Get a single meeting by its ID
router.get("/:meetingId", async (req, res) => {
  try {
    const meeting = await getMeetingById(req.params.meetingId);
    if (!meeting) {
      return handleErrors(res, null, "Meeting not found", 404);
    }
    res.json({ success: true, meeting });
  } catch (error) {
    handleErrors(res, error, "Error fetching meeting");
  }
});

// Add a new meeting
router.post("/", async (req, res) => {
  try {
    const errMsg = validateMeeting(req.body);
    if (errMsg) {
      return handleErrors(res, null, errMsg, 400);
    }

    const { childId, date, summary } = req.body;
    const meeting = await addMeeting(childId, { date, summary });
    res.status(201).json({ success: true, meeting });
  } catch (error) {
    handleErrors(res, error, "Error adding meeting");
  }
});

// Update an existing meeting
router.put("/:meetingId", async (req, res) => {
  try {
    const errMsg = validateMeeting(req.body);
    if (errMsg) {
      return handleErrors(res, null, errMsg, 400);
    }

    const { date, summary, childId } = req.body;
    const updated = await updateMeeting(req.params.meetingId, {
      date,
      summary,
      childId,
    });

    if (!updated) {
      return handleErrors(res, null, "Meeting not found", 404);
    }

    res.json({ success: true, meeting: updated });
  } catch (error) {
    handleErrors(res, error, "Error updating meeting");
  }
});

// Delete a meeting
router.delete("/:meetingId", async (req, res) => {
  try {
    const success = await deleteMeeting(req.params.meetingId);
    if (!success) {
      return handleErrors(res, null, "Meeting not found", 404);
    }
    res.json({ success: true });
  } catch (error) {
    handleErrors(res, error, "Error deleting meeting");
  }
});

module.exports = router;
