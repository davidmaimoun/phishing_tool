import subprocess
import time
import webbrowser

def run_flask():
    return subprocess.Popen(["python", "backend/app.py"])

def run_streamlit():
    return subprocess.Popen(["streamlit", "run", "dashboard/dashboard.py"])

if __name__ == "__main__":
    print("🚀 Starting Flask backend...")
    flask_process = run_flask()
    time.sleep(5)  # Give Flask time to start

    # print("📊 Starting Streamlit dashboard...")
    # streamlit_process = run_streamlit()

    print("\nWhich phishing page do you want to open?")
    print("1 - Facebook")
    print("2 - Netflix")
    print("3 - None")

    choice = input("Enter a number: ")
    if choice == "1":
        webbrowser.open("http://127.0.0.1:5000/facebook")
    elif choice == "2":
        webbrowser.open("http://127.0.0.1:5000/netflix")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping services...")
        flask_process.terminate()
        streamlit_process.terminate()
        print("✅ All processes stopped.")
