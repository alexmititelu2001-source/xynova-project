let isLoginMode = false;

window.onload = function() {
    if (localStorage.getItem("active_session")) {
        console.log("User is logged in.");
    }
};

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('box-title').innerText = isLoginMode ? 'LOG IN' : 'SIGN UP NOW';
    document.getElementById('confirm-password').style.display = isLoginMode ? 'none' : 'block';
    document.getElementById('submit-btn').innerText = isLoginMode ? 'Log In' : 'Sign Up';
    document.getElementById('toggle-link').innerText = isLoginMode ? 'Need an account?' : 'Already have an account?';
}

function handleAuth() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    if (isLoginMode) {
        if (localStorage.getItem("user_" + user) === pass) {
            localStorage.setItem("active_session", user);
            window.location.reload();
        } else {
            console.log("Invalid login");
        }
    } else {
        localStorage.setItem("user_" + user, pass);
        toggleAuthMode();
    }
}

function mockDiscordLogin() {
    window.location.href = "https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_URL&response_type=code&scope=identify";
}