const { RowDescriptionMessage } = require("pg-protocol/dist/messages");
const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");
const articles = require("../db/data/test-data/articles");

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
exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  let articleProps = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];

  if (!articleProps.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  let validOrders = ["DESC", "ASC"];

  if (order) {
    if (!validOrders.includes(order)) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request",
      });
    }
  }

  if (topic) {
    const topicQuery = db.query(`SELECT * FROM topics WHERE slug = $1;`, [
      topic,
    ]);

    return db
      .query(
        `SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id  WHERE topic = $1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`,
        [topic]
      )
      .then((articles) => {
        if (articles.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Route not found",
          });
        }
        return articles.rows;
      });
  } else {
    return db
      .query(
        `SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
      )

      .then((articles) => {
        if (articles.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Route not found",
          });
        }
        return articles.rows;
      });
  }
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
