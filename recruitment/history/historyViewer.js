document.addEventListener("DOMContentLoaded", () => {
    const historyBody = document.getElementById("historyBody");
    const historyData = JSON.parse(localStorage.getItem("submissionHistory")) || [];

    historyData.forEach(entry => {
        const tr = document.createElement("tr");

        // Agency name
        const agencyTd = document.createElement("td");
        agencyTd.textContent = entry.agency;
        tr.appendChild(agencyTd);

        // Weeks grouped together
        const weeksTd = document.createElement("td");
        const weekList = entry.weeks.map(w => w.week).join(", ");
        weeksTd.textContent = weekList;
        tr.appendChild(weeksTd);

        // Submitted timestamp
        const dateTd = document.createElement("td");
        const date = new Date(entry.submittedAt);
        dateTd.textContent = date.toLocaleString();
        tr.appendChild(dateTd);

        // View button
        const viewTd = document.createElement("td");
        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.classList.add("view-button");

        viewButton.addEventListener("click", () => {
            let message = `📋 ${entry.agency} - Submitted on ${date.toLocaleString()}\n\n`;

            entry.weeks.forEach(weekData => {
                message += `📅 ${weekData.week}\n`;
                weekData.data.forEach(row => {
                    if (row.name) {
                        message += `- ${row.name}: Target = ${row.target || "0"}, Actual = ${row.actual || "0"}\n`;
                    }
                });
                message += `\n`;
            });

            alert(message);
        });

        viewTd.appendChild(viewButton);
        tr.appendChild(viewTd);

        historyBody.appendChild(tr);
    });
});
