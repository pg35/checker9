import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Overlay = (props) => {
  return (
    <div className="popup-box">
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <span className="close-icon" onClick={props.handleClose}>
          x
        </span>
        {props.children}
      </div>
    </div>
  );
};

export function Popup(props) {
  const [isOpen, setIsOpen] = useState(true);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  function escFunction(event) {
    console.log(111, event.key, event.type);
    if (event.key === "Escape" || "click" === event.type) {
      console.log("toggling", isOpen);
      setIsOpen(!isOpen);
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    document.addEventListener("click", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
      document.removeEventListener("click", escFunction, false);
    };
  }, []);
  console.log(isOpen);
  return isOpen ? (
    <Overlay handleClose={togglePopup}>{props.children}</Overlay>
  ) : null;
}
export function BuyCreditsPopup(props) {
  return (
    <Popup>
      <h2>Buy credits</h2>
      <p style={{ margin: "20px" }}>{props.msg}</p>
      <button
        style={{ marginTop: "30px", padding: "10px 20px" }}
        onClick={(e) => window.open(props.url)}
      >
        Buy now
      </button>
    </Popup>
  );
}
