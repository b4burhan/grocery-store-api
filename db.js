const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('grocery_store.db');

// Create tables if they don't exist
db.serialize(() => {
  // Create the 'categories' table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);

  // Create the 'products' table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      image TEXT
    )
  `);
});

module.exports = db;
