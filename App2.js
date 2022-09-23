import { useState, useEffect, Component } from "react";
import styled from "styled-components";
import Home from "./components/Home";
import CreditCheck from "./components/CreditCheck";
import Scan from "./components/Scan";

import "./styles.css";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      step: 1,
      status: 1,
      text: ""
    };
    this.applyState = this.applyState.bind(this);
  }
  applyState(state) {
    this.setState(state);
  }
  componentWillUnmount() {
    console.log("app unmounted");
  }
  //console.log("app", state);
  render() {
    let Comp = null;
    switch (this.state.step) {
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
        <Comp state={this.state} setState={this.applyState} />
      </div>
    );
  }
}
