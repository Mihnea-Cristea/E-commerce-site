import React, { useContext } from "react";
import { UserContext } from "../App";

export default function Account() {
  const currUser = true; //useContext(UserContext);

  return currUser ? (
    <div>
      <a>Informatii despre user...</a>
      <button>logout</button>
    </div>
  ) : (
    <div>
      <a href="/singup">Inregistreaza-te</a>
      <br></br>
      <a href="/signin">Ai cont? Logheaza-te</a>
    </div>
  );
}
