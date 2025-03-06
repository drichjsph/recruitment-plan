// Get table elements
const tableBody = document.querySelector("#recruitmentTable tbody");
const headerRow = document.querySelector("#headerRow");

// Buttons
const addRowBtn = document.getElementById("addRowBtn");
const addColumnBtn = document.getElementById("addColumnBtn");

// Default columns
let columns = ["Name", "Stage", "Owner"];

// Default stage options for dropdown
const stageOptions = [
  "Pre Onboarding",
  "Requirements",
  "Awaiting Coding",
  "AL Intervention",
  "Closed"
];

// Default board data
let boardData = [
  { Name: "Jeremiah Andai", Stage: "Pre Onboarding", Owner: "Alice" },
  { Name: "Roberto Garcia Gomez", Stage: "Requirements", Owner: "Bob" },
  { Name: "Leonel Bodestayne", Stage: "Requirements", Owner: "Carol" }
];

// -----------------
// Render Functions
// -----------------

// Function to render the table headers (now editable)
function renderHeader() {
  headerRow.innerHTML = "";
  columns.forEach((colName, index) => {
    const th = document.createElement("th");
    th.textContent = colName;
    th.contentEditable = true; // Make it editable

    th.addEventListener("blur", () => {
      columns[index] = th.textContent; // Update column name in array
      renderBody(); // Re-render body with new column names
    });

    headerRow.appendChild(th);
  });
}

// Function to render the table body
function renderBody() {
  tableBody.innerHTML = "";

  boardData.forEach((rowData, rowIndex) => {
    const tr = document.createElement("tr");

    columns.forEach(colName => {
      const td = document.createElement("td");

      // If "Stage", create a dropdown menu
      if (colName === "Stage") {
        const select = document.createElement("select");

        stageOptions.forEach(optionText => {
          const option = document.createElement("option");
          option.value = optionText;
          option.textContent = optionText;
          if (rowData[colName] === optionText) {
            option.selected = true;
          }
          select.appendChild(option);
        });

        select.addEventListener("change", () => {
          boardData[rowIndex][colName] = select.value;
        });

        td.appendChild(select);

      } else {
        // Otherwise, make an editable text cell
        td.contentEditable = true;
        td.textContent = rowData[colName] || "";

        td.addEventListener("input", () => {
          boardData[rowIndex][colName] = td.textContent;
        });
      }

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
}

// Initial render
renderHeader();
renderBody();

// -----------------
// Event Handlers
// -----------------

// Add a new row
addRowBtn.addEventListener("click", () => {
  const newRow = {};
  columns.forEach(colName => {
    newRow[colName] = colName === "Stage" ? stageOptions[0] : "";
  });

  boardData.push(newRow);
  renderBody();
});

// Add a new column
addColumnBtn.addEventListener("click", () => {
  const newColName = prompt("Enter new column name:");
  if (!newColName) return;

  columns.push(newColName);
  boardData.forEach(row => row[newColName] = "");
  
  renderHeader();
  renderBody();
});
