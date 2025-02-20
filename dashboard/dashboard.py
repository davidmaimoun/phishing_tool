import os
import sqlite3
import pandas as pd
import streamlit as st


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

def fetch_db_names(db_dir):
    db_names = []
    for db_file in os.listdir(db_dir):
        if db_file.endswith(".db"):
            db_names.append(db_file)
                  
    return db_names

def fetch_all_data(dbs):
    all_data = {}
    for db_name in dbs:
            db_file_full = f"{db_name}.db"
            data = fetch_data_from_db(db_file_full)
            if data is not None:
                all_data[db_name] = data
    return all_data


dbs_chosen = []
with st.sidebar:
    dbs = [os.path.splitext(f)[0] for f in os.listdir(DB_DIR) if f.endswith(".db")]

    dbs_chosen = st.multiselect('Place', dbs)

if dbs is not None:
    all_data = fetch_all_data(dbs_chosen)
    for db_name, df in all_data.items():
        st.write(f"Data from {db_name}:")
        st.dataframe(df)
