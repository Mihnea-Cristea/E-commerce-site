import React, { useContext } from "react";
import { UserContext } from "../App";

export default function Test() {
  const test_value = useContext(UserContext);
  console.log(test_value);

  return <div>da</div>;
}
