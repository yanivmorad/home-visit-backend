const fs = require("fs").promises;
const { MEETINGS_DATA_PATH } = require("../config/constants");
const { getChildById } = require("./childrenData");

const getAllMeetings = async () => {
  return JSON.parse(await fs.readFile(MEETINGS_DATA_PATH, "utf-8"));
};

const writeMeetings = async (data) => {
  await fs.writeFile(MEETINGS_DATA_PATH, JSON.stringify(data, null, 2));
};

const getMeetingsByChildId = async (childId) => {
  const data = await getAllMeetings();
  return data.filter((m) => m.childId === childId);
};

const getMeetingById = async (meetingId) => {
  const data = await getAllMeetings();
  return data.find((m) => m.id === meetingId);
};

const addMeeting = async (childId, newMeeting) => {
  // בדיקה שהילד קיים
  const child = await getChildById(childId);
  if (!child) return null;

  const data = await getAllMeetings();
  const meeting = {
    id: Date.now().toString(),
    childId,
    date: newMeeting.date,
    summary: newMeeting.summary,
  };
  data.push(meeting);
  await writeMeetings(data);
  return meeting;
};

const updateMeeting = async (meetingId, updatedMeeting) => {
  const data = await getAllMeetings();
  const meetingIndex = data.findIndex((m) => m.id === meetingId);
  if (meetingIndex === -1) return null;

  // בדיקה שהילד קיים אם childId משתנה
  if (updatedMeeting.childId) {
    const child = await getChildById(updatedMeeting.childId);
    if (!child) return null;
  }

  data[meetingIndex] = {
    ...data[meetingIndex],
    ...updatedMeeting,
    id: meetingId,
  };
  await writeMeetings(data);
  return data[meetingIndex];
};

const deleteMeeting = async (meetingId) => {
  let data = await getAllMeetings();
  const meetingIndex = data.findIndex((m) => m.id === meetingId);
  if (meetingIndex === -1) return false;
  data = data.filter((m) => m.id !== meetingId);
  await writeMeetings(data);
  return true;
};

module.exports = {
  getAllMeetings,
  getMeetingsByChildId,
  getMeetingById,
  addMeeting,
  updateMeeting,
  deleteMeeting,
};
