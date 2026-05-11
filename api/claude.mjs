export default async function handler(req, res) {
res.setHeader(“Access-Control-Allow-Origin”, “*”);
res.setHeader(“Access-Control-Allow-Methods”, “POST, OPTIONS”);
res.setHeader(“Access-Control-Allow-Headers”, “Content-Type”);

if (req.method === “OPTIONS”) {
return res.status(200).end();
}

if (req.method !== “POST”) {
return res.status(405).json({ error: “Method not allowed” });
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
return res.status(500).json({ error: “ANTHROPIC_API_KEY not set” });
}

const bodyStr = JSON.stringify(req.body);

const response = await fetch(“https://api.evolink.ai/v1/messages”, {
method: “POST”,
headers: {
“Content-Type”: “application/json”,
“Authorization”: “Bearer “ + apiKey,
“anthropic-version”: “2023-06-01”,
},
body: bodyStr,
});

const text = await response.text();

let data;
try {
data = JSON.parse(text);
} catch (e) {
return res.status(500).json({ error: “Bad response: “ + text.slice(0, 300) });
}

return res.status(response.status).json(data);
}

export const config = {
api: {
bodyParser: {
sizeLimit: “10mb”,
},
},
};
