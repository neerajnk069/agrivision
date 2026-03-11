var DataTypes = require("sequelize").DataTypes;
var _cms = require("./cms");

function initModels(sequelize) {
  var cms = _cms(sequelize, DataTypes);

  return {
    cms,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
