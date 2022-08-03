const express = require("express");
const app = express();
const { getAPITopics, getAPIArticles } = require("./controllers/controllers");

// app.js GET
app.get("/api/topics", getAPITopics);
app.get("/api/articles/:article_id", getAPIArticles);

// app.use("*", function (req, res, next) {
//   res.status(404).send({ msg: "Route not found" });
//   next();
// });

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
});

module.exports = app;
