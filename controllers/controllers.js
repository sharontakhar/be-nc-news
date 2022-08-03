const { selectTopics, selectArticles } = require("../models/models");

exports.getAPITopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

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
