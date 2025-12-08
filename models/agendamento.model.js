const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Agendamento = sequelize.define('Agendamento', {
    animalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    funcionarioId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    vacinaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tipoVacina: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    horario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Agendamento;

