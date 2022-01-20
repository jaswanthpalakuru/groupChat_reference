import React, { useState } from "react";
import JoinRoom from "./JoinRoom";
import { Link } from "react-router-dom";

export default function Home({
  onUserChange = () => {},
  onRoomChange = () => {},
}) {
  const [roomAvaibale, setRoomAvailable] = useState([
    "Room 1",
    "Room 2",
    "Room 3",
  ]);
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="container" style={{ margin: "100px 50px 0 50px" }}>
      <div className="row">
        <center>
          <h1>Group Chat</h1>
        </center>
      </div>
      <hr style={{ margin: "20px 0 20px 0" }} />
      <div className="row">
        <div className="col border-end">
          <center>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="mb-3">
                <label className="form-label">
                  {user ? `USERNAME : ${user}` : "username"}
                </label>
                <input
                  type="text"
                  placeholder="username"
                  value={user}
                  onChange={(e) => {
                    setUser(e.target.value);
                    onUserChange(e.target.value);
                  }}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
            </form>
          </center>
          {/* <button type="submit" className="btn btn-primary">Submit</button> */}
        </div>

        <div className="col">
          <center>
            <p>Join Available Rooms</p>
          </center>
          {roomAvaibale.map((item, i) => {
            return (
              <div
                key={i}
                className="row"
                style={{ margin: "auto", width: "50%" }}
              >
                <Link
                  to={{ pathname: "/chat" }}
                  params={{ testvalue: "hello" }}
                  style={user.length >= 3 ? null : { pointerEvents: "none" }}
                  onClick={() => {
                    onRoomChange(roomAvaibale[i]);
                    // Join to a room
                  }}
                >
                  <JoinRoom
                    enable={user.length >= 3 ? false : true}
                    roomAvailable={item}
                  />
                </Link>
              </div>
            );
          })}
          <div></div>
        </div>
      </div>
    </div>
  );
}
