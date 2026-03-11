const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "inquiries",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      countryCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "",
      },
      phoneNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "",
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      sequelize,
      tableName: "inquiries",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    },
  );
};
