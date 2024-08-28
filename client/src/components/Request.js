import Navbar from "./Navbar";
import axios from "axios";
import "../css/request.css";
import RequestData from "./RequestData";
import { useState, useLayoutEffect } from "react";

export default function Request() {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState({});

  useLayoutEffect(() => {
    const ac = new AbortController();
    axios.post("/auth/").then((res) => {
      if (res.data.redirect) window.location.replace(res.data.redirect);
      if (!res.data.licenseAdmin || !res.data.bookingAdmin)
        window.location.replace("/");

      setUser(res.data);
    });
    return () => {
      ac.abort();
    };
  }, []);

  useLayoutEffect(() => {
    axios.get("/request/all").then((res) => {
      if (res.status !== 200) {
        alert(res.request.data.error);
        return;
      }
      setRequests(res.data);
    });
  }, [user]);

  return (
    <div className="request-main-div">
      <Navbar isHome={false} user={user} />
      <div className="request-list-div">
        <div className="request-list-title">
          <h1>Request Access</h1>
        </div>
        <div className="request-list-data-scrollable">
          {requests.map((request) => {
            return (
              <RequestData
                key={request._id}
                request={request}
                setRequests={setRequests}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
