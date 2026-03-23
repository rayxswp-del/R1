let structuredData = [];

document.getElementById("fileInput").addEventListener("change", handleFile);
document.getElementById("generateBtn").addEventListener("click", generatePrompt);

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    structuredData = rows.map(row => ({
      light: row[4],
      material: row[5],
      color: row[6],
      layout: row[7],
      tags: {
        B: row[1],
        G: row[6],
        I: row[8]
      }
    })).filter(r => r.material); // remove empty rows

    console.log(structuredData);
  };

  reader.readAsArrayBuffer(file);
}

// random item
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePrompt() {
  if (structuredData.length === 0) {
    alert("Upload Excel first");
    return;
  }

  // pick one full row
  const main = getRandomItem(structuredData);

  // pick 3 layout options (different rows)
  const layouts = [];
  while (layouts.length < 3) {
    const item = getRandomItem(structuredData);
    if (!layouts.includes(item.layout)) {
      layouts.push(item.layout);
    }
  }

  // output text
  const result =
`Light and Atmosphere:
${main.light}

Material Palette:
${main.material}

Temperature and Color:
${main.color}

Layout and Human Presence:
1. ${layouts[0]}
2. ${layouts[1]}
3. ${layouts[2]}`;

  document.getElementById("output").textContent = result;

  // render tags
  renderTags(main.tags);
}

function renderTags(tags) {
  document.getElementById("tagB").textContent = tags.B || "N/A";
  document.getElementById("tagG").textContent = tags.G || "N/A";
  document.getElementById("tagI").textContent = tags.I || "N/A";
}
