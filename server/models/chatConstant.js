const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('chatConstant', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        deletedId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        lastmessageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        deletedId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0
        },
    }, {
        sequelize,
        tableName: 'chatConstant',
        timestamps: true,
        paranoid: true,
    });
};
