import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const port = process.env.PORT ?? 5001;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL ?? "http://localhost:5173" }
});

io.on("connection", (socket) => {
  socket.on("movie:join", (movieId) => socket.join(String(movieId)));
  socket.on("movie:leave", (movieId) => socket.leave(String(movieId)));
});

app.set("io", io);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
