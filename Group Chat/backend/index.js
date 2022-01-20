const express = require("express");
const createError = require("http-errors");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(http, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.0.103:3000",
      "https://admin.socket.io/",
      "https://khelkhelo.in/",
      "http://65.2.121.52",
    ],
    methods: ["GET", "POST"],
  },
});
const mongoose = require("mongoose");
const Message = require("./models/Message");
const Joi = require("joi");

// Connect to DATABASE
mongoose
  .connect(
    "mongodb+srv://admin:Narasimha1@social.v4vw4.mongodb.net/chat-rooms?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected to db"))
  .catch((ex) => console.log(ex));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.0.103:3000",
      "https://admin.socket.io/",
      "https://khelkhelo.in/",
      "http://65.2.121.52",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve
app.use("/", express.static(__dirname + "/www"));

app.get("/getMessages/:room", async (req, res, next) => {
  try {
    const room = await Joi.string()
      .required()
      .min(1)
      .validateAsync(req.params.room);
    const limit = req.query.limit || 30;
    const page = req.query.page || 0;

    //   pagination
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(+limit)
      .skip(0);

    res.send(messages);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/deleteMessages/:id", async (req, res, next) => {
  try {
    const id = await Joi.string().required().validateAsync(req.params.id);
    const user = await Joi.string().required().validateAsync(req.query.user);
    const message = await Message.find({ _id: id, sender: user });

    if (!message) return res.send("message not found");

    await Message.findByIdAndRemove(id, { new: true });

    res.send({ status: "OK" });
  } catch (error) {
    next(error);
  }
});

//   Sockets Connection
io.on("connection", (socket) => {
  console.log(socket.id + "____connected");
  socket.on("join-room", ({ room, user }) => {
    socket.join(room);
    console.log(user + " joined the room : " + room);
    io.to(room).emit("connectRoom", "connected to " + room);
  });

  socket.on("disconnect", () => {
    console.log(socket.id + "____dc");
  });

  //   MESSAGES
  socket.on("message", async (_message) => {
    try {
      const msg = new Message(_message);
      //   send Message to all connected sockets on that room
      io.to(_message.room).emit("message", msg);
      // save msg to database
      await msg.save();
    } catch (ex) {
      console.log(ex);
    }
  });
});

// post middleware
app.use((req, res, next) => {
  next(createError.NotFound("Not Found"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

instrument(io, {
  auth: false,
});

http.listen(80, function () {
  console.log("listening on *:80");
});
