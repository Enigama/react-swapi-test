import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";

import Routes from "./routes";
import Header from "./components/header/header";

import "./index.sass";

const App = () => {
	return (
		<Router>
			<Header/>
			<Routes/>
		</Router>
	);
};
ReactDOM.render(<App/>, document.getElementById("root"));
