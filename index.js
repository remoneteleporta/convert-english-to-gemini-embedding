async function getEmbedding() {
    const dirtyText = document.getElementById("textInput").value;
    const output = document.getElementById("output");

    const text = DOMPurify.sanitize(dirtyText, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    if (!text) {
        output.textContent = "Error: Please enter some text to embed.";
        return;
    }

    output.textContent = "Generating embedding...";
    const apiKey = process.env.GEMINI_API_KEY;

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedText?key=" +
      apiKey;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (data.embedding && data.embedding.values) {
            output.textContent = JSON.stringify(data.embedding.values, null, 2);
        } else {
            output.textContent = "API Error:\n" + JSON.stringify(data, null, 2);
        }

    } catch (err) {
        output.textContent = "Fetch Error: " + err;
    }
}