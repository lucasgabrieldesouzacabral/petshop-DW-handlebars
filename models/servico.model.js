const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Servico = sequelize.define('Servico', {
    animalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    funcionarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    produtoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tipoServico: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    valor: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendente',
    }
});

module.exports = Servico;

