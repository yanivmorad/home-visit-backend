// src/logic/meetingLogic.js
const { validateMeeting } = require("../utils/validation");
const {
  addMeeting,
  deleteMeeting,
  updateMeeting,
} = require("../data/meetingsData");
const { handleErrors } = require("../middleware/errorHandler");

// Add meeting handler
const addMeetingHandler = async (req, res) => {
  try {
    // וידוא שהמשתמש שלח childId, date ו-summary תקינים
    const validationError = validateMeeting(req.body);
    if (validationError) {
      return handleErrors(res, null, validationError, 400);
    }

    const { childId, date, summary } = req.body;
    // כל העדכון של lastVisit מתבצע בטרנזקציה ב-addMeeting
    const meeting = await addMeeting(childId, { date, summary });
    if (!meeting) {
      return handleErrors(res, null, "Child not found", 404);
    }

    return res.status(201).json({ success: true, meeting });
  } catch (error) {
    return handleErrors(res, error, "Error adding meeting");
  }
};

// Delete meeting handler
const deleteMeetingHandler = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const success = await deleteMeeting(meetingId);
    if (!success) {
      return handleErrors(res, null, "Meeting not found", 404);
    }
    return res.json({ success: true });
  } catch (error) {
    return handleErrors(res, error, "Error deleting meeting");
  }
};

// Update meeting handler
const updateMeetingHandler = async (req, res) => {
  try {
    // ולידציה ראשונית
    const validationError = validateMeeting(req.body);
    if (validationError) {
      return handleErrors(res, null, validationError, 400);
    }

    const { meetingId } = req.params;
    // כל העדכון של lastVisit מתבצע בטרנזקציה ב-updateMeeting
    const meeting = await updateMeeting(meetingId, req.body);
    if (!meeting) {
      return handleErrors(res, null, "Meeting or child not found", 404);
    }

    return res.json({ success: true, meeting });
  } catch (error) {
    return handleErrors(res, error, "Error updating meeting");
  }
};

module.exports = {
  addMeeting: addMeetingHandler,
  deleteMeeting: deleteMeetingHandler,
  updateMeeting: updateMeetingHandler,
};
