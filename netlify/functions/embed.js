export async function handler(event) {
  const { text } = JSON.parse(event.body || "{}");
  const apiKey = process.env.GEMINI_API_KEY;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=" +
    apiKey;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: {
          parts: [
            { text: text }
          ]
        }
      })
    });

    const data = await response.json();
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

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() })
    };
  }
}
