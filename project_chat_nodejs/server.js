const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  }
});

app.use(cors());

const onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("user_connected", (username) => {
    onlineUsers[username] = socket.id;

    const users = Object.entries(onlineUsers).map(([name, id]) => ({
      socketId: id,
      username: name,
    }));

    io.emit("online_users", users);
  });

  socket.on("send_message", (message, receiver) => {
    io.to(receiver).emit("receive_message", {
      senderId: socket.id,
      message,
    });

  });

  socket.on("disconnect", () => {
    const username = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id
    );
    if (username) delete onlineUsers[username];

    const users = Object.entries(onlineUsers).map(([name, id]) => ({
      socketId: id,
      username: name,
    }));

    io.emit("online_users", users);
  });
});


// start server at port 3001
server.listen(3001, () => {
  console.log("Server running on port 3001");
});


