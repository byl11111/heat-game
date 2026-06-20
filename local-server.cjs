const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const root = __dirname;
const port = Number(process.argv[2] || 8080);
const accessLog = path.join(root, "local-server.out.log");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};

function log(line) {
  const text = `${new Date().toLocaleString()} ${line}`;
  console.log(text);
  try {
    fs.appendFileSync(accessLog, `${text}\n`, "utf8");
  } catch (err) {}
}

function getIPv4List() {
  const nets = os.networkInterfaces();
  const items = [];
  Object.keys(nets).forEach((name) => {
    (nets[name] || []).forEach((net) => {
      if (net.family === "IPv4" && !net.internal) items.push({ name, address: net.address });
    });
  });
  return items;
}

function isLikelyIsolated(address) {
  return /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(address);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    log(`${req.socket.remoteAddress || "unknown"} ${req.method} ${url.pathname}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";

    const file = path.normalize(path.join(root, pathname));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store, max-age=0",
        "Access-Control-Allow-Origin": "*"
      });
      res.end(data);
    });
  })
  .listen(port, "0.0.0.0", () => {
    log(`Server started on 0.0.0.0:${port}`);
    console.log("");
    console.log(`Open on this computer: http://localhost:${port}`);
    console.log("Open on iPad with one of these addresses:");
    getIPv4List().forEach(({ name, address }) => {
      console.log(`  http://${address}:${port}/check.html    (${name})`);
      console.log(`  http://${address}:${port}/index.html`);
      if (isLikelyIsolated(address)) {
        console.log("  Warning: this 100.64-100.127 address is often on an isolated public/campus network.");
        console.log("  If the iPad stays blank, use a phone hotspot or a private router Wi-Fi instead.");
      }
    });
    console.log("");
    console.log(`Access log: ${accessLog}`);
  });
