import * as React from "react";
import ReactDOM from "react-dom";
import Main from "../src/components/containers/Main/index";
import GlobalArea from './components/GlobalArea';


const App = () => (
  <React.Fragment>
    <h1>HELOOOOOOOOOOOOOOOO</h1>
    <GlobalArea />
  </React.Fragment>
);

ReactDOM.render(<App />, document.getElementById("root"));
