document.addEventListener("DOMContentLoaded", async function () {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("User not logged in");

        const response = await fetch('/api/screentime', {
            headers: { 'Authorization': `Bearer ${token}` }  // ✅ Corrected string interpolation
        });
        const data = await response.json();

        console.log("Fetched Screen Time Data:", data);  // ✅ Debugging step

        if (data.length > 0) {
            renderScreenTimeChart(data);
        } else {
            console.log("No screen time data available.");
        }
    } catch (error) {
        console.error("❌ Error fetching screen time data:", error);
    }
});

function renderScreenTimeChart(screenTimeData) {
    const ctx = document.getElementById('screenTimeChart').getContext('2d');

    // ✅ Extract dates & screen time values
    const labels = screenTimeData.map(entry => new Date(entry.date).toLocaleDateString());
    const values = screenTimeData.map(entry => entry.totalMinutes); // ✅ Ensure correct field

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Screen Time (minutes)',
                data: values,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
