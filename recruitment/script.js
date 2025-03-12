// Get elements
const tableBody = document.getElementById("tableBody");
const agencySelector = document.getElementById("agencySelector");
const generatePDFButton = document.getElementById("generatePDF");

// Ensure jsPDF is available
const jsPDF = window.jspdf.jsPDF;

// Default agency names
const agencies = ["Agency 1", "Agency 2", "Agency 3", "Agency 4"];

// Default data structure for all agencies
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

// Function to ensure every agency is initialized in localStorage
function initializeAgencies() {
  agencies.forEach(agency => {
    if (!localStorage.getItem(agency)) {
      localStorage.setItem(agency, JSON.stringify(defaultData));
    } else {
      // Ensure all data is properly structured (fix missing fields)
      let agencyData = JSON.parse(localStorage.getItem(agency));
      if (agencyData.length !== defaultData.length) {
        localStorage.setItem(agency, JSON.stringify(defaultData));
      }
    }
  });
}

// Populate dropdown dynamically
function populateDropdown() {
  agencySelector.innerHTML = ""; // Clear existing options
  agencies.forEach(agency => {
    const option = document.createElement("option");
    option.value = agency;
    option.textContent = agency;
    agencySelector.appendChild(option);
  });
}

// Load table for selected agency
function loadTable(agency) {
  tableBody.innerHTML = ""; // Clear the existing table

  // Ensure agency data exists in Local Storage
  initializeAgencies();

  let agencyData = JSON.parse(localStorage.getItem(agency));

  // Ensure no undefined values remain (keep blank fields as empty strings)
  agencyData = agencyData.map(row => ({
    name: row.name || "",
    target: row.target || "",
    actual: row.actual || "",
    header: row.header || null
  }));

  // Set the first column header to the agency name
  document.querySelector("#performanceTable thead tr th").textContent = agency;

  agencyData.forEach((row, index) => {
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
      targetInput.value = row.target || ""; // Keep blank instead of "0"
      targetInput.dataset.index = index;
      targetInput.dataset.type = "target";
      targetInput.addEventListener("input", saveData);
      targetTd.appendChild(targetInput);
      tr.appendChild(targetTd);

      const actualTd = document.createElement("td");
      const actualInput = document.createElement("input");
      actualInput.type = "number";
      actualInput.value = row.actual || ""; // Keep blank instead of "0"
      actualInput.dataset.index = index;
      actualInput.dataset.type = "actual";
      actualInput.addEventListener("input", saveData);
      actualTd.appendChild(actualInput);
      tr.appendChild(actualTd);
    }

    tableBody.appendChild(tr);
  });

  // Save cleaned data back to Local Storage to prevent future blank spaces
  localStorage.setItem(agency, JSON.stringify(agencyData));

  // Update the dropdown to match the selected agency
  agencySelector.value = agency;
}

// Save data when input changes
function saveData(event) {
  const agency = agencySelector.value;
  let agencyData = JSON.parse(localStorage.getItem(agency)) || defaultData;

  const index = event.target.dataset.index;
  const type = event.target.dataset.type;

  agencyData[index][type] = event.target.value || ""; // Store blank instead of "0"
  localStorage.setItem(agency, JSON.stringify(agencyData));
}

// Event listener for agency selection
agencySelector.addEventListener("change", () => {
  loadTable(agencySelector.value);
});

// Initialize the dropdown and table
initializeAgencies();
populateDropdown();
loadTable(agencySelector.value);

// Generate PDF
generatePDFButton.addEventListener("click", () => {
  const doc = new jsPDF();

  agencies.forEach((agency) => {
    let agencyData = JSON.parse(localStorage.getItem(agency)) || defaultData;

    // Ensure agency name is at the top of the table
    doc.setFontSize(14);
    doc.text(`Team Name: ${agency}`, 10, doc.autoTable.previous ? doc.autoTable.previous.finalY + 15 : 10);
    
    doc.autoTable({
      head: [["Category", "Target", "Actual"]],
      body: agencyData.map(row => 
        row.header 
        ? [{ content: row.header, colSpan: 3, styles: { fontStyle: "bold" } }] 
        : [row.name, row.target || "", row.actual || ""]
      ),
      startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 20 : 20
    });
  });

  doc.save("Agency_Report.pdf");
});
