let baseData = [];

// Remove the file input listener and replace it with a fetch call
// document.getElementById("fileInput").addEventListener("change", handleFile);
document.getElementById("generateBtn").addEventListener("click", generatePrompt);

// 1. Fetch Data from your Backend Proxy
async function loadLarkData() {
  try {
    // This is the URL of your new backend server/function
    const response = await fetch("https://your-backend-url.com/api/get-base-data");
    const data = await response.json();
    
    // Assuming your backend sends an array of row objects
    baseData = data.items; 
    console.log("Lark Base Loaded:", baseData);
  } catch (error) {
    console.error("Error fetching Lark data:", error);
  }
}

// Call this as soon as the page loads
loadLarkData();

// 2. Random generator (Updated to use Field/Column Names instead of Indices)
function getRandomFromColumn(fieldName) {
  const values = baseData
    // Lark returns row data in a 'fields' object
    .map(row => row.fields[fieldName]) 
    .filter(v => v !== undefined && v !== null && v !== "");
    
  if (values.length === 0) return "N/A"; [cite: 6]

  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex]; [cite: 7]
}

// 3. Generate output
function generatePrompt() {
  if (baseData.length === 0) {
    alert("Still loading data from Lark, please wait...");
    return;
  }

  // Use your exact column names from Lark Base instead of indices 4, 5, 6, 7
  const light = getRandomFromColumn("Light Column Name");
  const material = getRandomFromColumn("Material Column Name");
  const color = getRandomFromColumn("Color Column Name");
  const layout = getRandomFromColumn("Layout Column Name");

  const result = `Light and Atmosphere:
${light}

Material Palette:
${material}

Temperature and Color:
${color}

Layout and Human Presence:
${layout}`;

  document.getElementById("output").textContent = result; [cite: 10]
}
