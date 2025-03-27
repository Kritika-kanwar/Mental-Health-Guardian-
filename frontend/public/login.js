async function handleLogin(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("❌ Please enter both email and password.");
        return;
    }

    try {
        console.log("🔄 Sending login request...");

        const response = await fetch("http://localhost:8085/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json(); // Parse response JSON

        if (response.ok) {
            console.log("✅ Login Successful:", data);

            // ✅ Clear localStorage before saving new user data
            localStorage.clear();

            // ✅ Store token in localStorage
            localStorage.setItem("token", data.token);

            // ✅ Redirect to homepage
            window.location.href = "home page 2.html";
        } else {
            console.error("❌ Login Failed:", data.message || "Invalid credentials.");
            alert(`❌ ${data.message || "Invalid login credentials."}`);
        }
    } catch (error) {
        console.error("❌ Error during login:", error);
        alert("Something went wrong. Please check your internet connection and try again.");
    }
}