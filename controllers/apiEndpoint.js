const endpoints = require("../endpoints.json");
const { fetchEndPoints } = require("../models/endpointsModels");

exports.getEndPoints = (req, res, next) => {
  fetchEndPoints()
    .then((endpoints) => {
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
