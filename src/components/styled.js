import styled, { css } from "styled-components";

export const Container = styled.div`
  min-height: 300px;
  border: 1px solid transparent;
  margin-bottom: 10px;
`;
export const Textarea = styled.textarea`
  display: block;
  width: 100%;
  height: 150px;
  padding: 10px;
  box-sizing: border-box;
  resize: vertical;
`;
export const Button = styled.button`
  padding: 8px 16px;
  margin: 3px;
`;
export const Table = styled.table`
  display: inline-block;
  margin-top: 20px;
  text-align: left;
`;
export const Heading = styled.h3`
  color: ${(props) => (props.success ? "green" : "red")};
`;
export const Label = styled.label`
  display: inline-block;
  margin: 0 20px 10px 0;
  cursor: pointer;
  font-weight: normal;
`;
export const Header = styled.div`
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid;
  text-align: left;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
`;
export const MenuItem = styled.a`
  display: inline-block;
  margin: 0 2px 0 0;
  padding: 5px 8px;
  text-decoration: none;
  color: ${(props) => (props.active ? "#fff" : "#551A8B")};
  background: ${(props) => (props.active ? "#888" : "initial")};
`;
