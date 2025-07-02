// src/data/meetingsData.js
const db = require("../db");

// מממש Mapping משדות snake_case ל-camelCase
const mapMeeting = (row) => ({
  id: String(row.id),
  childId: String(row.child_id),
  date: new Date(row.date).toISOString(),
  summary: row.summary,
});

const getAllMeetings = async () => {
  const rows = await db("meetings").select("*");
  return rows.map(mapMeeting);
};

const getMeetingsByChildId = async (childId) => {
  const rows = await db("meetings")
    .where({ child_id: childId })
    .orderBy("date", "desc");
  return rows.map(mapMeeting);
};

const getMeetingById = async (id) => {
  const row = await db("meetings").where({ id }).first();
  return row ? mapMeeting(row) : null;
};

const addMeeting = async (childId, { date, summary }) => {
  const [row] = await db("meetings")
    .insert({ child_id: childId, date, summary })
    .returning("*");
  return mapMeeting(row);
};

const updateMeeting = async (id, updates) => {
  const payload = {};
  if (updates.childId) payload.child_id = updates.childId;
  if (updates.date) payload.date = updates.date;
  if (updates.summary) payload.summary = updates.summary;

  const [row] = await db("meetings")
    .where({ id })
    .update(payload)
    .returning("*");
  return row ? mapMeeting(row) : null;
};

const deleteMeeting = async (id) => {
  const count = await db("meetings").where({ id }).del();
  return count > 0;
};

module.exports = {
  getAllMeetings,
  getMeetingsByChildId,
  getMeetingById,
  addMeeting,
  updateMeeting,
  deleteMeeting,
};
