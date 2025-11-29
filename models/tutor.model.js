const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Tutor = sequelize.define('Tutor', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Tutor;

