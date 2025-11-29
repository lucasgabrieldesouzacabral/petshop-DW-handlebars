const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Agendamento = sequelize.define('Agendamento', {
    animalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

