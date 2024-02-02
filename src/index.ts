import app from "./app/app";
import http, { Server } from "http";
import config from "./configurations/config";
const server: Server = http.createServer(app);
const PORT = config.port ?? 5000;

server.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});
