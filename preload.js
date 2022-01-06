// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const ipc = require("electron").ipcRenderer;
window.addEventListener("message", (e) => {
  if (e.source != window) return;
  ipc.send(e.data);
});
