const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    password: "Sillpoiss123",
    database: "webpage",
    host: "localhost",
    port: "5432"
});
module.exports = pool;
