const articles = require("../db/data/test-data/articles");
const {
  selectComments,
  insertComments,
  deleteArticlebyID,
} = require("../models/commentModel");

//GET COMMENTS
exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  selectComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

//POST COMMENTs
exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (req.body == undefined || req.body == null) {
    res.status(400).send("Bad Request");
  } else
    insertComments(article_id, username, body)
      .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch((err) => {
        next(err);
      });
};

//DELETE API BY ID
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteArticlebyID(comment_id)
    .then(() => {
      res.status(204).send("Not Found");
    })
    .catch((err) => {
      next(err);
    });
};
