
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
        const response = await fetch(`/api/campaign/1/test`, 
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
        