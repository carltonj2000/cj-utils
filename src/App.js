import React from "react";

import { Link } from "react-router-dom";

import "./App.css";

function App() {
  React.useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:1040");
    socket.onmessage = function(event) {
      console.log("ws data", event.data);
    };
    socket.onopen = function() {
      socket.send("Hello server!");
    };
  });

  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Link className="App-link" to="/about">
          Link to About
        </Link>
      </header>
    </div>
  );
}

export default App;
