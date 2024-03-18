import { WebSocketServer } from "ws";
import fs from "fs-extra";
import { dataFolderName } from "./constants.js";
import path from "path";

const startWebSocketServer = () => {
  const wss = new WebSocketServer({ port: 3008 });
  wss.on("connection", (ws) => {
    console.log("WebSocket connection established.");

    // Handle incoming messages
    ws.on("message", (message) => {
      const payload = JSON.parse(message.toString());
      processPayload(payload);
    });
  });
};

let id = 1;
const processPayload = (payload) => {
  const { type, url, data } = payload;
  console.log("*".repeat(80));
  console.log({ type, url, payload });
  console.log("*".repeat(80));

  if (type !== "rrweb events") {
    return;
  }

  /* ----------------------------------- code-update:-> every URL is saved on it's own file ----------------------------------- */

  const jsonData = JSON.parse(data);

  const encodedURL = encodeURIComponent(url);
  const dataFilePath = path.join(dataFolderName, `${id}_${encodedURL}.json`);

  fs.writeJsonSync(dataFilePath, jsonData);

  id++;

  /* ----------------------------------- code-update:-> every URL is saved on it's own file ----------------------------------- */

  // let lastUrl = null;
  // let dataFilePath;
  // if (url === lastUrl) {
  //   // Simply append to the same file;  No change
  //   dataFilePath = path.join(dataFolderName, id.toString());
  //   fs.writeJsonSync(dataFilePath, jsonData, { flag: "a" });
  // } else {
  //   dataFilePath = path.join(dataFolderName, id.toString());
  //   fs.writeJsonSync(dataFilePath, jsonData); // This would empty the files if there's already content
  // }

  // lastUrl = url;
};

export { startWebSocketServer };
