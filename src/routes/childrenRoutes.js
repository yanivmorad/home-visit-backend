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

// Get all children (with prioritization)
router.get("/", async (req, res) => {
  try {
    const children = await prioritizeChildren();
    res.json(children);
  } catch (error) {
    return handleErrors(res, error, "Error fetching children data");
  }
});

// Get child by ID (with details)
router.get("/:id", async (req, res) => {
  try {
    const child = await getChildDetails(req.params.id);
    if (!child) {
      return handleErrors(res, null, "Child not found", 404);
    }
    res.json(child);
  } catch (error) {
    return handleErrors(res, error, "Error fetching child");
  }
});

// Add new child
router.post("/", async (req, res) => {
  try {
    const validationError = validateChild(req.body);
    if (validationError) {
      return handleErrors(res, null, validationError, 400);
    }
    const newChild = await addChild(req.body);
    return res.status(201).json({ success: true, child: newChild });
  } catch (error) {
    return handleErrors(res, error, "Error adding child");
  }
});

// Update child (full update)
router.put("/:id", async (req, res) => {
  try {
    const validationError = validateChild(req.body);
    if (validationError) {
      return handleErrors(res, null, validationError, 400);
    }
    const updatedChild = await updateChild(req.params.id, req.body);
    if (!updatedChild) {
      return handleErrors(res, null, "Child not found", 404);
    }
    return res.json({ success: true });
  } catch (error) {
    return handleErrors(res, error, "Error updating child");
  }
});

// Partial update child
router.patch("/:id", async (req, res) => {
  try {
    const updatedChild = await patchChild(req.params.id, req.body);
    if (!updatedChild) {
      return handleErrors(res, null, "Child not found", 404);
    }
    return res.json({ success: true, child: updatedChild });
  } catch (error) {
    return handleErrors(res, error, "Error patching child");
  }
});

// Delete child
router.delete("/:id", async (req, res) => {
  try {
    const success = await deleteChild(req.params.id);
    if (!success) {
      return handleErrors(res, null, "Child not found", 404);
    }
    return res.json({ success: true });
  } catch (error) {
    return handleErrors(res, error, "Error deleting child");
  }
});

module.exports = router;
