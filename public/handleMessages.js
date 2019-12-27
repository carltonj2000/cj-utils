const { dialog } = require("electron");

const handleMessage = (win, w) => dataIn => {
  // console.log(dataIn); // for debug
  const data = JSON.parse(dataIn);
  if (!data.cmd)
    return w.send(
      JSON.stringify({ cmd: "Error", id: 2, value: "No command provided." })
    );
  const { cmd } = data;
  switch (data.cmd) {
    case "pong":
      console.log(data);
      break;
    case "getDir":
      dialog
        .showOpenDialog(win, {
          properties: ["openDirectory"]
        })
        .then(d =>
          w.send(
            JSON.stringify({
              cmd: data.cmd + " resp",
              id: data.id,
              response: d
            })
          )
        )
        .catch(e => console.log("Dir access failed.", e));
      break;
    default:
      console.log("Warning! Unknown command:", cmd);
  }
};

module.exports = {
  handleMessage
};
