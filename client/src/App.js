import { Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Booking from "./components/Booking";
import Request from "./components/Request";

export default function App() {
  return (
    <main>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/requests" component={Request}/>
        <Route path="/bookings" component={Booking} />
      </Switch>
    </main>
  );
}
