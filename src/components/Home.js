import { Container, Textarea, Button } from "./styled";
import { useState, useEffect } from "react";

export default function Home(props) {
  const { state, setState } = props;
  const { rawText, sandbox } = state;
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  console.log("home sandiv", sandbox);
  useEffect(() => {
    setWordCount(countWords(rawText));
    setCharCount(countChars(rawText));
  }, []);
  return (
    <div>
      <Container>
        <p style={{ textAlign: "left" }}>
          <label htmlFor="pxq_pc_text">
            Please enter text to check plagiarism
          </label>{" "}
          <small>(At least 30 characters and 6 words)</small>
        </p>
        <Textarea
          id="pxq_pc_text"
          value={rawText}
          onChange={(e) => {
            setState({
              ...state,
              rawText: e.target.value,
              text: getWords(e.target.value).join(" ")
            });

            setWordCount(countWords(e.target.value));
            setCharCount(countChars(e.target.value));
          }}
          placeholder="Enter at least 30 characters and 6 words"
          rows="10"
        ></Textarea>
        <div style={{ textAlign: "left" }}>
          <small>
            <span>
              <strong>Characters:</strong>{" "}
              <span
                style={{
                  color: charCount < 30 ? "red" : "green"
                }}
              >
                {charCount}
              </span>
            </span>
            &nbsp;&nbsp;&nbsp;
            <span>
              <strong>Words:</strong>{" "}
              <span
                style={{
                  color: wordCount < 6 ? "red" : "green"
                }}
              >
                {wordCount}
              </span>
            </span>
          </small>
        </div>
        <p style={{ textAlign: "left" }}>
          <label>
            <input
              type="checkbox"
              checked={sandbox}
              onChange={(e) =>
                setState({
                  ...state,
                  sandbox: !sandbox
                })
              }
            />{" "}
            Enable sandbox mode
          </label>
        </p>
      </Container>
      <Button
        onClick={() =>
          props.setState({
            ...state,
            step: 2,
            status: 1,
            scan_id: 0,
            credits: 0
          })
        }
        disabled={charCount < 30 || wordCount < 6 ? true : false}
      >
        Next
      </Button>
    </div>
  );
}
function getWords(s) {
  return window.jQuery
    .trim(s)
    .split(/\s+|\r?\n/g)
    .filter((tok) => tok.length);
}
function countWords(s) {
  return getWords(s).length;
}
function countChars(s) {
  const words = getWords(s);
  return words.reduce(
    (t, c) => t + c.length,
    words.length ? words.length - 1 : 0
  );
}
