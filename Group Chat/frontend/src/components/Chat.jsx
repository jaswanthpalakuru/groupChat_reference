import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
const socket = io("http://localhost:80");
const axios = require("axios");

export default function Chat({ history, user, room }) {
  const [messages, setMessages] = useState([]); //{sender:"", message:""}
  const [message, setMessage] = useState("");

  const limit = 30,
    page = 0;

  async function fetchMessages() {
    try {
      const { data } = await axios.get(
        `http://localhost/getMessages/${room}?limit=${limit}&page=${page}`
      );
      setMessages(data.reverse());
    } catch (ex) {
      console.log(ex);
    }
  }

  async function deleteMessages(id) {
    const { data } = await axios.delete(
      `http://localhost/deleteMessages/${id}?user=${user}`
    );
  }

  useEffect(() => {
    //   Fetch prev messages from database
    fetchMessages();
    if (!user || !room) return history.replace("/");

    // join the room
    socket.emit("join-room", { room, user });

    //   Listener for "message" events
    socket.on("message", (msg) => {
      console.log(msg);
      setMessages((m) => {
        return [...m, msg];
      });
    });
  }, [room, user]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!message) return alert("Message Should not be empty");
    socket.emit("message", { message, sender: user, room });
    setMessage("");
  }

  return (
    <div className="">
      <h1 style={{ fontSize: 20, textAlign: "right", marginRight: 40 }}>
        username : {user}
      </h1>
      <h1 style={{ fontSize: 20, textAlign: "right", marginRight: 40 }}>
        room : {room}
      </h1>
      <div className="" style={{ marginLeft: "auto" }}>
        <button
          style={{}}
          className="btn btn-primary"
          onClick={() => {
            history.replace("/");
          }}
        >
          Exit room
        </button>
      </div>
      <div
        style={{
          width: "60%",
          height: "80vh",
          backgroundColor: "#E7E7E7",
          margin: "auto",
          borderRadius: 10,
          marginTop: 30,
          position: "relative",
          overflow: "scroll",
        }}
      >
        {/* Reciever Messages */}
        {messages.map((m, i) => (
          <Message
            key={i}
            index={i}
            user={user}
            sender={m.sender}
            message={m.message}
            id={m._id}
            deleteMessages={deleteMessages}
            handleDelete={() => {
              setMessages((_) => {
                const x = [..._];
                x.splice(i, 1);
                return x;
              });
            }}
          />
        ))}
      </div>
      {/* Input Elem */}
      <div style={{ margin: "auto", marginTop: 20 }}>
        <form onSubmit={handleSubmit} style={{ width: "auto" }}>
          <input
            type="text"
            className="form-control"
            style={{ width: "60%", margin: "auto" }}
            placeholder="Press Enter to Send Message"
            aria-label="Send Message"
            aria-describedby="basic-addon2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}

function Message({
  sender,
  message,
  user,
  index,
  id,
  deleteMessages,
  handleDelete,
}) {
  return (
    <div
      style={{
        padding: "20 30 20 30",
        backgroundColor: "#444",
        paddingLeft: 10,
        marginBottom: 1,
        width: "60%",
        marginLeft: sender == user ? "auto" : null,
        position: "relative",
      }}
    >
      <p style={{ margin: 0, color: "#E7E7E7" }}>{sender} : </p>
      <p style={{ color: "#E7E7E7" }}>Message : {message} </p>
      {sender == user && (
        <span style={{ position: "absolute", right: 5, top: 5 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              deleteMessages(id);
              handleDelete();
            }}
          >
            Delete
          </button>
        </span>
      )}
    </div>
  );
}
