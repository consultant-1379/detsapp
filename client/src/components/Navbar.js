import { NavLink } from "react-router-dom";
import "../css/navBar.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import { ClickAwayListener } from "@mui/base";
import Notification from "./Notification";
import axios from "axios";
export default function Navbar(props) {
  const {
    notifications,
    setNotifications,
    setOpenForm,
    setIsEdit,
    setLicenseData,
    searchLicense,
    searchBooking,
    formatDate,
    isLicense,
    isBooking,
    setBookingDetails,
    user,
  } = props;
  const [open, setOpen] = useState(false);
  async function deleteAllNotification() {
    await axios.delete("/notification/all").then((res) => {
      if (res.status !== 400) {
        setNotifications((prev) => {
          return [];
        });
      } else alert(res.data.error);
    });
  }
  return (
    <div className="nav-main-div">
      <NavLink to="/" hidden id="logo-click" />
      <div
        className="nav-logo-div"
        onClick={() => document.getElementById("logo-click").click()}
      >
        <img
          src="https://d24wuq6o951i2g.cloudfront.net/img/events/id/340/3401150/assets/390.ERI_horizontal_RGB.png"
          alt="logo"
        />
      </div>
      <div className="nav-option-div">
        <NavLink to="/" className="nav-option">
          Licenses
        </NavLink>
        <NavLink to="/bookings" className="nav-option">
          Bookings
        </NavLink>
        <NavLink to="/profile" className="nav-option">
          Profile
        </NavLink>
        {(user.licenseAdmin || user.bookingAdmin) && (
          <NavLink to="/requests" className="nav-option">
            Requests
          </NavLink>
        )}
      </div>
      {(isLicense || isBooking) && (
        <div className="nav-util-div">
          <input
            type="search"
            onInput={isLicense ? searchLicense : searchBooking}
            className="nav-option-searchbar"
            placeholder="Search..."
          />

          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div style={{ position: "relative" }}>
              {(user.licenseAdmin || user.bookingAdmin) && (
                <button onClick={() => setOpen(!open)} className="noti-btn">
                  <NotificationsIcon style={{ fontSize: "1.5vw" }} />
                </button>
              )}
              {open && (
                <div className="nav-notification-list-div">
                  <div className="nav-notification-list-title">
                    <h2>Notification</h2>
                    {notifications.length > 0 && (
                      <button
                        className="nav-notification-clear-btn"
                        onClick={deleteAllNotification}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="nav-notification-list-scrollable">
                    {notifications.map((notification) => {
                      return (
                        <Notification
                          key={notification._id}
                          notification={notification}
                          setNotifications={setNotifications}
                          formatDate={formatDate}
                          setOpenForm={setOpenForm}
                          setIsEdit={setIsEdit}
                          setLicenseData={setLicenseData}
                          isLicense={isLicense}
                          isBooking={isBooking}
                          setBookingDetails={setBookingDetails}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ClickAwayListener>
        </div>
      )}
      <div className="nav-logout-div">
        <form action="/auth/logout" method="POST" className="nav-logout-form">
          <input type="submit" value="Logout" className="nav-logout-btn" />
        </form>
      </div>
    </div>
  );
}
