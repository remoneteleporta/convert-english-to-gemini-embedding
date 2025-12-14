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

      let embedding = data.embedding.values
      const dbUrl = process.env.SUPABASE_URL

      await fetch(`${dbUrl}/rest/v1/vectordoc`, {
      method: "POST",
     headers: {
        apikey: process.env.SUPABASE_API_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        content: text,
        embedding: embedding
      })
    });
    } else {
      output.textContent = "API error:\n" + JSON.stringify(data, null, 2);
    }
  } catch (err) {
    output.textContent = "Network error: " + err;
  }
}