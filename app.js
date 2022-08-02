const express = require("express");
const app = express();
const { getAPITopics, getAPIArticles } = require("./controllers/controllers");

// app.js GET
app.get("/api/topics", getAPITopics);
app.get("/api/articles/:article_id", getAPIArticles);

app.all("/*", function (req, res, next) {
  res.status(404).send({ msg: "Route not found" });
  next();
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
});

module.exports = app;
