<script>
    import Cookies from 'js-cookie';
    async function post() {
        let username = document.getElementById('username').value
        let data = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }

        const response = await fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
            },
        )
        const result = await response.json();
        if (result){
            Cookies.set('auth', username, { expires: 10 });
            window.location.href = '/'
        } 
        else {
            const message = document.getElementById('message')
            message.innerHTML = 'Username Taken'
        }
    }
</script>


<h1>register</h1>



<form on:submit={post}>
    <input type = 'text' name  = 'username' placeholder = 'username' id = 'username'>
    <input type = 'text' name  = 'password' placeholder  = 'password' id = 'password'>
    <input type = 'submit'>
</form>
<div id = 'message'></div>