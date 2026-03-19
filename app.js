let excelData = [];

document.getElementById("fileInput").addEventListener("change", handleFile);
document.getElementById("generateBtn").addEventListener("click", generatePrompt);

// 1. Read Excel
function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to array
    excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    console.log("Excel Loaded:", excelData);
  };

  reader.readAsArrayBuffer(file);
}

// 2. Random generator
function getRandomFromColumn(colIndex) {
  const values = excelData
    .map(row => row[colIndex])
    .filter(v => v !== undefined && v !== "");

  if (values.length === 0) return "N/A";

  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

// 3. Generate output
function generatePrompt() {
  if (excelData.length === 0) {
    alert("Please upload Excel first");
    return;
  }

  // Column index (E=4, F=5, G=6, H=7)
  const light = getRandomFromColumn(4);
  const material = getRandomFromColumn(5);
  const color = getRandomFromColumn(6);
  const layout = getRandomFromColumn(7);

  const result = 
`Light and Atmosphere:
${light}

Material Palette:
${material}

Temperature and Color:
${color}

Layout and Human Presence:
${layout}`;

  document.getElementById("output").textContent = result;
}
