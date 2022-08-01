const db = require("../db/connection");

exports.selectTopics = () => {
  console.log("hello from select park model");
  return db.query("SELECT * FROM topics;").then((topics) => {
    console.log(topics.rows);
    return topics.rows;
  });
};
