import { Textarea } from "../styled";
import { useState, useEffect } from "react";

export default function TextInput(props) {
  const { state, setState } = props;
  const { rawText } = state;
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const setTextInState = (wordCount, charCount, rawText) =>
    setState({
      ...state,
      text: charCount < 30 || wordCount < 6 ? "" : getWords(rawText).join(" ")
    });
  useEffect(() => {
    setWordCount(countWords(rawText));
    setCharCount(countChars(rawText));
    setTextInState(countWords(rawText), countChars(rawText), rawText);
  }, []);
  useEffect(() => {
    setTextInState(wordCount, charCount, rawText);
  }, [rawText, charCount, wordCount]);
  return (
    <div style={{ textAlign: "left" }}>
      <p
        style={{
          fontWeight: "bold",
          fontSize: "1.1em"
        }}
      >
        <label
          htmlFor="pxq_pgck_text_input"
          style={{
            cursor: "pointer"
          }}
        >
          Please enter text to check plagiarism
        </label>{" "}
        <small style={{ fontWeight: "normal" }}>
          (At least 30 characters and 6 words)
        </small>
      </p>
      <Textarea
        id="pxq_pgck_text_input"
        value={rawText}
        onChange={(e) => {
          setState({
            ...state,
            rawText: e.target.value
          });
          setWordCount(countWords(e.target.value));
          setCharCount(countChars(e.target.value));
        }}
        placeholder="Enter at least 30 characters and 6 words"
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
