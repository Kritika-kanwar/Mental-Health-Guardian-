let moodChart = null; // ✅ Store chart instance to prevent duplicates

async function fetchMoodDataForChart() {
    try {
        console.log("📡 Fetching mood data...");

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found. Please log in.");
            return;
        }

        const response = await fetch("http://localhost:8085/api/mood", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("📡 Fetch Response Status:", response.status);

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`Failed to fetch mood data: ${response.status} - ${errorMsg}`);
        }

        const moodData = await response.json();
        console.log("✅ Mood Data for Chart:", moodData);

        if (!Array.isArray(moodData) || moodData.length === 0) {
            console.warn("⚠ No mood data found.");
            return;
        }

        // ✅ Extract Dates and Mood Values
        const labels = moodData.map(entry => entry.date);
        const moodValues = moodData.map(entry => {
            switch (entry.mood.toLowerCase()) {
                case "happy": return 5;
                case "excited": return 4;
                case "neutral": return 3;
                case "relaxed": return 3;
                case "tired": return 2;
                case "stressed": return 1;
                default: return 0;
            }
        });

        console.log("📊 Chart Labels:", labels);
        console.log("📊 Chart Data:", moodValues);

        // ✅ Create or Update Line Chart
        createMoodChart(labels, moodValues);

    } catch (error) {
        console.error("❌ Error fetching mood data:", error.message);
    }
}

// ✅ Function to Create or Update Line Chart for Mood Tracking
function createMoodChart(labels, dataValues) {
    const ctx = document.getElementById("moodChart").getContext("2d");

    console.log("📊 Creating Mood Line Chart...");

    // ✅ Destroy previous chart instance if it exists
    if (moodChart !== null) {
        moodChart.destroy();
    }

    moodChart = new Chart(ctx, {
        type: "line", // ✅ Line Chart
        data: {
            labels: labels, 
            datasets: [{
                label: "Mood Over Time",
                data: dataValues, 
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                tension: 0.4, // ✅ Smooth line
                pointBackgroundColor: "rgba(255, 99, 132, 1)",
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const moodMap = {
                                5: "Happy",
                                4: "Excited",
                                3: "Neutral/Relaxed",
                                2: "Tired",
                                1: "Stressed",
                                0: "Unknown"
                            };
                            return moodMap[value];
                        }
                    }
                }
            }
        }
    });

    console.log("✅ Mood Line Chart Created Successfully!");
}

// ✅ Call function when page loads
document.addEventListener("DOMContentLoaded", fetchMoodDataForChart);

let screenTimeChart = null; // ✅ Store chart instance to prevent duplicates

async function fetchScreenTimeForChart() {
    try {
        console.log("📡 Fetching screen time data...");

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found. Please log in.");
            return;
        }

        const response = await fetch("http://localhost:8086/api/screentime", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // ✅ Fixed Syntax
                "Content-Type": "application/json"
            }
        });

        console.log("📡 Fetch Response Status:", response.status);

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`Failed to fetch screen time data: ${response.status} - ${errorMsg}`);
        }

        const screenTimeData = await response.json();
        console.log("✅ Screen Time Data for Chart:", screenTimeData);

        if (!Array.isArray(screenTimeData) || screenTimeData.length === 0) {
            console.warn("⚠ No screen time data found.");
            return;
        }

        // ✅ Extract Dates and Screen Time Values
        const labels = screenTimeData.map(entry => entry.date);
        const screenTimeValues = screenTimeData.map(entry => entry.totalMinutes);

        console.log("📊 Chart Labels:", labels);
        console.log("📊 Chart Data:", screenTimeValues);

        // ✅ Ensure Canvas Exists Before Creating Chart
        const canvas = document.getElementById("screenTimeChart");
        if (!canvas) {
            console.error("❌ Chart canvas not found!");
            return;
        }

        // ✅ Create or Update Chart
        createScreenTimeChart(labels, screenTimeValues);
        
    } catch (error) {
        console.error("❌ Error fetching screen time data:", error.message);
    }
}

// ✅ Function to Create or Update Chart (Now Defined Outside)
function createScreenTimeChart(labels, dataValues) {
    const ctx = document.getElementById("screenTimeChart").getContext("2d");

    console.log("📊 Creating Chart...");

    // ✅ Destroy previous chart instance if it exists
    if (screenTimeChart !== null) {
        screenTimeChart.destroy();
    }

    screenTimeChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels, 
            datasets: [{
                label: "Screen Time (minutes)",
                data: dataValues, 
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    console.log("✅ Chart Created Successfully!");
}

// ✅ Call function when page loads
document.addEventListener("DOMContentLoaded", fetchScreenTimeForChart);