document.getElementById("get-embedding").addEventListener("click", () =>{
async function generateEmbedding() {
  const dirty = document.getElementById("textInput").value;
  const text = DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  const output = document.getElementById("output");

  if (!text.trim()) {
    output.textContent = "Please enter text.";
    return;
  }

  output.textContent = "Generating embedding...";

  try {
    const res = await fetch("/.netlify/functions/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    if (data.embedding?.values) {
      output.textContent = JSON.stringify(data.embedding.values, null, 2);
    } else {
      output.textContent = "API error:\n" + JSON.stringify(data, null, 2);
    }
  } catch (err) {
    output.textContent = "Network error: " + err;
  }
}})