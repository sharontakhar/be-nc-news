const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const comments = require("../db/data/test-data/comments");

//GET API TOPICS
exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

//GET API ARTICLES BY ID
exports.selectArticlesById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
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

//GET API ARTICLES
exports.selectArticles = () => {
  // let topics = [
  //   articles.author,
  //   articles.title,
  //   articles.topic,
  //   articles.article_id,
  //   articles.created_at,
  //   articles.votes,
  //   articles.comment_count,
  // ];

  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then((articles) => {
      return articles.rows;
    });
};

//GET USERS
exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => {
    return users.rows;
  });
};

//GET COMMENTS
exports.selectComments = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "comment not found",
        });
      }
      return comments.rows[0];
    });
};

//PATCH API ARTICLES
exports.updateArticles = (article_id, inc_votes = 0) => {
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
