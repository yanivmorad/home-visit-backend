// birth_date ו־last_visit – מאוחסנים ב־PostgreSQL כ־DATE, ומוחזרים ל־Node.js כבר כמחרוזת בפורמט ISO (YYYY-MM-DD).

const db = require("../db");

// ממפה שדות PostgreSQL (snake_case) לאובייקט JS (camelCase)
const mapChild = (row) => ({
  id: String(row.id),
  name: row.name,
  area: row.area,
  city: row.city,
  address: row.address,
  phoneNumbers: row.phone_numbers || [],
  birthDate: row.birth_date || null,
  idNumber: row.id_number || null,
  lastVisit: row.last_visit || null,
  category: row.category || null,
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
  category = null,
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
      last_visit: null,
      category,
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
    lastVisit,
    category,
  }
) => {
  const payload = { name, area, city, address };
  if (phoneNumbers !== undefined)
    payload.phone_numbers = JSON.stringify(phoneNumbers);
  if (birthDate !== undefined) payload.birth_date = birthDate;
  if (idNumber !== undefined) payload.id_number = idNumber;
  if (lastVisit !== undefined) payload.last_visit = lastVisit;
  if (category !== undefined) payload.category = category;

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
  if (updates.lastVisit !== undefined) payload.last_visit = updates.lastVisit;
  if (updates.category !== undefined) payload.category = updates.category;

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
