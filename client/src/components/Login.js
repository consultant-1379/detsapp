import { useLayoutEffect, useState } from "react";
import axios from "axios";
import "../css/login.css";
import { NavLink } from "react-router-dom";

export default function Login() {
  const ac = new AbortController();
  useLayoutEffect(() => {
    axios.post("/auth/").then((res) => {
      if (!res.data.redirect) {
        window.location.replace("/");
      }
    });
    return () => {
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function updateState(e) {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };
    await axios.post("/auth/login", data).then((res) => {
      if (res.data.redirect) {
        window.location.replace(res.data.redirect);
      }
      setError(res.data.error);
    });
  }
  return (
    <div className="login-main-div">
      <NavLink to="/register" hidden id="toRegister" />
      <div className="login-form-title">
        <h1>WELCOME</h1>
      </div>
      <div className="login-form-logo-holder">
        <div className="login-form-logo-div">
          <img
            src="https://www.confidentspeak.com/wp-content/uploads/2020/11/1200px-Ericsson_logo2.png"
            alt="logo"
          />
        </div>
      </div>
      <div className="login-form-div">
        <div className="login-form-error-msg">
          <h1>{error}</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-form-details">
            <input
              type="text"
              name="username"
              value={username}
              onChange={updateState}
              placeholder="Username"
            />
          </div>
          <div className="login-form-details password">
            <input
              type="password"
              name="password"
              value={password}
              onChange={updateState}
              placeholder="Password"
            />
          </div>
          <div className="login-form-submit-div">
            <input type="submit" value="LOGIN" />
            <input
              type="button"
              value="REGISTER"
              id="register"
              onClick={() => document.getElementById("toRegister").click()}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
