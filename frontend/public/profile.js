// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || !currentUser.name) {
    alert("No user data found. Please log in first.");
    window.location.href = "login page.html";
} else {
    document.getElementById("profile-name").textContent = currentUser.name;
    document.getElementById("profile-email").textContent = currentUser.email;
    document.getElementById("profile-image").src = currentUser.image || "default-profile.png";
}


// Display user profile data
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profileImage = document.getElementById("profile-image");

profileName.textContent = currentUser.name;
profileEmail.textContent = currentUser.email;
profileImage.src = currentUser.image || "default-profile.png"; // Use default if no image

// Logout function with confirmation
document.getElementById("logout").addEventListener("click", () => {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("currentUser");
        window.location.href = "login page.html";
    }
});
