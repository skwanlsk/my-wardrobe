const handler = async function(req, res) {
res.setHeader(“Access-Control-Allow-Origin”, “*”);
res.setHeader(“Access-Control-Allow-Methods”, “POST, OPTIONS”);
res.setHeader(“Access-Control-Allow-Headers”, “Content-Type”);

if (req.method === “OPTIONS”) {
res.status(200).end();
return;
}

if (req.method !== “POST”) {
res.status(405).json({ error: “Method not allowed” });
return;
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
res.status(500).json({ error: “ANTHROPIC_API_KEY not set” });
return;
}

const response = await fetch(“https://api.evolink.ai/v1/messages”, {
method: “POST”,
headers: {
“Content-Type”: “application/json”,
“Authorization”: “Bearer “ + apiKey,
“anthropic-version”: “2023-06-01”,
},
body: JSON.stringify(req.body),
});

const text = await response.text();

let data;
try {
data = JSON.parse(text);
} catch (e) {
res.status(500).json({ error: “Bad upstream response: “ + text.slice(0, 200) });
return;
}

res.status(response.status).json(data);
};

handler.config = {
api: {
bodyParser: {
sizeLimit: “10mb”,
},
},
};

module.exports = handler;
