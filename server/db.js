const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
    // process.env.DB_NAME,
    // process.env.DB_USER,
    // process.env.DB_PASSWORD,
    // {
        {dialect:'sqlite',}
    //     host: process.env.DB_HOST || 'localhost',
    //     port: process.env.DB_PORT || 5432,
    // }
)