// Get table body
const tableBody = document.querySelector("#recruitmentTable tbody");

// Fixed stage options
const stageOptions = [
  "Pre Onboarding",
  "Requirements",
  "Awaiting Coding",
  "AL Intervention",
  "Closed"
];

// Fixed dataset
let boardData = [
  { Name: "Jeremiah Andai", Stage: "Pre Onboarding" },
  { Name: "Roberto Garcia Gomez", Stage: "Requirements" },
  { Name: "Leonel Bodestayne", Stage: "Awaiting Coding" }
];

// Function to render table rows
function renderTable() {
  tableBody.innerHTML = ""; // Clear previous data

  boardData.forEach((rowData, rowIndex) => {
    const tr = document.createElement("tr");

    // Name column (editable)
    const nameTd = document.createElement("td");
    nameTd.contentEditable = true;
    nameTd.textContent = rowData.Name;
    nameTd.addEventListener("input", () => {
      boardData[rowIndex].Name = nameTd.textContent;
    });
    tr.appendChild(nameTd);

    // Stage column (dropdown)
    const stageTd = document.createElement("td");
    const select = document.createElement("select");

    stageOptions.forEach(optionText => {
      const option = document.createElement("option");
      option.value = optionText;
      option.textContent = optionText;
      if (rowData.Stage === optionText) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      boardData[rowIndex].Stage = select.value;
    });

    stageTd.appendChild(select);
    tr.appendChild(stageTd);

    tableBody.appendChild(tr);
  });
}

// Initial render
renderTable();
