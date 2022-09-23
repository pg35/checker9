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
    data: { action: "pxq_pgck_get_transactions" },
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
      scans = null;
    });
}
export default function ScanList(props) {
  const [localStatus, setLocalStatus] = useState(0);
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
            You don't have any transactions.
          </td>
        </tr>
      );
    } else {
      tbody = scans
        .filter((obj) => "draft" !== obj.status && "pending" !== obj.status)
        .map((obj) => (
          <tr key={obj.id}>
            <td key="id">{obj.id}</td>
            <td key="date">{obj.created_at}</td>
            <td key="detail">{obj.detail}</td>
            <td key="credits">
              <span
                style={{ color: "credit" === obj.status ? "green" : "red" }}
              >
                {"credit" === obj.status ? "+" : "-"}

                {obj.credits}
              </span>
            </td>
          </tr>
        ));
    }
    Comp = (
      <table style={{ textAlign: "left", width: "100%" }}>
        <thead>
          <tr>
            <th key="id">ID</th>
            <th key="date">Date</th>
            <th key="detail">Description</th>
            <th key="credits">Credits</th>
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
