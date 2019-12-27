import React from "react";

import { Link } from "react-router-dom";

import Photos from "./Photos";

function App() {
  return (
    <div>
      <Link className="App-link" to="/about">
        Link to About
      </Link>
      <Photos />
    </div>
  );
}

export default App;
