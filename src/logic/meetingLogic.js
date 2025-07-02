// src/logic/meetingLogic.js
const { validateMeeting } = require("../utils/validation");
const {
  addMeeting,
  deleteMeeting,
  updateMeeting,
} = require("../data/meetingsData");
const { patchChild, getChildById } = require("../data/childrenData");
const { handleErrors } = require("../middleware/errorHandler");

// Add meeting handler
const addMeetingHandler = async (req, res) => {
  try {
    const { childId, date } = req.body;

    const validationError = validateMeeting(req.body);
    if (validationError) {
      return handleErrors(res, null, validationError, 400);
    }

    const meeting = await addMeeting(childId, req.body);
    if (!meeting) {
      return handleErrors(res, null, "Child not found", 404);
    }

    // רק אם התאריך חדש יותר מ-lastVisit
    const child = await getChildById(childId);
    const meetingDate = new Date(date);
    const lastVisitDate = child.lastVisit ? new Date(child.lastVisit) : null;

    if (!lastVisitDate || meetingDate > lastVisitDate) {
      await patchChild(childId, { lastVisit: date });
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
    const { meetingId } = req.params;
    const { childId: newChildId, date: newDate, ...rest } = req.body;

    const validationError = validateMeeting(req.body);
    if (validationError) {
      return handleErrors(res, null, validationError, 400);
    }

    const meeting = await updateMeeting(meetingId, req.body);
    if (!meeting) {
      return handleErrors(res, null, "Meeting or child not found", 404);
    }

    // עדכון lastVisit רק אם התאריך שונה והוא חדש יותר
    if (newDate) {
      const targetChildId = newChildId || meeting.childId;
      const child = await getChildById(targetChildId);
      const meetingDate = new Date(newDate);
      const lastVisitDate = child.lastVisit ? new Date(child.lastVisit) : null;

      if (!lastVisitDate || meetingDate > lastVisitDate) {
        await patchChild(targetChildId, { lastVisit: newDate });
      }
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
