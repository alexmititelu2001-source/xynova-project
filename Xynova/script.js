let isLoginMode = false;

const BANNED_WORDS = [
    "dick", "d1ck", "dickhead", "d1ckh@ed", "dicck", "dild", "dildo",
    "bitch", "b!tch", "b17ch", "biatch", "b1tch",
    "ass", "asshole", "arse", "arsehole", "@ss", "a$$", "assface",
    "fuck", "fuc", "fuk", "fck", "fukah", "fuken", "fukin", "fukk", "fukkah", "fukken", "fukker", "fukkin", "motherfucker", "mothafucker", "dumbfuck",
    "cunt", "c#nt", "cnut", "cvnt", "clit", "clunge",
    "shit", "sh1t", "5h1t", "4hit",
    "whore", "wh0r", "whor3", "hoe", "h0e", "ho3", "h03", "slut",
    "twat", "tw4t", "tw@t", "tosser", "t0sser", "wanker", "w4nkers",
    "rape", "r@pe", "rap3", "r4pe", "cocaine", "meth", "fentanyl",
    "nig", "n1g", "nigger", "nigga", "coon", "c00n", "fag", "f@g", "fagget", "faggot", "retard", "kike", "nazi", "naz1"
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
    const savedUsername = localStorage.getItem("discord_username");
    const savedAvatar = localStorage.getItem("discord_avatar");
    const discordArea = document.getElementById('discord-auth-area');

    if (savedUsername && discordArea) {
        discordArea.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; background: #e6e6e6; padding: 10px; border-radius: 6px; border: 1px solid #ccc;">
                <span style="font-size: 12px; font-weight: bold; color: #555; margin-bottom: 5px;">VERIFIED VIA DISCORD</span>
                <img src="${savedAvatar}" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #005a8d; margin-bottom: 5px;">
                <span style="font-weight: bold; color: #333; font-size: 15px; margin-bottom: 8px;">${savedUsername}</span>
                <button class="link-text" style="background: none; border: none; text-decoration: underline; color: #ff3333;" onclick="unlinkDiscord()">Unlink Discord</button>
            </div>
        `;
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
            showError("Successfully logged in!"); 
        } else {
            showError("Invalid username or password.");
        }
    } else {
        const confirmPass = document.getElementById('confirm-password').value;
        
        const cleanUser = user.toLowerCase().replace(/[^a-z0-9]/g, ""); 
        
        const containsSwearWord = BANNED_WORDS.some(word => {
            return user.toLowerCase().includes(word) || cleanUser.includes(word.replace(/[^a-z0-9]/g, ""));
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
        showError("");
        toggleAuthMode();
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

function unlinkDiscord() {
    localStorage.removeItem("discord_username");
    localStorage.removeItem("discord_avatar");
    window.location.reload();
}
