const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:AnElephantNF@localhost:54532/')
// !!!!!! finish ^^^

module.exports = sequelize; 

