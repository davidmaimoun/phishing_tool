import sqlite3

DB_NAME = "phishing_data.db"

# Connect to SQLite
conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

# Create table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        page TEXT NOT NULL
    )
''')

# Commit and close
conn.commit()
conn.close()

print("✅ Table 'credentials' created successfully!")
