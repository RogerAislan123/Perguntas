//define um model // deve ter nome começando com letra maiuscula BOA PRATICA
const sequelize = require("sequelize");
const connection = require("./database");

const Perguntas = connection.define('perguntas',{
    titulo:{
        type: sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: sequelize.TEXT,
        allowNull: false
    }
});
// define os campos de uma tabela

Perguntas.sync({force: false}).then(() =>{}); //cria a tabela no banco

module.exports = Perguntas;