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
    },
    animalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    funcionarioId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tipoVacina: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    dataAplicacao: {  
        type: DataTypes.DATE,
        allowNull: false,
    },  
    proximaDose: {
        type: DataTypes.DATE,
        allowNull: true,
    }

});

module.exports = Vacina;
