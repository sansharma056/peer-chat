import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Room from "./Room";
import Home from "./Home";

const App = () => {
	return (
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
	);
};

export default App;
