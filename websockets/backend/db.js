const sqlite3 = require('sqlite3').verbose();

// Create or open the database file
const db = new sqlite3.Database('chat.db', (err) => {
    if (err) console.error('Could not connect to SQLite:', err);
    else console.log('Connected to SQLite database');
  });
  
  // Create messages table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  function saveMessage(username, message) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO messages (username, message) VALUES (?, ?)`,
        [username, message],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  }
  module.exports = {
    db,
    saveMessage,
  };
  