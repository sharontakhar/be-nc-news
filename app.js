const express = require("express");
const app = express();
const {
  getAPITopics,
  getAPIArticlesbyID,
  patchAPIArticles,
  getUsers,
  getArticles,
} = require("./controllers/controllers");

// GET
app.get("/api/topics", getAPITopics);
app.get("/api/articles/:article_id", getAPIArticlesbyID);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);

//PATCH
app.use(express.json());
app.patch("/api/articles/:article_id", patchAPIArticles);

// Error Handling
app.use("*", (req, res) => {
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
  } else if (err.code === "23502") {
    res.status(200).send({ msg: "Missing key" });
  }
});

module.exports = app;
