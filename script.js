// --- NAVIGATION ---
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// --- CLOCK ---
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// --- SEARCH & RESTRICTIONS ---
const banned = ["porn", "sex", "dick", "fuck", "pussy"];
let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

function runInternalSearch() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const isAdult = localStorage.getItem('isAdult') === 'true';

    if (banned.some(word => q.includes(word)) && !isAdult) {
        document.getElementById('consentModal').style.display = 'flex';
        return;
    }

    if (q) {
        history.unshift(q);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        alert("Internal Search Result: No local data found for " + q);
        renderHistory();
    }
}

function verifyAge() {
    const age = prompt("Enter age:");
    if (age >= 18) {
        localStorage.setItem('isAdult', 'true');
        alert("Consent Form Signed. Restrictions lifted.");
    }
}

// --- SPOTIFY LITE (Needs Client ID) ---
// To get Liked Songs, you need an Access Token via Spotify Login
function loginSpotify() {
    const clientId = 'YOUR_CLIENT_ID_HERE'; // Get from Spotify Dev Dashboard
    const redirectUri = window.location.href; 
    const scopes = 'user-library-read';
    
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
}

// Check for token in URL after login
const hash = window.location.hash.substring(1).split('&').reduce((initial, item) => {
    if (item) { var parts = item.split('='); initial[parts] = decodeURIComponent(parts); }
    return initial;
}, {});

if (hash.access_token) {
    fetch('https://api.spotify.com/v1/me/tracks', {
        headers: { 'Authorization': 'Bearer ' + hash.access_token }
    })
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById('trackList');
        list.innerHTML = data.items.map(item => `<div>🎵 ${item.track.name}</div>`).join('');
    });
}

// --- PROGRESS DOTS ---
let progress = JSON.parse(localStorage.getItem('progress')) || [];
function addProg() {
    const name = document.getElementById('progName').value;
    const val = document.getElementById('progVal').value;
    if (name && val) {
        progress.push({ name, val });
        localStorage.setItem('progress', JSON.stringify(progress));
        renderProg();
    }
}

function renderProg() {
    const container = document.getElementById('dotsContainer');
    container.innerHTML = progress.map(p => `<div class="dot" title="${p.name}">${p.val}</div>`).join('');
}

// Initialization
renderProg();
function closeModal() { document.getElementById('consentModal').style.display = 'none'; }