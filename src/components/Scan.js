import { useState, useEffect } from "react";
import { Container, Button, Table, Heading } from "./styled";
import { doAjax } from "../util";
import Spinner from "./Spinner";
import { BuyCreditsPopup } from "./Popup";

export default function Scan(props) {
  const { state, setState } = props;
  const { step, status, scan_id, text, pdf, sandbox, type } = state;

  const [poll, setPoll] = useState(0);
  const [action, setAction] = useState("pxq_pgck_get_scan_result");
  useEffect(() => {
    let pollXHR;
    if (poll) {
      pollXHR = doAjax({
        data: {
          action: action,
          scan_id: scan_id
        },
        method: "GET",
        dataType: "json"
      })
        .done((data, textStatus, jqXHR) => {
          console.log("scan_result", data.data.scan_id, data.data.export);
          if (data.success && data.data) {
            if (data.data.pdf) {
              setState({ ...state, ...data.data, status: 2 });
            } else {
              if (data.data.export) {
                console.error("exported completed");
                setState({ ...state, ...data.data });
                setAction("pxq_pgck_get_export_result");
              }
              setTimeout(() => setPoll(poll + 1), 1000);
            }
          }
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          console.log("scan_result failed", poll, scan_id, textStatus);
          if ("abort" === textStatus) return;
          setState({ ...state, status: 3, error: "Ajax Error " + textStatus });
        })
        .always(() => {
          pollXHR = null;
        });
    }
    return () => {
      console.log("unmount in scan_reult poll", !!pollXHR, poll, scan_id);
      if (pollXHR) pollXHR.abort();
    };
  }, [poll, scan_id, action]);

  useEffect(() => {
    console.log("pc useeffect", scan_id);

    let xhr = doAjax({
      data: {
        action: "pxq_pgck_start_scan",
        scan_id: scan_id
        //text: text,
        //sandbox
      },
      method: "POST",
      dataType: "json"
    })
      .done((data, textStatus, jqXHR) => {
        console.log("pc success", data.data.scan_id);
        setState({ ...state, scan_id: data.data.scan_id });
        setPoll(1);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("pc failed", textStatus);
        if ("abort" === textStatus) return;
        setState({ ...state, status: 3, error: "Ajax Error " + textStatus });
      })
      .always(() => {
        xhr = null;
      });
    return () => {
      console.log("unmounting pc", !!xhr);
      if (xhr) xhr.abort();
    };
  }, []);

  let heading = null;
  if (1 === status) heading = <h3>Checking plagiarism</h3>;
  else if (2 === status)
    heading = <Heading success>Plagiarism check completed</Heading>;
  else heading = <Heading>Plagiarism check failed</Heading>;

  function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  }
  let input = "";
  if ("text" === type)
    input = text.slice(0, 6) + "..." + text.slice(text.length - 6);
  else if ("file" === type) input = text.org_name;
  else input = text;

  return (
    <div>
      <Container>
        {heading}

        {1 === status ? (
          <div>
            <p>
              <Spinner />
            </p>
            <p>
              {state.export
                ? `Generating ${"todel" !== type ? "report and PDF" : "PDF"}`
                : "It may take some time"}
            </p>
          </div>
        ) : null}
        {3 === status ? (
          <p>
            <strong>Reason:</strong> {state.error}
          </p>
        ) : null}
        {2 === status ? (
          <p>
            <strong>
              {"todel" !== type ? "Report and PDF are ready" : "PDF is ready"}
            </strong>
          </p>
        ) : null}
        {(state.export || 2 === status) && "todel" === type ? (
          <p>
            <small>
              Report is not generated for file based plagiarism check
            </small>
          </p>
        ) : null}

        <Table>
          <tbody>
            <tr>
              <th>Type</th>
              <td>{"url" === type ? "URL" : capitalize(type)}</td>
            </tr>
            <tr>
              <th>Input</th>
              <td>{input}</td>
            </tr>
            <tr>
              <th>Sandbox mode</th>
              <td>
                {true === sandbox ? (
                  "On"
                ) : (
                  <span style={{ color: "red" }}>Off</span>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
      <Button
        onClick={() => {
          if (1 === status) {
            if (
              confirm(
                "Currently, plagiarism check is in progress.\nAre you sure you want to cancel it and restart?"
              )
            )
              setState({ ...state, step: 1, status: 1 });
          } else setState({ ...state, step: 1, status: 1 });
        }}
      >
        Restart
      </Button>
      {"todel" !== type ? (
        <Button
          onClick={() => {
            const url = window.pxq_pgck_report_url + "?scan_id=" + scan_id;
            window.open(url, "_blank");
          }}
          disabled={2 === status ? false : true}
        >
          View report
        </Button>
      ) : null}
      <Button
        onClick={() => {
          const url = pdf;
          window.open(url, "_blank");
        }}
        disabled={2 === status ? false : true}
      >
        Download PDF
      </Button>
      {2 === status ? (
        <BuyCreditsPopup
          msg={`Get your text, documents (local or online) and web pages scanned for plagiarism.`}
          url={`${state.product_url}`}
        />
      ) : null}
    </div>
  );
}
