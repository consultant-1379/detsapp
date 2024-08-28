import "../css/profile.css";
import { useState, useLayoutEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Dialog from "@mui/material/Dialog";
import PasswordForm from "./PasswordForm";

export default function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [edit, setEdit] = useState(false);
  const [dialog, setDialog] = useState(false);

  useLayoutEffect(() => {
    const ac = new AbortController();
    axios.post("/auth/").then((res) => {
      if (res.data.redirect) window.location.replace(res.data.redirect);
      setUser(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
    });
    return () => {
      ac.abort();
    };
  }, []);

  function handleClick(e) {
    e.preventDefault();
    if (edit) {
      setUsername(user.username);
      setEmail(user.email);
    }
    setEdit(!edit);
  }

  async function updateInfo(e) {
    e.preventDefault();
    const data = {
      username: username,
      email: email,
    };
    await axios.put("/user/", data).then((res) => {
      if (!res.data.error) {
        setUser(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
        setEdit(false);
      } else alert(res.data.error);
    });
  }

  function updateState(e) {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    }
  }

  return (
    <div className="profile-main-div">
      <Navbar isHome={false} user={user} />
      <div className="profile-details-holder">
        <form onSubmit={updateInfo}>
          <div className="profile-details-div">
            <div className="profile-logo-div">
              <h1>PROFILE</h1>
            </div>
            <div className="profile-name-div name">
              <h2>Name</h2>
              <input
                type="text"
                name="username"
                value={username}
                disabled={!edit}
                autoFocus={!edit}
                onChange={updateState}
                required
              />
            </div>
            <div className="profile-name-div">
              <h2>Email</h2>
              <input
                type="text"
                name="email"
                value={email}
                disabled={!edit}
                autoFocus={!edit}
                required
                onChange={updateState}
              />
            </div>
            <div className="profile-btn-div">
              <button onClick={handleClick}>{edit ? "Cancel" : "Edit"}</button>
            </div>
            <div className="profile-btn-div pwd">
              <button onClick={() => setDialog(true)}>Change Password</button>
            </div>
            {edit && (
              <div className="profile-btn-div pwd">
                <input type="submit" value="Update" />
              </div>
            )}
          </div>
        </form>
      </div>

      <Dialog
        open={dialog}
        onClose={() => {
          setDialog(false);
        }}
        keepMounted={false}
        transitionDuration={0}
        maxWidth="100vw"
        PaperProps={{
          style: {
            borderRadius: "1vw",
            width: "40vw",
            height: "auto",
          },
        }}
      >
        <PasswordForm setDialog={setDialog} />
      </Dialog>
    </div>
  );
}
