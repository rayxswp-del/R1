let baseData = [];

document.getElementById("generateBtn").addEventListener("click", generatePrompt);

// 1. Fetch from your Vercel API
async function loadLarkData() {
  try {
    // This calls the file in your /api folder
    const response = await fetch("/api/get-lark-data");
    baseData = await response.json();
    console.log("Lark Data Loaded");
  } catch (error) {
    console.error("Connection to Lark failed");
  }
}

loadLarkData();

function getRandomFromColumn(fieldName) {
  const values = baseData
    .map(row => row.fields[fieldName]) 
    .filter(v => v !== undefined && v !== null && v !== "");
    
  if (values.length === 0) return "N/A";
  return values[Math.floor(Math.random() * values.length)];
}

function generatePrompt() {
  if (baseData.length === 0) return alert("Loading data...");

  // REPLACE THESE: Match your Lark Column names exactly!
  const light = getRandomFromColumn("Light"); 
  const material = getRandomFromColumn("Material");
  const color = getRandomFromColumn("Color");
  const layout = getRandomFromColumn("Layout");

  const result = `Light and Atmosphere: ${light}\n\nMaterial: ${material}\n\nColor: ${color}\n\nLayout: ${layout}`;
  document.getElementById("output").textContent = result;
}
