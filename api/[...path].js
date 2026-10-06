const http = require("node:http");
const https = require("node:https");

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host"
]);

function jsonError(res, statusCode, message) {
  if (res.headersSent) {
    res.destroy();
    return;
  }
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: message }));
}

module.exports = (req, res) => {
  const backendValue = process.env.BACKEND_URL;
  if (!backendValue) {
    jsonError(res, 503, "BACKEND_URL ist in den Vercel-Umgebungsvariablen nicht konfiguriert.");
    return;
  }

  let backend;
  try {
    backend = new URL(backendValue);
  } catch {
    jsonError(res, 500, "BACKEND_URL ist keine gültige URL.");
    return;
  }
  if (!["https:", "http:"].includes(backend.protocol) || (backend.protocol === "http:" && !["localhost", "127.0.0.1", "::1"].includes(backend.hostname))) {
    jsonError(res, 500, "BACKEND_URL muss HTTPS verwenden (HTTP ist nur für localhost erlaubt).");
    return;
  }
  if (backend.pathname !== "/" || backend.search || backend.hash) {
    jsonError(res, 500, "BACKEND_URL muss nur den Ursprung des Backends enthalten, ohne Pfad oder Query.");
    return;
  }

  const transport = backend.protocol === "https:" ? https : http;
  const headers = {};
  for (const [name, value] of Object.entries(req.headers)) {
    if (hopByHopHeaders.has(name) || name.startsWith("x-forwarded-")) continue;
    headers[name] = value;
  }
  headers.host = backend.host;
  if (req.headers["x-forwarded-for"]) headers["x-forwarded-for"] = req.headers["x-forwarded-for"];
  if (req.headers["x-vercel-forwarded-for"]) headers["x-forwarded-for"] = req.headers["x-vercel-forwarded-for"];
  headers["x-forwarded-host"] = req.headers.host || "";
  headers["x-forwarded-proto"] = req.headers["x-forwarded-proto"] || "https";

  const proxyRequest = transport.request({
    protocol: backend.protocol,
    hostname: backend.hostname,
    port: backend.port || undefined,
    method: req.method,
    path: req.url,
    headers
  }, (proxyResponse) => {
    const responseHeaders = {};
    for (const [name, value] of Object.entries(proxyResponse.headers)) {
      if (value !== undefined && !hopByHopHeaders.has(name)) responseHeaders[name] = value;
    }
    res.writeHead(proxyResponse.statusCode || 502, responseHeaders);
    proxyResponse.pipe(res);
  });

  proxyRequest.on("error", (error) => {
    console.error("Vercel API proxy request failed:", error.message);
    jsonError(res, 502, "Der Atelier-Backend-Server ist derzeit nicht erreichbar.");
  });
  req.on("aborted", () => proxyRequest.destroy());
  res.on("close", () => {
    if (!res.writableEnded) proxyRequest.destroy();
  });
  req.pipe(proxyRequest);
};

module.exports.config = { api: { bodyParser: false } };
