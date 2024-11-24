const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/users.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT UNIQUE, password TEXT)");

  const stmt = db.prepare("INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)");
  stmt.run("testuser", "test@example.com", "password123");
  stmt.finalize();
});

db.close();
