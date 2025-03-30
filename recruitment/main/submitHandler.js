document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("generateExcel").addEventListener("click", saveSubmission);
});

// Save Submission Function
function saveSubmission() {
    console.log("✅ Submit button clicked!");

    const selectedAgency = document.getElementById("agencySelector").value;
    let storedData = JSON.parse(localStorage.getItem("agencyData")) || {};

    if (!storedData[selectedAgency]) {
        alert("No data available for the selected agency.");
        return;
    }

    // Prepare the submission history array
    const submissionHistory = JSON.parse(localStorage.getItem("submissionHistory")) || [];

    const allWeeksData = [];

    // Collect all week data for the selected agency
    Object.keys(storedData[selectedAgency]).forEach(week => {
        const weekData = storedData[selectedAgency][week];
        const copiedData = weekData.map(item => ({ ...item }));

        allWeeksData.push({
            week,
            data: copiedData
        });
    });

    // Append the new submission
    submissionHistory.push({
        agency: selectedAgency,
        submittedAt: new Date().toISOString(),
        weeks: allWeeksData
    });

    // Save it back to localStorage
    localStorage.setItem("submissionHistory", JSON.stringify(submissionHistory));

    // ✅ Notify user
    alert("✅ Successfully saved in the logs!");
    console.log("✅ Submission history saved:", submissionHistory);
}
