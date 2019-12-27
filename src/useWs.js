import React from "react";
import uuid from "uuid";

let socket;

export default () => {
  const [ws, wsSet] = React.useState(null);
  const [reqs, reqsSet] = React.useState({});

  React.useEffect(() => {
    if (socket) return;
    socket = new WebSocket("ws://127.0.0.1:1040");
    socket.onopen = function() {
      socket.send(
        JSON.stringify({ cmd: "Pong", value: "Interface Up.", id: 1 })
      );
      wsSet(socket);
    };
    socket.onmessage = function(event) {
      console.log("ws data", event.data);
      const data = JSON.parse(event.data);
      if (data.id === 0) return console.log("Server up.", data);
      if (!data.id) return console.log("Warning! Message without ID.", data);
      const req = reqs[data.id];
      if (!req) return console.log("Warning! Unknown Message ID.", data.id);
      if (req.cb) req.cb();
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
