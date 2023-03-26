const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const connection = mongoose.createConnection(
  "mongodb://localhost:27017/todolist"
);
const todolistSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    unique: true,
  },
});

const Task = connection.model("Task", todolistSchema);

//Verify the task existence
async function retrieveTaskByTitle(req, res, next) {
  let foundTask = await Task.findOne({ title: req.fields.actualTitle });
  req.foundTask = foundTask;
  next();
}

//Create a new task
router.post("/create", retrieveTaskByTitle, async (req, res) => {
  let taskStored = req.foundTask;
  let newTask = req.fields;
  if (!taskStored) {
    let taskDocument = new Task({ title: newTask.title });
    await taskDocument.save();
    res.status(200).json(taskDocument);
  } else {
    res.status(400).json({ error: "The task already exists" });
  }
});

//Access all tasks
router.get("/allTasks", async (req, res) => {
  let allTasks = await Task.find();
  res.status(200).json(allTasks);
});

//Update a task
router.post("/updateTask", retrieveTaskByTitle, async (req, res) => {
  let storedTask = req.foundTask;
  let newTask = req.fields;

  if (storedTask) {
    storedTask.title = newTask.newTitle;
    await storedTask.save();
    res.status(200).json(storedTask);
  } else {
    res.status(400).json({ error: "This task does not exist yet." });
  }
});

//Delete a task
router.delete("/deleteTask", retrieveTaskByTitle, async (req, res) => {
  let storedTask = req.foundTask;

  if (!storedTask) {
    res.status(400).json({ error: "Nonexistent task" });
  } else {
    await storedTask.deleteOne();
    res
      .status(200)
      .json({ message: "The task has been deleted successfully." });
  }
});

module.exports = router;
