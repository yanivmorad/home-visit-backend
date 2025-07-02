// src/utils/fileUtils.js
const fs = require("fs").promises;
const {
  CHILDREN_DATA_PATH,
  MEETINGS_DATA_PATH,
} = require("../config/constants");

const initializeDataFiles = async () => {
  try {
    await fs.access(CHILDREN_DATA_PATH);
  } catch {
    await fs.writeFile(CHILDREN_DATA_PATH, JSON.stringify([], null, 2));
  }
  try {
    await fs.access(MEETINGS_DATA_PATH);
  } catch {
    await fs.writeFile(MEETINGS_DATA_PATH, JSON.stringify([], null, 2));
  }
};

module.exports = { initializeDataFiles };
