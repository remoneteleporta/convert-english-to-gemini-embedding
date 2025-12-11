// netlify/functions/embed.js
export async function handler(event) {
  const { text } = JSON.parse(event.body || "{}");
  const apiKey = process.env.GEMINI_API_KEY;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=" +
    apiKey;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

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
