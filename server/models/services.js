const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "services",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "",
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(0, 1),
        allowNull: false,
        defaultValue: 1,
        comment: "0=>incative,1=>active",
      },
      // created_by: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "users",
      //     key: "id",
      //   },
      // },
    },
    {
      sequelize,
      tableName: "services",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "created_by",
          using: "BTREE",
          fields: [{ name: "created_by" }],
        },
      ],
    },
  );
};
