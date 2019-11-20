import React from "react";
import ReactDOM from "react-dom";

import { HashRouter as Router, Route } from "react-router-dom";

import "./index.css";
import App from "./App";
import About from "./About";

ReactDOM.render(
  <Router>
    <Route exact path="/" component={App} />
    <Route path="/about" component={About} />
  </Router>,
  document.getElementById("root")
);
