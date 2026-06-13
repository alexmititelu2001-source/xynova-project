const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static('.'));

// We pull these from Railway Variables so your secret stays hidden
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// When they click "Verify", send them to Discord
app.get('/auth/login', (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    res.redirect(url);
});

// Discord sends them back here with a secret code
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.redirect('/?error=NoCodeProvided');

    try {
        // Trade the code for a token securely
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        });

        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        // Fetch the user's profile picture and name
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const user = userResponse.data;
        const avatarUrl = user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` 
            : 'https://cdn.discordapp.com/embed/avatars/0.png';

        // Send them back to your HTML page with the data in the URL
        res.redirect(`/?username=${encodeURIComponent(user.username)}&avatar=${encodeURIComponent(avatarUrl)}`);
        
    } catch (error) {
        console.error("OAuth Error:", error.response ? error.response.data : error.message);
        res.redirect('/?error=AuthenticationFailed');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
