let isLoginMode = false;

const BANNED_WORDS = [
    "dick", "d1ck", "dickhead", "dicck", "dild", "dildo",
    "bitch", "b1tch", "biatch", "ass", "asshole", "arse", "arsehole", 
    "fuck", "fuc", "fuk", "fck", "fukah", "fuken", "fukin", "fukk", "motherfucker", "dumbfuck",
    "cunt", "cnut", "cvnt", "clit", "clunge", "shit", "sh1t",
    "whore", "wh0r", "whor3", "hoe", "h0e", "ho3", "h03", "slut",
    "twat", "tw4t", "tosser", "t0sser", "wanker", "w4nkers",
    "rape", "rap3", "r4pe", "cocaine", "meth", "fentanyl",
    "nigger", "nigga", "coon", "fag", "fagget", "faggot", "retard", "kike", "nazi"
];

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUsername = urlParams.get('username');
    const urlAvatar = urlParams.get('avatar');

    if (urlUsername && urlAvatar) {
        localStorage.setItem("discord_username", urlUsername);
        localStorage.setItem("discord_avatar", urlAvatar);
        window.history.replaceState({}, document.title, "/");
    }

    checkDiscordState();
};

function checkDiscordState() {
    const savedUsername = localStorage.getItem("discord_username") || localStorage.getItem("active_session");
    const savedAvatar = localStorage.getItem("discord_avatar");
    const discordArea = document.getElementById('discord-auth-area');

    if (savedUsername) {
        window.location.href = "/dashboard.html";
        return;
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('box-title').innerText = isLoginMode ? 'LOG IN' : 'SIGN UP NOW';
    document.getElementById('confirm-password').style.display = isLoginMode ? 'none' : 'block';
    document.getElementById('submit-btn').innerText = isLoginMode ? 'Log In' : 'Sign Up';
    document.getElementById('toggle-link').innerText = isLoginMode ? 'Need an account? Sign Up!' : 'Already have an account? Login!';
    showError(""); 
}

function handleAuth() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    
    if (!user || !pass) {
        showError("Please fill out all fields.");
        return;
    }

    if (isLoginMode) {
        if (localStorage.getItem("user_" + user.toLowerCase()) === pass) {
            localStorage.setItem("active_session", user);
            window.location.href = "/dashboard.html";
        } else {
            showError("Invalid username or password.");
        }
    } else {
        const confirmPass = document.getElementById('confirm-password').value;
        
        const cleanUser = user.toLowerCase().replace(/[^a-z0-9]/g, ""); 
        
        const containsSwearWord = BANNED_WORDS.some(word => {
            if (!word) return false; 
            return user.toLowerCase().includes(word) || cleanUser.includes(word);
        });

        if (containsSwearWord) {
            showError("Username contains inappropriate language!");
            return;
        }

        if (pass !== confirmPass) {
            showError("Passwords do not match.");
            return;
        }

        localStorage.setItem("user_" + user.toLowerCase(), pass);
        localStorage.setItem("active_session", user);
        
        window.location.href = "/dashboard.html";
    }
}

function showError(msg) {
    const errorDiv = document.getElementById('error-message');
    if (!msg) {
        errorDiv.style.display = 'none';
    } else {
        errorDiv.innerText = msg;
        errorDiv.style.display = 'block';
    }
}

function mockDiscordLogin() {
    window.location.href = "/auth/login";
}
