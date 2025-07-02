// src/config/constants.js
const path = require("path");

module.exports = {
  PORT: process.env.PORT || 4000,

  CHILDREN_DATA_PATH: path.join(__dirname, "../data/children.json"),
  MEETINGS_DATA_PATH: path.join(__dirname, "../data/meetings.json"),
};
