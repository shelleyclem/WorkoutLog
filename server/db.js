const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:AnElephantNF@localhost:54532/workout-log')

module.exports = sequelize; 

