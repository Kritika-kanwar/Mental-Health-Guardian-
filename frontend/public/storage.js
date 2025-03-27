// ✅ Function to store token and userId after login
function storeUserData(token, userId) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    console.log('✅ User data stored successfully');
}

// ✅ Function to get stored user data
function getUserData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return { token, userId };
}

// ✅ Function to clear user data (for logout)
function clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    console.log('✅ User data cleared');
}

async function login(email, password) {
    const response = await fetch('http://localhost:8085/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        storeUserData(data.token, data.user._id); // Make sure `data.user._id` exists
        alert('Login successful');
        window.location.href = '/dashboard.html';
    } else {
        alert(data.message || "Login failed"); // Handle error message properly
    }
}

async function fetchScreenTime() {
    const { token } = getUserData();
    if (!token) return;
    
    const screenTimeElement = document.getElementById('screen-time');
    if (!screenTimeElement) return;

    const response = await fetch('http://localhost:8085/api/screentime', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const data = await response.json();
        screenTimeElement.textContent = `Total Time: ${data.totalTime}`;
    }
}

async function fetchMood() {
    const { token } = getUserData();
    if (!token) return;

    const moodElement = document.getElementById('mood');
    if (!moodElement) return;

    const response = await fetch('http://localhost:8085/api/moods', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const data = await response.json();
        moodElement.textContent = `Current Mood: ${data.mood}`;
    }
}

// ✅ Fetch data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchScreenTime();
    fetchMood();
});
