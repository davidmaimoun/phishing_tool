from datetime import datetime

def get_current_date(): 
    current_datetime = datetime.now()

    formatted_date = current_datetime.strftime("%Y-%m-%d")

    formatted_time = current_datetime.strftime("%H:%M:%S")

    return formatted_date, formatted_time
