// import './App.css';
// import MCCView from "./Chronos";
// import CrewView from "./CrewView";
import UserSelect from "./UserInput";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <UserSelect />
        </Route>
        {/* <Route exact path="/crew">
          <CrewView />
        </Route> */}
        {/* <Route exact path="/chronos">
          <MCCView />
        </Route> */}
      </Switch>
    </Router>

  );
}

export default App;
