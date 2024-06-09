import express from "express";
import mongoose from "mongoose";
import Workout from "../models/workoutModel.js";
import { requireauth } from "../middleware/requireauth.js"; // Ensure this import path is correct

const router = express.Router();
router.use(requireauth);

// GET all workouts
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({}).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET a single workout by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout found" });
  }

  try {
    const workout = await Workout.findById(id);
    if (!workout) {
      return res.status(404).json({ error: "No such workout" });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new workout
router.post("/", async (req, res) => {
  const { title, load, reps } = req.body;

  let emptyFields = [];
  if (!title) emptyFields.push("title");
  if (!load) emptyFields.push("load");
  if (!reps) emptyFields.push("reps");

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill in all fields", emptyFields });
  }

  try {
    const workout = await Workout.create({ title, load, reps });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a workout by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout found" });
  }

  try {
    const workout = await Workout.findByIdAndDelete(id);
    if (!workout) {
      return res.status(404).json({ error: "No such workout" });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH (update) a workout by ID
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout found" });
  }

  try {
    const workout = await Workout.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
    if (!workout) {
      return res.status(404).json({ error: "No such workout" });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
