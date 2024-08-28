import { useLayoutEffect } from "react";
import axios from "axios";
import "../css/notification.css";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink } from "react-router-dom";

export default function Notification(props) {
  const {
    notification,
    setNotifications,
    formatDate,
    setOpenForm,
    setIsEdit,
    setLicenseData,
    isBooking,
    isLicense,
    setBookingDetails,
  } = props;

  useLayoutEffect(() => {
    const ac = new AbortController();
    if (!notification.data) {
      axios
        .get(
          notification.type === "license"
            ? `/license/${notification.dataId}`
            : `/booking/${notification.dataId}`
        )
        .then((res) => {
          setNotifications((prev) => {
            return prev.map((n) => {
              if (n._id === notification._id) {
                return { ...n, data: res.data };
              }
              return n;
            });
          });
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    }
    return () => {
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  async function handleDelete(e) {
    e.stopPropagation();
    await axios.delete(`/notification/${notification._id}`).then((res) => {
      if (res.status !== 400) {
        setNotifications((prev) => {
          return prev.filter((n) => n._id !== notification._id);
        });
      } else alert(res.data.error);
    });
  }

  function handleClick() {
    if (isBooking && notification.type === "license")
      document.getElementById("license").click();
    else if (isLicense && notification.type === "booking")
      document.getElementById("booking").click();
    setOpenForm(true);
    setIsEdit(true);
    if (isLicense) setLicenseData(notification.data);
    else
      setBookingDetails({
        ...notification.data,
        spocDetails: [],
        creatorName: "",
      });
  }
  return (
    <div className="noti-main-div" onClick={handleClick}>
      <NavLink to="/" hidden id="license" />
      <NavLink to="/bookings" hidden id="booking" />
      <button className="noti-main-delete-btn" onClick={handleDelete}>
        <CloseIcon style={{ fontSize: ".9vw" }} />
      </button>
      <span className="noti-type">{notification.type}</span>
      <div className="noti-main-desc">
        {notification.data && (
          <h3>
            {notification.type === "license"
              ? notification.data.deploymentName
              : notification.data.cloudName}
          </h3>
        )}
        <p>{notification.message}</p>
      </div>
      <span className="noti-main-exp">
        {formatDate(notification.dateOfCreation)}
      </span>
    </div>
  );
}
