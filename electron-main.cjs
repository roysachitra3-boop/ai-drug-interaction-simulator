const { app, BrowserWindow } = require("electron");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

let localServer;

async function startLocalServer() {
  const clientRoot = path.join(__dirname, "dist", "client");
  const serverModule = await import(pathToFileURL(path.join(__dirname, "dist", "server", "server.js")));
  const serverHandler = serverModule.default;

  localServer = http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
      const relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
      const filePath = path.resolve(clientRoot, relativePath);
      const isInsideClientRoot = filePath === clientRoot || filePath.startsWith(`${clientRoot}${path.sep}`);

      if (isInsideClientRoot && relativePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        response.writeHead(200, {
          "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        });
        fs.createReadStream(filePath).pipe(response);
        return;
      }

      const requestForHandler = new Request(`http://127.0.0.1${requestUrl.pathname}${requestUrl.search}`, {
        method: request.method,
        headers: request.headers,
      });
      const rendered = await serverHandler.fetch(requestForHandler, {}, {});
      response.writeHead(rendered.status, Object.fromEntries(rendered.headers.entries()));
      response.end(Buffer.from(await rendered.arrayBuffer()));
    } catch (error) {
      console.error(error);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("The application could not be loaded.");
    }
  });

  await new Promise((resolve) => localServer.listen(0, "127.0.0.1", resolve));
  return localServer.address().port;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL(`http://127.0.0.1:${global.localServerPort}/`);
}

app.whenReady().then(async () => {
  global.localServerPort = await startLocalServer();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  localServer?.close();
});