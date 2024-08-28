import axios from "axios";
import "../css/request.css";
import { useEffect } from "react";

export default function RequestData(props) {
  const { request, setRequests } = props;

  useEffect(() => {
    const ac = new AbortController();
    axios.get(`/user/${request.senderId}`).then((res) => {
      if (res.status !== 200) {
        alert(res.request.data.error);
        return;
      }
      setRequests((prev) => {
        return prev.map((l) => {
          if (l._id === request._id) {
            l.sender = res.data;
          }
          return l;
        });
      });
    });
    return () => {
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  async function sendResponse(e) {
    let data = { ...request, approve: false };
    if (e.target.name === "accept") {
      data.approve = true;
    }
    await axios
      .delete(`/request/${request._id}`, { data })
      .then((res) => {
        setRequests((prev) => {
          return prev.filter((l) => {
            return l._id !== request._id;
          });
        });
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  }

  return (
    <div className="request-data-div">
      <div className="request-data-desc-div">
        <p>
          <strong>{request.sender && request.sender.username}</strong> has
          requested to access as admin for {request.type} page
        </p>
      </div>
      <div className="request-data-btn-div">
        <button
          className="request-data-btn accept"
          name="accept"
          onClick={sendResponse}
        >
          Accept
        </button>
        <button
          className="request-data-btn decline"
          name="decline"
          onClick={sendResponse}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
