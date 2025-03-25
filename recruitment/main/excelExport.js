// Ensure SheetJS is available
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("generateExcel").addEventListener("click", generateExcel);
});

function generateExcel() {
    console.log("Generate Excel button clicked!");  // Debug

    const selectedAgency = document.getElementById("agencySelector").value;
    let storedData = JSON.parse(localStorage.getItem("agencyData")) || {};

    if (!storedData[selectedAgency]) {
        alert("No data available for the selected agency.");
        return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheetData = [];

    // Target Section
    worksheetData.push(["Target"]);
    worksheetData.push(["Agency Name", "Week", "ANP", "ACTIVE AP", "CASES", "CODED QR",
        "Agency Partner Prospects", "No. of AP for Review", "No. of Exam Attendees", "No. of AP Interviews (AL)",
        "Submitting Intermediaries", "New Applications Submitted", "No. of APs with JFW", "No. of VUL Applications", "No. of Trad Applications"]);

    Object.keys(storedData[selectedAgency]).forEach(week => {
        const weekData = storedData[selectedAgency][week];
        const targetRow = [selectedAgency, week];
        weekData.forEach(row => {
            if (row.name) {
                targetRow.push(row.target || "");
            }
        });
        worksheetData.push(targetRow);
    });

    worksheetData.push([]);

    // Actual Section
    worksheetData.push(["Actual"]);
    worksheetData.push(["Agency Name", "Week", "ANP", "ACTIVE AP", "CASES", "CODED QR",
        "Agency Partner Prospects", "No. of AP for Review", "No. of Exam Attendees", "No. of AP Interviews (AL)",
        "Submitting Intermediaries", "New Applications Submitted", "No. of APs with JFW", "No. of VUL Applications", "No. of Trad Applications"]);

    Object.keys(storedData[selectedAgency]).forEach(week => {
        const weekData = storedData[selectedAgency][week];
        const actualRow = [selectedAgency, week];
        weekData.forEach(row => {
            if (row.name) {
                actualRow.push(row.actual || "");
            }
        });
        worksheetData.push(actualRow);
    });

// ✅ Group all weeks into a single submission
const submissionHistory = JSON.parse(localStorage.getItem("submissionHistory")) || [];

const allWeeksData = [];

Object.keys(storedData[selectedAgency]).forEach(week => {
    const weekData = storedData[selectedAgency][week];
    const copiedData = weekData.map(item => ({ ...item }));

    allWeeksData.push({
        week,
        data: copiedData
    });
});

submissionHistory.push({
    agency: selectedAgency,
    submittedAt: new Date().toISOString(),
    weeks: allWeeksData
});

localStorage.setItem("submissionHistory", JSON.stringify(submissionHistory));
console.log("✅ Submission history saved:", submissionHistory);

}


