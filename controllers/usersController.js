const articles = require("../db/data/test-data/articles");
const { selectUsers } = require("../models/usersModel");

//GET API USERS
exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
