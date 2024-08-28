import { useLayoutEffect, useState } from "react";
import axios from "axios";
import "../css/login.css";
import { NavLink } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useLayoutEffect(() => {
    const ac = new AbortController();
    axios.post("/auth/").then((res) => {
      if (!res.data.redirect) window.location.replace("/");
    });
    return () => {
      ac.abort();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
      email: email,
    };
    await axios.post("/auth/register", data).then((res) => {
      if (res.status === 400) {
        alert(res.data);
      } else if (res.data.error) {
        setError(res.data.error);
      } else {
        window.location.replace(res.data.redirect);
      }
    });
  }
  function updateState(e) {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    }
  }
  return (
    <div className="login-main-div">
      <NavLink to="/login" hidden id="toLogin" />
      <div className="login-form-title">
        <h1>REGISTRATION</h1>
      </div>
      <div className="login-form-logo-holder">
        <div className="login-form-logo-div">
          <img
            src="https://www.confidentspeak.com/wp-content/uploads/2020/11/1200px-Ericsson_logo2.png"
            alt="logo"
          />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="login-form-div">
          <div className="login-form-error-msg">
            <h3>{error}</h3>
          </div>
          <div className="login-form-details">
            <input
              type="text"
              name="username"
              value={username}
              onChange={updateState}
              placeholder="Username"
              required
            />
          </div>
          <div className="login-form-details regPass">
            <input
              type="password"
              name="password"
              value={password}
              onChange={updateState}
              placeholder="Password"
              required
            />
          </div>
          <div className="login-form-details regMail">
            <input
              type="email"
              name="email"
              value={email}
              onChange={updateState}
              placeholder="Email"
              required
            />
          </div>
        </div>
        <div className="login-form-submit-div">
          <input type="submit" value="Register" />
          <input
            type="button"
            value="Back To Login"
            id="register"
            onClick={() => document.getElementById("toLogin").click()}
          />
        </div>
      </form>
    </div>
  );
}
