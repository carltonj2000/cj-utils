const handleMessage = w => dataIn => {
  console.log(dataIn);
  const data = JSON.parse(dataIn);
  if (!data.cmd)
    return w.send(
      JSON.stringify({ cmd: "Error", id: 2, value: "No command provided." })
    );
  const { cmd } = data;
  switch (data.cmd) {
    case "getDir":
      console.log("getting dir");
      break;
    default:
      console.log("Waring! Unknown command:", cmd);
  }
};

module.exports = {
  handleMessage
};
