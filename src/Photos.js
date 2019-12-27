import React from "react";

import useWs from "./useWs";

function Photos() {
  const [req] = useWs();
  const handleSelectDirectory = () => {
    req && req("getDir", dir => console.log(dir));
  };
  return (
    <div>
      <h1>Photo Processing</h1>
      <button onClick={handleSelectDirectory}>Select Directory</button>
    </div>
  );
}

export default Photos;
