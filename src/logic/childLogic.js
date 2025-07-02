// src/logic/childLogic.js
const { getAllChildren, getChildById } = require("../data/childrenData");
const { getMeetingsByChildId } = require("../data/meetingsData");

// Calculate urgency for a single child (based on lastVisit)
const calculateUrgency = (child) => {
  if (!child.lastVisit) {
    return { urgencyScore: 1, status: "Urgent" };
  }

  const lastVisitDate = new Date(child.lastVisit);
  const today = new Date();
  const daysSinceLastVisit = Math.floor(
    (today - lastVisitDate) / (1000 * 60 * 60 * 24)
  );
  const urgentThreshold = 180; // 6 months
  const mediumThreshold = 90; // 3 months

  if (daysSinceLastVisit >= urgentThreshold) {
    return { urgencyScore: 1, status: "Urgent" };
  } else if (daysSinceLastVisit >= mediumThreshold) {
    return { urgencyScore: 0.75, status: "Medium" };
  } else {
    return { urgencyScore: 0.5, status: "Not Urgent" };
  }
};

// Prioritize all children
const prioritizeChildren = async () => {
  const children = await getAllChildren();
  return children
    .map((child) => ({ ...child, ...calculateUrgency(child) }))
    .sort((a, b) => b.urgencyScore - a.urgencyScore);
};

// Get child details with urgency status and meetings
const getChildDetails = async (childId) => {
  const child = await getChildById(childId);
  if (!child) return null;
  const meetings = await getMeetingsByChildId(childId);
  const urgency = calculateUrgency(child);
  return { ...child, ...urgency, meetings };
};

module.exports = {
  calculateUrgency,
  prioritizeChildren,
  getChildDetails,
};
