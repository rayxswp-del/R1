let rawData = [];

let current = {
  light: "",
  material: "",
  color: "",
  layout: ""
};

document.getElementById("fileInput").addEventListener("change", handleFile);

function handleFile(e) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  };

  reader.readAsArrayBuffer(e.target.files[0]);
}

// random column
function getRandom(col) {
  return rawData
    .map(r => r[col])
    .filter(v => v)
    [Math.floor(Math.random() * rawData.length)];
}

// generate
function generatePrompt() {

  current.light = getRandom(4);
  current.material = getRandom(5);
  current.color = getRandom(6);
  current.layout = getRandom(7);

  updateTags();
  renderMain();
  renderAlternatives();
}

// render main
function renderMain() {
  document.getElementById("output").textContent =
`Light and Atmosphere:
${current.light}

Material Palette:
${current.material}

Temperature and Color:
${current.color}

Layout and Human Presence:
${current.layout}`;
}

// alternatives
function renderAlternatives() {
  const container = document.getElementById("alternatives");
  container.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const layout = getRandom(7);

    const div = document.createElement("div");
    div.className = "alt-item";

    div.innerHTML = `
      ${layout}
      <br>
      <button onclick="copyText('${layout}')">Copy</button>
    `;

    container.appendChild(div);
  }
}

// replace
function replaceContent(type) {
  if (type === "light") current.light = getRandom(4);
  if (type === "material") current.material = getRandom(5);
  if (type === "color") current.color = getRandom(6);
  if (type === "layout") current.layout = getRandom(7);

  updateTags();
  renderMain();
}

// replace layout set
function replaceLayouts() {
  renderAlternatives();
}

// tags (UPDATED: G → J = column 9)
function updateTags() {
  const row = rawData.find(r => r[5] === current.material) || [];

  document.getElementById("tagB").textContent = row[1] || "-";
  document.getElementById("tagG").textContent = row[9] || "-";
  document.getElementById("tagI").textContent = row[8] || "-";
}

// copy main
function copyMain() {
  navigator.clipboard.writeText(document.getElementById("output").textContent);
}

// copy alt
function copyText(text) {
  navigator.clipboard.writeText(text);
}
