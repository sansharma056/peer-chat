import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DocumentTitle from "react-document-title";

import Room from "./Room";
import Home from "./Home";
import { StrictMode } from "react";

const App = () => {
	return (
	<StrictMode>
	<DocumentTitle title="PeerChat">
		<Router>
			<Switch>
				<Route path="/:id">
					<Room />
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</Router>
		</DocumentTitle>
	</StrictMode>
	);
};

export default App;
