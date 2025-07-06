// src/data/meetingsData.js
const db = require("../db");

// ממפה שדות snake_case ל–camelCase ומעצב תאריך בפורמט YYYY-MM-DD
const mapMeeting = (row) => ({
  id: String(row.id),
  childId: String(row.child_id),
  date: formatDate(row.date),
  summary: row.summary,
});

function formatDate(value) {
  return typeof value === "string"
    ? value
    : new Date(value).toISOString().split("T")[0];
}

// Get all meetings
const getAllMeetings = async () => {
  const rows = await db("meetings").select("*");
  return rows.map(mapMeeting);
};

// Get meetings by childId
const getMeetingsByChildId = async (childId) => {
  const rows = await db("meetings")
    .where({ child_id: childId })
    .orderBy("date", "desc");
  return rows.map(mapMeeting);
};

// Get one meeting
const getMeetingById = async (id) => {
  const row = await db("meetings").where({ id }).first();
  return row ? mapMeeting(row) : null;
};

// Add a meeting and update last_visit atomically
const addMeeting = async (childId, { date, summary }) => {
  return await db.transaction(async (trx) => {
    // 1. הוסף את הפגישה
    const [row] = await trx("meetings")
      .insert({ child_id: childId, date, summary })
      .returning("*");

    // 2. מצא את התאריך המקסימלי
    const [{ max_date }] = await trx("meetings")
      .where({ child_id: childId })
      .max({ max_date: "date" });

    // 3. עדכן last_visit בטבלת children
    await trx("children")
      .where({ id: childId })
      .update({ last_visit: max_date });

    return mapMeeting(row);
  });
};

// Update a meeting and recalc last_visit אם שינית תאריך
const updateMeeting = async (id, updates) => {
  return await db.transaction(async (trx) => {
    const payload = {};
    if (updates.date) payload.date = updates.date;
    if (updates.summary) payload.summary = updates.summary;

    const [row] = await trx("meetings")
      .where({ id })
      .update(payload)
      .returning("*");

    if (!row) return null;

    // אם שונה תאריך – חישוב תאריך מקסימלי חדש
    const [{ max_date }] = await trx("meetings")
      .where({ child_id: row.child_id })
      .max({ max_date: "date" });

    await trx("children")
      .where({ id: row.child_id })
      .update({ last_visit: max_date });

    return mapMeeting(row);
  });
};

// Delete a meeting and recalc last_visit
const deleteMeeting = async (id) => {
  return await db.transaction(async (trx) => {
    const row = await trx("meetings").where({ id }).first();
    if (!row) return false;

    await trx("meetings").where({ id }).del();

    // מצא את התאריך הגדול ביותר שנותר
    const [{ max_date }] = await trx("meetings")
      .where({ child_id: row.child_id })
      .max({ max_date: "date" });

    await trx("children")
      .where({ id: row.child_id })
      .update({ last_visit: max_date });

    return true;
  });
};

module.exports = {
  getAllMeetings,
  getMeetingsByChildId,
  getMeetingById,
  addMeeting,
  updateMeeting,
  deleteMeeting,
};
