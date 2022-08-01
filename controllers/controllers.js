const { selectTopics } = require("../models/models");

exports.getAPITopics = (req, res) => {
  console.log("i am in the controller");
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
