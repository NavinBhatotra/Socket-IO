import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const port = 3030;
const app = express();

const server = app.listen(port, () =>
  console.log(`Server has been started on port ${port}`)
);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log(`User has been connected:  ${socket.id}`);

  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    console.log(`User with ID: ${socket.id} joined room: ${roomName}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnected", () => {
    console.log(`User Disconnected ${socket.id}`);
  });
});
