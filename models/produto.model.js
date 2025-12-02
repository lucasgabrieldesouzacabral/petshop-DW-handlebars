const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Produto;

