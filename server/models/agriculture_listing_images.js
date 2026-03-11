const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "agriculture_listing_images",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      agriculture_listing_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "agriculture_listings",
          key: "id",
        },
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "agriculture_listing_images",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "listing_id",
          using: "BTREE",
          fields: [{ name: "agriculture_listing_id" }],
        },
      ],
    },
  );
};
