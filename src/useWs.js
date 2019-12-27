import React from "react";
import uuid from "uuid";

let socket;

export default () => {
  const [ws, wsSet] = React.useState(null);
  const [reqs, reqsSet] = React.useState({ "1": "server up" });

  React.useEffect(() => {
    if (socket) return;
    socket = new WebSocket("ws://127.0.0.1:1040");
    socket.onopen = function() {
      socket.send(
        JSON.stringify({ cmd: "pong", value: "Interface Up.", id: 2 })
      );
      wsSet(socket);
    };
    socket.onmessage = function(event) {
      // console.log("ws data", event.data); // for debug
      const data = JSON.parse(event.data);
      if (data.id === undefined)
        return console.log("Warning! Message without ID.", data);
      const req = reqs[data.id];
      if (!req) return console.log("Warning! Unknown Message ID.", data.id);
      console.log(data);
      if (req.cb) req.cb(data);
      delete reqs[data.id];
    };
  }, [reqs]);

  const req = (cmd, cb) => {
    const id = uuid.v4();
    reqsSet(r => (r[id] = { cmd, cb }));
    if (!ws) return console.log("Warning. Websocket down.", cmd);
    ws.send(JSON.stringify({ cmd, id }));
  };
  return [req];
};
