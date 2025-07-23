
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  // user: 'postgres',
  // host: 'localhost',
  // database: 'inventory_db',
  // password: 'password',
  // port: 5433,
});

module.exports = pool;
