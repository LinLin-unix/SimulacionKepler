const mysql = require('mysql');
const { promisify } = require('util');

const { db } = require('./keys');

const pool = mysql.createPool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    connectionLimit: 10,
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DB CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DB HAS TOO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DB CONNECTION WAS REFUSED');
        }
    }

    if (connection) {
        connection.release();
        console.log('DB is Connected');
        return;
    }
});

// PROMISIFY POOL QUERY
pool.query = promisify(pool.query);

module.exports = pool;
