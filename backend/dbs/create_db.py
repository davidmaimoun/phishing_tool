import sqlite3
import bcrypt

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('users.db')
cursor = conn.cursor()

# Create users table if it does not exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
''')

# Hash the password for the 'admin' user
password = '123'
hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Insert 'admin' user into the database (if not exists)
cursor.execute('''
INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)
''', ('admin', hashed_password))

# Commit and close the connection
conn.commit()
conn.close()

print("Database setup complete!")
