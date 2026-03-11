const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      role: {
        type: DataTypes.ENUM("0", "1", "2"),
        allowNull: false,
        defaultValue: "1",
        comment: "o=>admin,1=>users,2=>agent",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "email",
      },
      countryCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "",
      },
      phoneNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: "phoneNumber",
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      otp: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      otpVerify: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: false,
        defaultValue: "0",
        comment: "0=>not verify,1=>verify",
      },
      status: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: false,
        defaultValue: "1",
        comment: "0=>incative,1=>active",
      },
      loginTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      latitude: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      longitude: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      forgotPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      isNotification: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: false,
        defaultValue: "0",
      },
      deviceToken: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      deviceType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "1=>iOS, 2=>android",
      },
      socketId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      online: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: false,
        defaultValue: "1",
        comment: "for chat 1=>online, 0=>offline",
      },
      customerId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
        comment: "for Stripe Payment ",
      },
      hashAccount: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: false,
        defaultValue: "0",
        comment: "for Stripe Payment   0=>pending,1=>complete",
      },
      gender: {
        type: DataTypes.ENUM("0", "1", "2"),
        allowNull: false,
        defaultValue: "0",
        comment: "0=>male, 1=>female, 2=>other",
      },
      dob: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "",
      },
      isProfileComplete: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: true,
        defaultValue: "0",
        comment: "0 means not complete, 1 means complete",
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      alias: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      adminCommission: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "",
      },

      social_login_type: {
        type: DataTypes.ENUM("google", "apple", "facebook"),
        allowNull: true,
      },
      social_login_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
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
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "phoneNumber",
          unique: true,
          using: "BTREE",
          fields: [{ name: "phoneNumber" }],
        },
      ],
    },
  );
};
