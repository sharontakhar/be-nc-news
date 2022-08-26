const { RowDescriptionMessage } = require("pg-protocol/dist/messages");
const { query } = require("../db/connection");
const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const comments = require("../db/data/test-data/comments");

//GET COMMENTS
exports.selectComments = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment not found",
        });
      }

      return comments.rows;
    });
};

//POST COMMENTS

exports.insertComments = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1,$2, $3) RETURNING *;",
      [article_id, username, body]
    )
    .then((comments) => {
      return comments.rows[0];
    });
};

//DELETE ARTICLE BY ID
exports.deleteArticlebyID = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
    .then((result) => {
      return result;
    });
};
