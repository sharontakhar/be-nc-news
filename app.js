const express = require("express");
const app = express();
const {
  getAPIArticlesbyID,
  patchAPIArticles,
  getArticles,
} = require("./controllers/articlesControllers");
const { getUsers } = require("./controllers/usersController.js");
const { getAPITopics } = require("./controllers/topicsController.js");
const {
  getComments,
  postComments,
  deleteComment,
} = require("./controllers/commentControllers");
const cors = require("cors");
app.user(cors());

const { getEndPoints } = require("./controllers/apiEndpoint.js");
app.use(express.json());
// GET
app.get("/api/topics", getAPITopics);
app.get("/api/articles/:article_id", getAPIArticlesbyID);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);

//POST
app.post("/api/articles/:article_id/comments", postComments);

//PATCH
app.patch("/api/articles/:article_id", patchAPIArticles);

//DELETE
app.delete("/api/comments/:comment_id", deleteComment);

//ENDPOINT
app.get("/api", getEndPoints);

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
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Bad Request" });
  }
});

module.exports = app;
