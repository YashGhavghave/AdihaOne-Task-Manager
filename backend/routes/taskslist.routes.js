import express from "express";
import { TaskModel } from "../Model/UserTask.DataModel.js";
import { verifyUser } from "../middleware/verify.js";

const Router = express.Router();

// Get all tasks for logged-in user
Router.get("/api/taskslist", verifyUser, async (req, res) => {
  try {
    const tasks = await TaskModel.find({ userId: req.userId });
    res.status(200).json({ message: "Tasks List Fetched Successfully", data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Tasks", error });
  }
});

Router.post("/api/taskslist", verifyUser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await TaskModel.create({ title, description, userId: req.userId });
    res.status(201).json({ message: "Task Created Successfully", data: task });
  } catch (error) {
    res.status(500).json({ message: "Error Creating Task", error });
  }
});

// Update a task (only own task)
Router.put("/api/taskslist/:id", verifyUser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });
    res.status(200).json({ message: "Task Updated Successfully", data: task });
  } catch (error) {
    res.status(500).json({ message: "Error Updating Task", error });
  }
});

// Delete a task (only own task)
Router.delete("/api/taskslist/:id", verifyUser, async (req, res) => {
  try {
    const task = await TaskModel.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });
    res.status(200).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Task", error });
  }
});

export default Router;
