const articles = require("../db/data/test-data/articles");
const {
  selectTopics,
  selectArticles,
  updateArticles,
  selectUsers,
} = require("../models/models");

//GET API TOPICS
exports.getAPITopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

//GET API ARTICLES BY ID
exports.getAPIArticles = (req, res, next) => {
  const { article_id } = req.params;
  selectArticles(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

//GET API USERS
exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

//PATCH API ARTICLES
exports.patchAPIArticles = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticles(article_id, inc_votes)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};
