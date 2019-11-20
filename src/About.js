import React from "react";

import { Link } from "react-router-dom";

function About() {
  return (
    <div>
      <h1>Welcome to the About page.</h1>{" "}
      <Link className="App-link" to="/">
        Link to Home
      </Link>
    </div>
  );
}

export default About;
