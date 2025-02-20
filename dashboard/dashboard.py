import sqlite3
import os
import pandas as pd

DB_DIR = "/home/user1/Desktop/programs/phisingTool/backend/dbs" 

def fetch_data_from_db(db_name):
    db_path = os.path.join(DB_DIR, db_name)
    
    if not os.path.exists(db_path):
        print(f"Database file {db_name} does not exist!")
        return None
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    query = "SELECT * FROM credentials"
    df = pd.read_sql(query, conn)
    conn.close()
    return df

def fetch_all_data():
    all_data = {}
    for db_file in os.listdir(DB_DIR):
        if db_file.endswith(".db"):
            db_name = db_file
            data = fetch_data_from_db(db_name)
            if data is not None:
                all_data[db_name] = data
    return all_data

# Example: Get data for each file
all_data = fetch_all_data()

# If using Streamlit for a dashboard
import streamlit as st
for db_name, df in all_data.items():
    st.write(f"Data from {db_name}:")
    st.dataframe(df)
