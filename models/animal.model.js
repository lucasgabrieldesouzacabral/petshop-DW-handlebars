const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Animal = sequelize.define('Animal', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    especie: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    raca: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tutorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = Animal;

