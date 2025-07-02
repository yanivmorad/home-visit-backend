// src/routes/childrenRoutes.js
const express = require("express");
const router = express.Router();
const { handleErrors } = require("../middleware/errorHandler");
const { validateChild } = require("../utils/validation");
const {
  getAllChildren,
  getChildById,
  addChild,
  updateChild,
  patchChild,
  deleteChild,
} = require("../data/childrenData");
const { prioritizeChildren, getChildDetails } = require("../logic/childLogic");

// Get all children
router.get("/", async (req, res) => {
  try {
    const children = await prioritizeChildren();
    res.json(children);
  } catch (error) {
    handleErrors(res, error, "Error fetching children data");
  }
});

// Get child by ID
router.get("/:id", async (req, res) => {
  try {
    const child = await getChildDetails(req.params.id);
    if (!child) return handleErrors(res, null, "Child not found", 404);
    res.json(child);
  } catch (error) {
    handleErrors(res, error, "Error fetching child");
  }
});

// Add new child
router.post("/", async (req, res) => {
  try {
    const errMsg = validateChild(req.body);
    if (errMsg) return handleErrors(res, null, errMsg, 400);
    const newChild = await addChild(req.body);
    res.status(201).json({ success: true, child: newChild });
  } catch (error) {
    handleErrors(res, error, "Error adding child");
  }
});

// Full update
router.put("/:id", async (req, res) => {
  try {
    const errMsg = validateChild(req.body);
    if (errMsg) return handleErrors(res, null, errMsg, 400);
    const updated = await updateChild(req.params.id, req.body);
    if (!updated) return handleErrors(res, null, "Child not found", 404);
    res.json({ success: true });
  } catch (error) {
    handleErrors(res, error, "Error updating child");
  }
});

// Partial update
router.patch("/:id", async (req, res) => {
  try {
    const updated = await patchChild(req.params.id, req.body);
    if (!updated) return handleErrors(res, null, "Child not found", 404);
    res.json({ success: true, child: updated });
  } catch (error) {
    handleErrors(res, error, "Error patching child");
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const success = await deleteChild(req.params.id);
    if (!success) return handleErrors(res, null, "Child not found", 404);
    res.json({ success: true });
  } catch (error) {
    handleErrors(res, error, "Error deleting child");
  }
});

module.exports = router;
