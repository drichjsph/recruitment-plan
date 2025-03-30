// pdfExport.js (Updated for Red Button, Week Label, and One Week Per Page)
document.addEventListener("DOMContentLoaded", () => {
    window.generatePDF = function (entry) {
        const doc = new jspdf.jsPDF();

        doc.setFontSize(14);
        doc.text(`Team Name: ${entry.agency}`, 10, 10);

        entry.weeks.forEach((weekData, index) => {
            if (index > 0) doc.addPage(); // Force new page per week

            doc.setFontSize(12);
            doc.text(`${weekData.week}`, 10, 20); // Only Week 2 instead of "Week: Week 2"

            doc.autoTable({
                head: [["Category", "Target", "Actual"]],
                body: weekData.data.map(row =>
                    row.header
                        ? [{ content: row.header, colSpan: 3, styles: { fontStyle: "bold" } }]
                        : [row.name, row.target || "", row.actual || ""]
                ),
                startY: 25,
                theme: "striped",
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 128, 185] },
                margin: { left: 10, right: 10 }
            });
        });

        doc.save(`Report_${entry.agency}.pdf`);
    };
});
