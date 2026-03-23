let rawData = [];

document.getElementById("fileInput").addEventListener("change", handleFile);
document.getElementById("generateBtn").addEventListener("click", generatePrompt);

// Load Excel
function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log("Loaded:", rawData);
  };

  reader.readAsArrayBuffer(file);
}

// Get random cell from column
function getRandomFromColumn(colIndex) {
  const values = rawData
    .map(row => row[colIndex])
    .filter(v => v !== undefined && v !== "");

  return values[Math.floor(Math.random() * values.length)];
}

// Get random row (for tag linking)
function getRandomRowWithMaterial() {
  const validRows = rawData.filter(row => row[5]); // column F (Material)
  return validRows[Math.floor(Math.random() * validRows.length)];
}

// Generate
function generatePrompt() {
  if (rawData.length === 0) {
    alert("Upload Excel first");
    return;
  }

  // 🔹 MAIN REQUIREMENT (independent random)
  const light = getRandomFromColumn(4);   // E
  const material = getRandomFromColumn(5); // F
  const color = getRandomFromColumn(6);   // G
  const layoutMain = getRandomFromColumn(7); // H

  // 🔹 EXTRA: 3 layout options
  const layouts = [];
  while (layouts.length < 3) {
    const l = getRandomFromColumn(7);
    if (!layouts.includes(l)) layouts.push(l);
  }

  // 🔹 FIND ROW MATCHING MATERIAL (for tags)
  let selectedRow = rawData.find(row => row[5] === material);

  if (!selectedRow) {
    selectedRow = getRandomRowWithMaterial();
  }

  const tagB = selectedRow[1] || "N/A";
  const tagI = selectedRow[9] || "N/A";
  const tagJ = selectedRow[10] || "N/A";

  // 🔹 OUTPUT FORMAT (STRICT)
  const result =
`Light and Atmosphere:
${light}

Material Palette:
${material}

Temperature and Color:
${color}

Layout and Human Presence:
${layoutMain}

--- Alternatives ---
1. ${layouts[0]}
2. ${layouts[1]}
3. ${layouts[2]}`;

  document.getElementById("output").textContent = result;

  // 🔹 UPDATE TAG UI
  document.getElementById("tagB").textContent = tagB;
  document.getElementById("tagI").textContent = tagI;
  document.getElementById("tagJ").textContent = tagJ;
}
