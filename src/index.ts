import "dotenv/config";
import app from "./app/app";
import http, { Server } from "http";
import env from "./utils/validate-env";
import mongoose from "mongoose";

const server: Server = http.createServer(app);
const PORT = env.PORT;

mongoose
  .connect(env.DB_URL)
  .then(() => {
    console.log("Database connection established");

    server.listen(PORT, () => {
      console.log(`App is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
