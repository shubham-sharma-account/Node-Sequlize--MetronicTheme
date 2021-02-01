const config = require('./config');
const dbconfig = config.env.database;
const Sequelize = require('sequelize');

const connection = new Sequelize(dbconfig.dbname, dbconfig.username, dbconfig.password, {
    host: dbconfig.host,
    dialect: 'mysql'
});
connection.authenticate().then((err) => {
    if (err) {
        console.log('Error in connection');
    } else {
        console.log('Connected successfully');
    }
})

module.exports = connection;