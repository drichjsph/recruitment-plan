// Get elements
const tableBody = document.getElementById("tableBody");
const agencySelector = document.getElementById("agencySelector");
const weekSelector = document.getElementById("weekSelector");
const generatePDFButton = document.getElementById("generatePDF");

// Ensure jsPDF is available
const jsPDF = window.jspdf.jsPDF;

// Default agencies and weeks
const agencies = ["Agency 1", "Agency 2", "Agency 3", "Agency 4"];
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

// Default data structure
const defaultData = [
  { name: "ANP", target: "", actual: "" },
  { name: "Active AP", target: "", actual: "" },
  { name: "Cases", target: "", actual: "" },
  { name: "Coded QR", target: "", actual: "" },

  { header: "RECRUITMENT" },
  { name: "Agency Partner Prospects", target: "", actual: "" },
  { name: "No. of AP for Review", target: "", actual: "" },
  { name: "No. of Exam Attendees", target: "", actual: "" },
  { name: "No. of AP Interviews (by AL)", target: "", actual: "" },

  { header: "ACTIVATION" },
  { name: "Submitting Intermediaries", target: "", actual: "" },
  { name: "New Applications Submitted", target: "", actual: "" },
  { name: "No. of APs with JFW", target: "", actual: "" },
  { name: "No. of VUL Applications", target: "", actual: "" },
  { name: "No. of Trad Applications", target: "", actual: "" }
];

// **Ensure Local Storage is Initialized**
function initializeData() {
  let storedData = JSON.parse(localStorage.getItem("agencyData")) || {};

  agencies.forEach(agency => {
    if (!storedData[agency]) {
      storedData[agency] = {};
    }
    
    weeks.forEach(week => {
      if (!storedData[agency][week]) {
        storedData[agency][week] = JSON.parse(JSON.stringify(defaultData));
      }
    });
  });

  localStorage.setItem("agencyData", JSON.stringify(storedData));
}

// **Load Table for Selected Agency & Week**
function loadTable() {
  const agency = agencySelector.value;
  const week = weekSelector.value;

  tableBody.innerHTML = ""; // Clear table
  initializeData(); // Ensure data exists

  let storedData = JSON.parse(localStorage.getItem("agencyData"));

  let selectedData = storedData[agency][week] || JSON.parse(JSON.stringify(defaultData));

  selectedData.forEach((row, index) => {
    const tr = document.createElement("tr");

    if (row.header) {
      const headerTd = document.createElement("th");
      headerTd.textContent = row.header;
      headerTd.colSpan = 3;
      headerTd.classList.add("section-header");
      tr.appendChild(headerTd);
    } else {
      const nameTd = document.createElement("td");
      nameTd.textContent = row.name;
      tr.appendChild(nameTd);

      const targetTd = document.createElement("td");
      const targetInput = document.createElement("input");
      targetInput.type = "number";
      targetInput.value = row.target || "";
      targetInput.dataset.index = index;
      targetInput.dataset.type = "target";
      targetInput.addEventListener("input", saveData);
      targetTd.appendChild(targetInput);
      tr.appendChild(targetTd);

      const actualTd = document.createElement("td");
      const actualInput = document.createElement("input");
      actualInput.type = "number";
      actualInput.value = row.actual || "";
      actualInput.dataset.index = index;
      actualInput.dataset.type = "actual";
      actualInput.addEventListener("input", saveData);
      actualTd.appendChild(actualInput);
      tr.appendChild(actualTd);
    }

    tableBody.appendChild(tr);
  });
}

// **Save Data Correctly**
function saveData(event) {
  const agency = agencySelector.value;
  const week = weekSelector.value;

  let storedData = JSON.parse(localStorage.getItem("agencyData")) || {};

  // Ensure agency and week data exists
  if (!storedData[agency]) storedData[agency] = {};
  if (!storedData[agency][week]) storedData[agency][week] = JSON.parse(JSON.stringify(defaultData));

  const index = event.target.dataset.index;
  const type = event.target.dataset.type;

  // Update stored data
  storedData[agency][week][index][type] = event.target.value || "";

  // Save updated data back to Local Storage
  localStorage.setItem("agencyData", JSON.stringify(storedData));
}

// **Event Listeners**
agencySelector.addEventListener("change", loadTable);
weekSelector.addEventListener("change", loadTable);

// **Initialize Data & Load First Table**
initializeData();
loadTable();

generatePDFButton.addEventListener("click", () => {
  const doc = new jsPDF();
  const selectedWeek = weekSelector.value;
  let storedData = JSON.parse(localStorage.getItem("agencyData")) || {};

  let yPos = 10; // Start position for the first entry
  let pageHeight = doc.internal.pageSize.height; // Get PDF page height
  let padding = 15; // Space after each table

  agencies.forEach((agency, index) => {
      if (!storedData[agency] || !storedData[agency][selectedWeek]) return;

      let selectedWeekData = storedData[agency][selectedWeek];

      // Ensure we don't start a new page unless necessary
      let willFit = yPos + (selectedWeekData.length * 8) + padding <= pageHeight;

      if (!willFit) {
          doc.addPage();
          yPos = 10;
      }

      // Add Team Name title
      doc.setFontSize(14);
      doc.text(`Team Name: ${agency} - ${selectedWeek}`, 10, yPos);
      yPos += 8;

      // Generate Table
      doc.autoTable({
          head: [["Category", "Target", "Actual"]],
          body: selectedWeekData.map(row =>
              row.header
                  ? [{ content: row.header, colSpan: 3, styles: { fontStyle: "bold" } }]
                  : [row.name, row.target || "", row.actual || ""]
          ),
          startY: yPos,
          theme: "striped",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 10, right: 10 },
          didDrawPage: function (data) {
              yPos = data.cursor.y + padding; // Move down for next agency
          },
      });

      // Ensure correct spacing for the next agency
      yPos += padding;
  });

  doc.save(`Agency_Report_${selectedWeek}.pdf`);
});
