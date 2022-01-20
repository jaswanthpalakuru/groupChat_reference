// const express = require("express");
// const app = express();
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");

// const server = app.listen(80);
// const io = new Server(server, { cors: "*" });

// app.get("/test", (req, res, next) => {
//   res.send({ status: "ok" });
// });

// io.on("connection", (socket) => {
//   socket.on("join-room", ({ room, user }) => {
//     socket.join(room);
//     console.log(user + " joined the room : " + room);

//     io.to(room).emit("connectRoom", "connected to " + room);
//   });

//   socket.on("message", ({ message, room, sender }) => {
//     io.to(room).emit("message", { message, room, sender });
//   });

//   //   io.sockets
//   //     .to(room)
//   //     .emit('connectToRoom', { message: "message from room-1" });
// });
