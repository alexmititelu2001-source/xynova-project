let isLoginMode = false;

window.onload = function() {
    // Check if Discord just sent us back with profile data
    const urlParams = new URLSearchParams(window.location.search);
    const urlUsername = urlParams.get('username');
    const urlAvatar = urlParams.get('avatar');

    if (urlUsername && urlAvatar) {
        localStorage.setItem("discord_username", urlUsername);
        localStorage.setItem("discord_avatar", urlAvatar);
        window.history.replaceState({}, document.title, "/"); // Cleans the URL bar
    }

    checkLoginState();
};

function checkLoginState() {
    const savedUsername = localStorage.getItem("discord_username") || localStorage.getItem("active_session");
    const savedAvatar = localStorage.getItem("discord_avatar");

    if (savedUsername) {
        // Hide the normal login box
        document.getElementById('auth-box').style.display = 'none';
        
        // Show the profile box
        const profileBox = document.getElementById('profile-box');
        profileBox.style.display = 'flex';
        
        // Put the data in the HTML
        document.getElementById('profile-username').innerText = savedUsername;
        if (savedAvatar) {
            document.getElementById('profile-avatar').src = savedAvatar;
            document.getElementById('profile-avatar').style.display = 'block';
        } else {
            document.getElementById('profile-avatar').style.display = 'none';
        }
    }
}

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
    
    if (!user || !pass) return;

    if (isLoginMode) {
        if (localStorage.getItem("user_" + user) === pass) {
            localStorage.setItem("active_session", user);
            window.location.reload();
        }
    } else {
        const confirmPass = document.getElementById('confirm-password').value;
        if (pass !== confirmPass) return;
        localStorage.setItem("user_" + user, pass);
        toggleAuthMode();
    }
}

function mockDiscordLogin() {
    // Send user to our server instead of straight to Discord
    window.location.href = "/auth/login";
}

function logout() {
    localStorage.clear();
    window.location.reload();
}
