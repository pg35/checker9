import React, { useState, useEffect } from "react";
import Spinner from "../Spinner";
import { Table } from "../styled";
import { doAjax } from "../../util";

const fileTypes = [
  "text/plain",
  "text/html",
  "application/pdf",
  "application/msword",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const maxFileSizes = {
  "text/plain": 5242880,
  "text/html": 3145728,
  "application/pdf": 26214400,
  "application/msword": 26214400,
  "application/vnd.ms-powerpoint": 26214400,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 26214400
};

function validFileType(file) {
  console.log("validfiletype", file, file.type);
  return !file.type ? true : fileTypes.includes(file.type);
}
function validFileSize(file) {
  return !maxFileSizes[file.type] ? true : file.size <= maxFileSizes[file.type];
}
function formatFileSize_old(number) {
  if (number < 1024) {
    return `${number} bytes`;
  } else if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed()} KB`;
  } else if (number >= 1048576) {
    return `${(number / 1048576).toFixed()} MB`;
  }
}
function formatFileSize(number) {
  return (number / 1048576).toFixed(4).replace(/[.]0000$/, "") + " MB";
}
function getFileExt(name) {
  var re = /(?:\.([^.]+))?$/;
  return re.exec(name)[1];
}
export default function FileInput(props) {
  const { state, setState } = props;
  const { rawFile, text } = state;
  const [localStatus, setLocalStatus] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const ref = React.createRef();
  //console.log(rawFile, text);
  useEffect(() => {
    setState({ ...state, text: rawFile });
  }, []);

  const handleChange = (e) => {
    setLocalStatus(0);
    const files = ref.current.files;
    if (!files.length) return;
    if (!files.length || files.length > 1) {
      setLocalStatus(4);
      setErrorMsg("Please select one file");
      return;
    }
    const ext = getFileExt(files[0].name);
    console.log("ext", ext);
    if (!validFileType(files[0])) {
      setLocalStatus(4);
      const msg = ext
        ? `${ext} file is not allowed`
        : "This file type is not allowed";
      setErrorMsg(msg);
      return;
    }
    if (!validFileSize(files[0])) {
      setLocalStatus(4);
      const msg = `File is too large. Max size for ${
        ext ? ext : "this type of "
      } file is ${formatFileSize(maxFileSizes[files[0].type])}`;
      setErrorMsg(msg);
      return;
    }
    setState({
      ...state,
      text: null
    });
    var formData = new FormData();
    formData.append("action", "pxq_pgck_upload_file");
    formData.append("pxq_pgck", ref.current.files[0]);
    doAjax({
      data: formData,
      type: "POST",
      dataType: "json",
      processData: false,
      contentType: false,
      beforeSend: function () {
        setLocalStatus(1);
      }
    })
      .done((data, textStatus, jqXHR) => {
        console.log(data);
        if (data.success) {
          setState({
            ...state,
            rawFile: data.data,
            text: data.data
          });
          setLocalStatus(2);
        } else {
          setState({
            ...state,
            rawFile: null,
            text: null
          });
          setErrorMsg(data.data.message);
          setLocalStatus(3);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("fail", textStatus);
        setLocalStatus(3);
        setErrorMsg("Ajax: " + textStatus);
      });
  };
  let progress = "";
  if (1 === localStatus) {
    progress = (
      <span>
        Uploading file... <Spinner />
      </span>
    );
  } else if (2 === localStatus) {
    progress = (
      <span style={{ color: "green" }}>
        {" "}
        <strong>{`${rawFile.org_name}`}</strong> successfully uploaded
      </span>
    );
  } else if (3 === localStatus || 4 === localStatus) {
    progress = (
      <span style={{ color: "red" }}>{`${
        3 === localStatus ? "Failed to upload file. " : ""
      }${errorMsg}`}</span>
    );
  }
  return (
    <div style={{ textAlign: "left" }}>
      <p style={{ fontWeight: "bold", fontSize: "1.1em" }}>
        <label
          htmlFor="pxq_pgck_file_input"
          style={{
            cursor: "pointer"
          }}
        >
          Please upload a file to check plagiarism
        </label>{" "}
        <small style={{ fontWeight: "normal" }}>
          (.txt, .htm, .html, .pdf, .doc, .docx, .ppt)
        </small>
      </p>
      {(0 === localStatus || 4 === localStatus) && rawFile ? (
        <p>
          {" "}
          Previously uploaded file is <strong>{`${rawFile.org_name}`} </strong>
        </p>
      ) : null}
      <p>
        <input
          id="pxq_pgck_file_input"
          type="file"
          ref={ref}
          onChange={handleChange}
          accept=".txt, .htm, .html, .pdf, .doc, .docx, .ppt, text/plain,  text/html,  application/pdf,  application/msword, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </p>
      <p>{progress}</p>
    </div>
  );
}
