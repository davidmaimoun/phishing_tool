import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email, subject, message, smtp_server, smtp_port, smtp_user, smtp_password):
    try:
        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(message, "plain"))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Secure connection
        server.login(smtp_user, smtp_password)  # Login to SMTP server
        server.sendmail(smtp_user, to_email, msg.as_string())  # Send email
        server.quit()  # Close connection
        return "Email sent successfully!"
    
    except Exception as e:
        print(f"HERERERER\{e}")
        return f"Error sending email: {e}"
