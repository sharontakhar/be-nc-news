const fs = require("fs/promises");

exports.fetchEndPoints = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((response) => {
    return JSON.parse(response);
  });
};
