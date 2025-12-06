const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Agendamento = sequelize.define('Agendamento', {
    animalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    funcionarioId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Pode ser opcional inicialmente
    },
    vacinaId: {                    
        type: DataTypes.INTEGER,
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

