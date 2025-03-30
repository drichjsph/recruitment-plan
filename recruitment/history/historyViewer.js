// Load and display the submission history
document.addEventListener("DOMContentLoaded", function() {
    const historyTable = document.getElementById("historyTable");
    const submissionHistory = JSON.parse(localStorage.getItem("submissionHistory")) || [];

    if (submissionHistory.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `<td colspan="3" style="text-align:center;">No submission history available.</td>`;
        historyTable.appendChild(emptyRow);
        return;
    }

    submissionHistory.forEach((entry, index) => {
        const tr = document.createElement("tr");

        // Agency Column
        const agencyTd = document.createElement("td");
        agencyTd.textContent = entry.agency;
        tr.appendChild(agencyTd);

        // Date Submitted Column
        const dateTd = document.createElement("td");
        dateTd.textContent = new Date(entry.submittedAt).toLocaleString();
        tr.appendChild(dateTd);

        // PDF Button Column
        const pdfTd = document.createElement("td");
        const pdfButton = document.createElement("button");
        pdfButton.textContent = "PDF";
        pdfButton.className = "pdf-button";
        pdfButton.addEventListener("click", () => generatePDF(entry));
        pdfTd.appendChild(pdfButton);
        tr.appendChild(pdfTd);

        historyTable.appendChild(tr);
    });
});
