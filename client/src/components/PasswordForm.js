import axios from "axios";
import { useState } from "react";
import "../css/passwordForm.css";

export default function PasswordForm(props) {
  const { setDialog } = props;

  //update user password
  async function updatePassword(e) {
    e.preventDefault();
    if (
      document.getElementById("new").value !==
      document.getElementById("confirm").value
    ) {
      alert("Passwords do not match");
      return;
    }
    const data = {
      old: document.getElementById("old").value,
      new: document.getElementById("new").value,
    };
    await axios.put("/user/password", data).then((res) => {
      if (!res.data.error) {
        alert("Password updated successfully");
        setDialog(false);
      } else alert(res.data.error);
    });
  }

  return (
    <div className="password-form-div">
      <div className="password-form-title">
        <h1>Change Password</h1>
      </div>
      <div className="password-form-input-div">
        <input type="password" placeholder="Old Password" name="old" id="old" />
        <input type="password" placeholder="New Password" name="new" id="new" />
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirm"
          id="confirm"
        />
      </div>
      <div className="password-form-btn-div">
        <button onClick={updatePassword}>Change Password</button>
        <button onClick={() => setDialog(false)}>Cancel</button>
      </div>
    </div>
  );
}
