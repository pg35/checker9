import { Component, useState, useEffect } from "react";
import { Container, Button, Table, Heading } from "./styled";
import { doAjax } from "../util";
import Spinner from "./Spinner";

export default class CreditCheck extends Component {
  constructor() {
    super();
  }
  componentWillUnmount() {
    console.log("cc unmounted");
    this.xhr.abort();
  }
  componentDidMount() {
    const { state, setState } = this.props;
    const { step, status, credits, ext } = state;
    this.xhr = doAjax({
      data: {
        action: "pxq_pgck_check_credits",
        text: state.text,
        sandbox: true
      },
      method: "POST",
      dataType: "json"
    })
      .done(function (data, textStatus, jqXHR) {
        console.log("credit checker ajax", data);
        setState({ ...state, ...data.data, status: data.success ? 2 : 3 });
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("credcheck ajax failed", textStatus, errorThrown);
        setState({ ...state, status: 3, error: "Ajax Error " + textStatus });
      });
    //return () => {
    console.log("mounted credit checker");
    //xhr.abort();
    //};
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { state, setState } = this.props;
    const { step, status, credits } = state;

    let heading = null;
    if (1 === status) heading = <h3>Checking credits</h3>;
    else if (2 === status)
      heading = <Heading success>Credit check completed</Heading>;
    else heading = <Heading>Credit check failed</Heading>;
    console.log("credit check render");
    return (
      <div>
        <Container>
          {heading}
          {1 === status ? (
            <p>
              <Spinner />
            </p>
          ) : null}
          {3 === status ? (
            <p>
              <strong>Reason:</strong> {state.error}
            </p>
          ) : null}
          <Table>
            <tbody>
              <tr>
                <th>Sandbox mode</th>
                <td>OFF</td>
              </tr>
              {2 === status ? (
                <tr>
                  <th>Plagiarism check cost</th>
                  <td>{credits} credits</td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Container>
        <Button
          onClick={() => {
            if (1 === status) {
              if (
                confirm(
                  "Currently, credit check is in progress.\nAre you sure you want to cancel it and restart?"
                )
              )
                setState({ ...state, step: 1, status: 1 });
            } else setState({ ...state, step: 1, status: 1 });
          }}
        >
          Restart
        </Button>

        <Button
          onClick={() => {
            if (
              confirm(
                `Plagiarism check will cost you ${credits} credits?\nAre you sure you want to continue?`
              )
            )
              setState({ ...state, step: 3, status: 1 });
          }}
          disabled={2 === status ? false : true}
        >
          Check plagiarism
        </Button>
      </div>
    );
  }
}
