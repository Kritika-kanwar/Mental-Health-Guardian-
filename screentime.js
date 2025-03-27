const fs = require('fs');
const path = require('path');

// ✅ Path to sample_data.json
const filePath = path.join(__dirname, '..', 'data', 'sample_data.json');

// ✅ Function to fetch screen time data for a specific user
function getScreenTimeData(email) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`❌ Error reading file: ${err.message}`);
                return reject('Error reading sample_data.json file');
            }
            try {
                const users = JSON.parse(data);
                const user = users.find(user => user.email === email);
                
                if (!user) {
                    return reject('User not found');
                }

                resolve(user.screenTimeData || []); // ✅ Return only screen time data
            } catch (parseError) {
                console.error(`❌ Error parsing file: ${parseError.message}`);
                reject('Error parsing sample_data.json data');
            }
        });
    });
}

module.exports = { getScreenTimeData }; // ✅ Correct Export
