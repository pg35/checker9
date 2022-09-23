import { Component, useState, useEffect } from "react";
import styled from "styled-components";
import Home from "./components/Home";
import CreditCheck from "./components/CreditCheck";
import Scan from "./components/Scan";

import "./styles.css";

export default function App() {
  const [state, setState] = useState({
    step: 1,
    status: 1,
    text: ""
  });
  const applyState = (state) => setState(state);
  useEffect(() => {
    return () => {
      console.log("app unmounted");
    };
  }, []);
  //console.log("app", state);
  let Comp = null;
  switch (state.step) {
    case 1:
      Comp = Home;
      break;
    case 2:
      Comp = CreditCheck;
      break;
    case 3:
      Comp = Scan;
      break;
    default:
      throw new Error("Unknown step");
  }
  console.log("app render");
  return (
    <div className="App">
      <Comp state={state} setState={setState} />
    </div>
  );
}
