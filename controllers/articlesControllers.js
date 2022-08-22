const articles = require("../db/data/test-data/articles");
const {
  selectArticlesById,
  updateArticles,
  selectArticles,
} = require("../models/articleModels");

//GET API ARTICLES BY ID
exports.getAPIArticlesbyID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

//GET API ARTICLES
exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
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
