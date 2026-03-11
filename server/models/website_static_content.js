const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('website_static_content', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    about_us: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    facebook_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    x_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    instagram_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    linkedin_likn: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sale_team_no1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sale_team_no2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sale_team_no3: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'website_static_content',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
