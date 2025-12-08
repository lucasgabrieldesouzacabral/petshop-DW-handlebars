const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Vacina = sequelize.define('Vacina', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dataAplicacao: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Vacina;
