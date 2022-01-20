import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from "./components/Chat.jsx";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");

  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => (
            <Home onRoomChange={setRoom} onUserChange={setUser} {...props} />
          )}
        />
        <Route
          path="/chat"
          render={(props) => <Chat user={user} room={room} {...props} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
