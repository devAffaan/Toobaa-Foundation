
async function login() {
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        document.getElementById('errorMsg').style.display = 'block';
        document.getElementById('errorMsg').textContent = 'Please fill all fields!';
        return;
    }

    const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        window.location.href = '/admin/dashboard';
    } else {

        document.getElementById('errorMsg').style.display = 'block';
        document.getElementById('errorMsg').textContent = 'Wrong username or password!';
    }
}