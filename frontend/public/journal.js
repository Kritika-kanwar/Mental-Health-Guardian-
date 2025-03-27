journal.js

// Function to save a journal entry
function saveJournalEntry(date, entry) {
    const journal = JSON.parse(localStorage.getItem('journal')) || [];
    journal.push({ date, entry });
    localStorage.setItem('journal', JSON.stringify(journal));
    console.log('Journal entry saved!');
}

// Function to retrieve and display journal entries
function displayJournalEntries() {
    const journal = JSON.parse(localStorage.getItem('journal')) || [];
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = ''; // Clear the list before displaying

    journal.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${entry.date}:</strong> ${entry.entry}`;
        entriesList.appendChild(listItem);
    });
}

// Event listener for the journal form submission
document.getElementById('journalForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    const date = document.getElementById('journalDate').value;
    const entry = document.getElementById('journalEntry').value;

    // Save the journal entry
    saveJournalEntry(date, entry);

    // Display updated journal entries
    displayJournalEntries();

    // Clear the form
    document.getElementById('journalForm').reset();
});

// Display journal entries when the page loads
window.onload = displayJournalEntries;