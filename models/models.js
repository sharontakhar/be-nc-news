const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

//GET API TOPICS
exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

//GET API ARTICLES BY ID
exports.selectArticles = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((articles) => {
      if (articles.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }
      return articles.rows[0];
    });
};

//GET USERS
exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => {
    return users.rows;
  });
};

//PATCH API ARTICLES
exports.updateArticles = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes =+ $2 WHERE article_id = $1 RETURNING *;",
      [article_id, inc_votes]
    )
    .then((articles) => {
      if (articles.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }
      return articles.rows[0];
    });
};
