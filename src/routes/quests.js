const express = require("express");
const Quest = require("../models/Quest");

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  const quest = await Quest.create(req.body);
  res.status(201).json(quest);
});

// READ ALL
router.get("/", async (req, res) => {
  const quests = await Quest.find().sort({ createdAt: -1 });
  res.json(quests);
});

// UPDATE
router.patch("/:id", async (req, res) => {
  const quest = await Quest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(quest);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Quest.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
