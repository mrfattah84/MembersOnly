const pool = require('./pool');

async function getAll() {
  const users = await pool.query('SELECT * FROM users');
  return users;
}

module.exports = {
  getAll,
};
