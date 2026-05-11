module.exports = async (req, res) => {
res.setHeader(“Access-Control-Allow-Origin”, “*”);
res.setHeader(“Access-Control-Allow-Methods”, “POST, OPTIONS”);
res.setHeader(“Access-Control-Allow-Headers”, “Content-Type”);
if (req.method === “OPTIONS”) { res.status(200).end(); return; }
if (req.method !== “POST”) { res.status(405).end(); return; }
const key = process.env.ANTHROPIC_API_KEY;
if (!key) { res.status(500).json({ error: “no key” }); return; }
try {
const r = await fetch(“https://api.evolink.ai/v1/messages”, {
method: “POST”,
headers: { “Content-Type”: “application/json”, “Authorization”: “Bearer “ + key, “anthropic-version”: “2023-06-01” },
body: JSON.stringify(req.body)
});
const d = await r.json();
res.status(r.status).json(d);
} catch (e) {
res.status(500).json({ error: e.message });
}
};
