const fs = require("fs").promises;
const { CHILDREN_DATA_PATH } = require("../config/constants");

const getAllChildren = async () => {
  return JSON.parse(await fs.readFile(CHILDREN_DATA_PATH, "utf-8"));
};

const writeChildren = async (data) => {
  await fs.writeFile(CHILDREN_DATA_PATH, JSON.stringify(data, null, 2));
};

const getChildById = async (id) => {
  const data = await getAllChildren();
  return data.find((c) => c.id === id);
};

const addChild = async (newChild) => {
  const data = await getAllChildren();
  newChild.id = String(data.length + 1).padStart(3, "0");
  newChild.lastVisit = null;
  data.push(newChild);
  await writeChildren(data);
  return newChild;
};

const updateChild = async (id, updatedChild) => {
  const data = await getAllChildren();
  const childIndex = data.findIndex((c) => c.id === id);
  if (childIndex === -1) return null;
  data[childIndex] = { ...data[childIndex], ...updatedChild, id };
  await writeChildren(data);
  return data[childIndex];
};

const patchChild = async (id, updates) => {
  const data = await getAllChildren();
  const childIndex = data.findIndex((c) => c.id === id);
  if (childIndex === -1) return null;
  data[childIndex] = { ...data[childIndex], ...updates };
  await writeChildren(data);
  return data[childIndex];
};

const deleteChild = async (id) => {
  let data = await getAllChildren();
  const childIndex = data.findIndex((c) => c.id === id);
  if (childIndex === -1) return false;
  data = data.filter((c) => c.id !== id);
  await writeChildren(data);
  return true;
};

module.exports = {
  getAllChildren,
  getChildById,
  addChild,
  updateChild,
  patchChild,
  deleteChild,
};
