// src/data/childrenData.js
const db = require("../db");

// ממפה שדות PostgreSQL (snake_case) לאובייקט JS (camelCase)
const mapChild = (row) => ({
  id: String(row.id),
  name: row.name,
  area: row.area,
  city: row.city,
  address: row.address,
  // phone_numbers מאוחסן ב-JSONB ומוחזר כמערך JS
  phoneNumbers: row.phone_numbers || [],
  // birth_date מאוחסן כ-DATE ונשלח כ-'YYYY-MM-DD'
  birthDate: row.birth_date || null,
  // תעודת זהות
  idNumber: row.id_number || null,
  frequencyDays: row.frequency_days,
  // last_visit מאוחסן כ-DATE ונשלח כ-'YYYY-MM-DD'
  lastVisit: row.last_visit || null,
});

// Select כל הילדים
const getAllChildren = async () => {
  const rows = await db("children").select("*");
  return rows.map(mapChild);
};

// קבלת ילד לפי ID
const getChildById = async (id) => {
  const row = await db("children").where({ id }).first();
  return row ? mapChild(row) : null;
};

// הוספת ילד חדש
const addChild = async ({
  name,
  area,
  city,
  address,
  phoneNumbers = [],
  birthDate = null,
  idNumber = null,
  frequencyDays = 0,
}) => {
  const [row] = await db("children")
    .insert({
      name,
      area,
      city,
      address,
      phone_numbers: JSON.stringify(phoneNumbers),
      birth_date: birthDate,
      id_number: idNumber,
      frequency_days: frequencyDays,
      last_visit: null,
    })
    .returning("*");
  return mapChild(row);
};

// עדכון מלא של ילד
const updateChild = async (
  id,
  {
    name,
    area,
    city,
    address,
    phoneNumbers,
    birthDate,
    idNumber,
    frequencyDays,
  }
) => {
  const payload = { name, area, city, address };
  if (phoneNumbers !== undefined)
    payload.phone_numbers = JSON.stringify(phoneNumbers);
  if (birthDate !== undefined) payload.birth_date = birthDate;
  if (idNumber !== undefined) payload.id_number = idNumber;
  if (frequencyDays !== undefined) payload.frequency_days = frequencyDays;

  const [row] = await db("children")
    .where({ id })
    .update(payload)
    .returning("*");
  return row ? mapChild(row) : null;
};

// עדכון חלקי של ילד
const patchChild = async (id, updates) => {
  const payload = {};
  if (updates.name) payload.name = updates.name;
  if (updates.area) payload.area = updates.area;
  if (updates.city) payload.city = updates.city;
  if (updates.address) payload.address = updates.address;
  if (updates.phoneNumbers !== undefined)
    payload.phone_numbers = JSON.stringify(updates.phoneNumbers);
  if (updates.birthDate !== undefined) payload.birth_date = updates.birthDate;
  if (updates.idNumber !== undefined) payload.id_number = updates.idNumber;
  if (updates.frequencyDays !== undefined)
    payload.frequency_days = updates.frequencyDays;
  if (updates.lastVisit !== undefined) payload.last_visit = updates.lastVisit;

  const [row] = await db("children")
    .where({ id })
    .update(payload)
    .returning("*");
  return row ? mapChild(row) : null;
};

// מחיקת ילד
const deleteChild = async (id) => {
  const count = await db("children").where({ id }).del();
  return count > 0;
};

module.exports = {
  getAllChildren,
  getChildById,
  addChild,
  updateChild,
  patchChild,
  deleteChild,
};
