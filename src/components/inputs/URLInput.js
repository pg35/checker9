import React, { useState, useEffect } from "react";
import Spinner from "../Spinner";
const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};
export default function URLInput(props) {
  const { state, setState } = props;
  const { rawUrl, urlValidation } = state;
  const [errorMsg, setErrorMsg] = useState("");
  let progress = null;
  if ("string" === typeof urlValidation)
    progress = (
      <span
        style={{ color: "red" }}
      >{`Validation failed: ${urlValidation}`}</span>
    );
  else if (1 === urlValidation)
    progress = (
      <span>
        Validating URL... <Spinner />
      </span>
    );
  useEffect(() => {
    console.log("url", state.text);
    setState({
      ...state,
      text:
        isValidUrl(rawUrl) && "string" !== typeof urlValidation ? rawUrl : null
    });
  }, [urlValidation]);
  const handleChange = (e) => {
    var url = window.jQuery.trim(e.target.value).toLowerCase();
    const isValid = isValidUrl(url);
    setState({
      ...state,
      rawUrl: url,
      text: isValid ? url : "",
      urlValidation: 0
    });
    setErrorMsg(isValid ? "" : "Please enter a valid HTTP URL");
  };
  console.log("text url", state.text);
  return (
    <div style={{ textAlign: "left" }}>
      <p style={{ fontWeight: "bold", fontSize: "1.1em" }}>
        <label
          htmlFor="pxq_pgck_url_input"
          style={{
            cursor: "pointer"
          }}
        >
          Please enter URL to check plagiarism
        </label>{" "}
        <small style={{ fontWeight: "normal" }}>
          (online .txt, .htm, .html, .pdf, .doc, .docx, .ppt are also allowed)
        </small>
      </p>
      <input
        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
        id="pxq_pgck_url_input"
        type="url"
        value={rawUrl}
        onChange={handleChange}
        placeholder="https://somehost.com/page.html"
      />

      <div style={{ marginTop: "5px" }}>
        {progress ? progress : <span style={{ color: "red" }}>{errorMsg}</span>}
      </div>
    </div>
  );
}
