const articles = require("../db/data/test-data/articles");
const { selectTopics } = require("../models/topicsModel");

//GET API TOPICS
exports.getAPITopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
