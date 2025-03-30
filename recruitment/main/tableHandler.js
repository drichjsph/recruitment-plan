// Get elements
const tableBody = document.getElementById("tableBody");
const agencySelector = document.getElementById("agencySelector");
const weekSelector = document.getElementById("weekSelector");

// Default agencies and weeks
const agencies = ["Agency 1", "Agency 2", "Agency 3", "Agency 4"];
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];

// Default table structure
const defaultData = [
  { name: "ANP", target: "", actual: "" },
  { name: "Active AP", target: "", actual: "" },
  { name: "Cases", target: "", actual: "" },
  { name: "Coded QR", target: "", actual: "" },
  { header: "RECRUITMENT" },
  { name: "Agency Partner Prospects", target: "", actual: "" },
  { name: "No. of AP for Review", target: "", actual: "" },
  { name: "No. of Exam Attendees", target: "", actual: "" },
  { name: "No. of AP Interviews (AL)", target: "", actual: "" },
  { header: "ACTIVATION" },
  { name: "Submitting Intermediaries", target: "", actual: "" },
  { name: "New Applications Submitted", target: "", actual: "" },
  { name: "No. of APs with JFW", target: "", actual: "" },
  { name: "No. of VUL Applications", target: "", actual: "" },
  { name: "No. of Trad Applications", target: "", actual: "" }
];

// **Ensure Local Storage is Initialized for all agencies & weeks**
function initializeData() {
    let storedData = JSON.parse(localStorage.getItem("agencyData")) || {};

    let needsUpdate = false;

    agencies.forEach(agency => {
        if (!storedData[agency]) {
            storedData[agency] = {};
        }

        weeks.forEach(week => {
            if (!storedData[agency][week]) {
                storedData[agency][week] = JSON.parse(JSON.stringify(defaultData));
                needsUpdate = true;
            }
        });
    });

    if (needsUpdate) {
        localStorage.setItem("agencyData", JSON.stringify(storedData));
    }
}

// **Load Table for Selected Agency & Week**
function loadTable() {
    const agency = agencySelector.value;
    const week = weekSelector.value;

    tableBody.innerHTML = "";
    initializeData();

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

// **Save Data Correctly for the Specific Agency & Week**
function saveData(event) {
    const agency = agencySelector.value;
    const week = weekSelector.value;

    let storedData = JSON.parse(localStorage.getItem("agencyData")) || {};

    if (!storedData[agency]) storedData[agency] = {};
    if (!storedData[agency][week]) storedData[agency][week] = JSON.parse(JSON.stringify(defaultData));

    const index = event.target.dataset.index;
    const type = event.target.dataset.type;

    storedData[agency][week][index][type] = event.target.value || "";

    localStorage.setItem("agencyData", JSON.stringify(storedData));
}

// **Event Listeners**
agencySelector.addEventListener("change", loadTable);
weekSelector.addEventListener("change", loadTable);

// **Initialize Data & Load First Table**
initializeData();
loadTable();
