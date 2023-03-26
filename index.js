const express = require("express");
const app = express();
const expressformidable = require("express-formidable");
const drugstore = require("./drugstore.js");
const todolist = require("./todolist.js");

app.use(expressformidable());
app.use("/drugstore", drugstore);
app.use("/todolist", todolist);

app.listen(3000, (req, res) => {
  console.log("Server started");
});
