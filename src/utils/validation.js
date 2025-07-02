// src/utils/validation.js

const validateChild = (child) => {
  const requiredFields = ["name", "area", "city", "address", "phone"];
  for (const field of requiredFields) {
    if (!child[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
};

const validateMeeting = (meeting) => {
  if (!meeting.date || !meeting.summary) {
    return "Missing meeting details (date or summary)";
  }
  return null;
};

module.exports = { validateChild, validateMeeting };
