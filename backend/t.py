import sqlite3
import hashlib

conn = sqlite3.connect("dbs/user.db")
cursor = conn.cursor()

# Create users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
''')

# Hash password function
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Insert default admin user
cursor.execute("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", 
               ("admin", hash_password("123")))

conn.commit()
conn.close()

print("Database initialized with admin user.")
