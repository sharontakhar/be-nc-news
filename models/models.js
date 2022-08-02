const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticles = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((articles) => {
      return articles.rows[0];
    });
};
