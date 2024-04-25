const sqlite3 = require('sqlite3').verbose();

// SQLite3 database setup
const db = new sqlite3.Database('./database.db');

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      admin BOOLEAN DEFAULT 0 NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_data (
      id INTEGER,
      username TEXT NOT NULL,
      data TEXT
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS user_todo (
      id INTEGER,
      username TEXT NOT NULL,
      date TEXT,
      todo TEXT
    )
  `);

  const admin_name =  "admin"
  const admin_pass = "admin"
  const admin_bool = 1

  db.run('INSERT INTO users (username, password, admin) VALUES (?, ?, ?)', [admin_name, admin_pass, admin_bool], (err) => {
    if (err) {

      console.error(err.message);
      // console.log("existing admin from previous session");
    }

  });
});

module.exports = db;
