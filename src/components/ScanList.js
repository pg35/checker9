import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { doAjax } from "../util";
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}
let scans = null;
function loadScans(setLocalStatus) {
  setLocalStatus(1);
  doAjax({
    data: { action: "pxq_pgck_get_scans" },
    type: "GET",
    dataType: "json"
  })
    .done((data, textStatus, jqXHR) => {
      if (data.success) {
        setLocalStatus(2);
        scans = data.data;
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      setLocalStatus(3);
      scans = null; //JSON.parse(json).data;
    });
}
export default function ScanList(props) {
  const [localStatus, setLocalStatus] = useState(0);
  const [visibleInputs, setVisibleInputs] = useState([]);
  useEffect(() => {
    loadScans(setLocalStatus);
  }, []);
  let Comp = null;

  if (1 === localStatus) {
    Comp = (
      <p>
        Loading...
        <Spinner />
      </p>
    );
  } else if (3 === localStatus) {
    Comp = (
      <div>
        <p style={{ color: "red" }}>
          Failed to load transactions. Please refresh!
        </p>
      </div>
    );
  } else if (2 === localStatus && scans) {
    let tbody = null;
    if (!scans.length) {
      tbody = (
        <tr>
          <td colSpan={6} style={{ textAlign: "center", padding: "40px 30px" }}>
            You don't have any plagiarmism checks.
          </td>
        </tr>
      );
    } else {
      const getInput = (type, input) => {
        if ("url" === type) {
          return (
            <a href={input} target="_blank" rel="noreferrer">
              {input}
            </a>
          );
        } else if ("file" === type) {
          const toks = input.split(",");
          return toks.length > 1 ? toks[0] : "";
        } else if ("text" === type) {
          const text = input;
          return text;
        }
      };
      const getCredits = (status, credits) => {
        if (
          "scanned" === status ||
          "exporting" === status ||
          "export_failed" === status ||
          "exported" === status
        )
          return credits;
        return "";
      };
      const getStatus = (status) => {
        switch (status) {
          case "checking":
            return "Checking credits";
          case "check_failed":
            return "Checking creits failed";
          case "checked":
            return "Credits checked";
          case "scanning":
            return "Scanning";
          case "scan_failed":
            return "Scan failed";
          case "scanned":
            return "Scanned";
          case "exporting":
            return "Generating reports";
          case "export_failed":
            return "Report generation failed";
          case "exported":
            return "Completed";
          default:
            return status;
        }
      };
      tbody = scans
        .filter((obj) => "draft" !== obj.status && "pending" !== obj.status)
        .map((obj) => (
          <>
            <tr
              key={obj.id}
              className={
                visibleInputs.includes(obj.id)
                  ? "pxq_pgck_open"
                  : "pxq_pgck_close"
              }
            >
              <td key="id">{obj.id}</td>
              <td key="type">{capitalize(obj.type)}</td>
              <td key="input">
                <a
                  href="#"
                  onClick={(e) => {
                    if (visibleInputs.includes(obj.id)) {
                      setVisibleInputs(
                        visibleInputs.filter((id) => id !== obj.id)
                      );
                    } else setVisibleInputs([...visibleInputs, obj.id]);
                    e.preventDefault();
                  }}
                >
                  {visibleInputs.includes(obj.id) ? "Hide" : "Show"}
                </a>
              </td>
              <td key="status">{getStatus(obj.status)}</td>
              <td key="credits">{getCredits(obj.status, obj.credits)}</td>
              <td key="date">{obj.created_at}</td>
              <td className="pxq_pgck_actions">
                {("check_failed" === obj.status ||
                  "checked" === obj.status) && (
                  <a
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      const url =
                        window.pxq_pgck_main_url + "?pxq_pgck_sid=" + obj.id;
                      window.open(url, "_blank");
                      e.preventDefault();
                    }}
                  >
                    Resume
                  </a>
                )}
                {"exported" === obj.status && (
                  <>
                    <a
                      href="#"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        const url =
                          window.pxq_pgck_report_url + "?scan_id=" + obj.id;
                        window.open(url, "_blank");
                        e.preventDefault();
                      }}
                    >
                      Report
                    </a>
                    <a
                      href="#"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        const url = window.pxq_pgck_pdf_url.replace(
                          "{SCANID}",
                          obj.id
                        );
                        window.open(url, "_blank");
                        e.preventDefault();
                      }}
                    >
                      PDF
                    </a>
                  </>
                )}
              </td>
            </tr>
            {visibleInputs.includes(obj.id) && (
              <tr key={`${obj.id}_s`}>
                <td colSpan={6}>{getInput(obj.type, obj.input)}</td>
              </tr>
            )}
          </>
        ));
    }
    Comp = (
      <table style={{ textAlign: "left", width: "100%" }}>
        <thead>
          <tr>
            <th key="id">ID</th>
            <th key="type">Type</th>
            <th key="input">Input</th>
            <th key="status">Last activity</th>
            <th key="credit">Credits used</th>
            <th key="date">Created at</th>
            <th key="actions"> </th>
          </tr>
        </thead>
        <tbody>{tbody}</tbody>
      </table>
    );
  }

  return (
    <div>
      <div style={{ textAlign: "left", marginBottom: "10px" }}>
        <button onClick={() => loadScans(setLocalStatus)}>Refresh</button>
      </div>
      <div>{Comp}</div>
    </div>
  );
}
