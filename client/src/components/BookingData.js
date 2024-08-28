import "../css/bookingData.css";
import { useState, useEffect } from "react";
import axios from "axios";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function BookingData(props) {
  const {
    booking,
    setBookings,
    user,
    formatDateDMY,
    setBookingId,
    setDialog,
    setBookingDetails,
    setIsEdit,
    setOpenForm,
    setOriginalList,
  } = props;
  const [open, setOpen] = useState(false);
  const hexCode = {
    0: "#0081FD",
    1: "#15FA00",
    2: "#000000",
  };
  useEffect(() => {
    const ac = new AbortController();
    if (!booking.creatorName) {
      axios
        .get(`/user/${booking.creator}`)
        .then((res) => {
          setBookings((prev) => {
            return prev.map((data) => {
              if (data._id === booking._id) {
                data.creatorName = res.data.username;
              }
              return data;
            });
          });
          setOriginalList((prev) => {
            return prev.map((data) => {
              if (data._id === booking._id) {
                data.creatorName = res.data.username;
              }
              return data;
            });
          });
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    }
    if (!booking.spocDetails) {
      if (booking.spocName.length === 0) {
        setBookings((prev) => {
          return prev.map((data) => {
            if (data._id === booking._id) {
              data.spocDetails = [];
            }
            return data;
          });
        });
        setOriginalList((prev) => {
          return prev.map((data) => {
            if (data._id === booking._id) {
              data.spocDetails = [];
            }
            return data;
          });
        });
        return;
      }
      //fetch the first spoc name from the list of spocs for efficiency
      axios.get(`/user/${booking.spocName[0]}`).then((res) => {
        setBookings((prev) => {
          return prev.map((data) => {
            if (data._id === booking._id) {
              const temp = [];
              temp.push(res.data);
              data.spocDetails = temp;
            }
            return data;
          });
        });
        setOriginalList((prev) => {
          return prev.map((data) => {
            if (data._id === booking._id) {
              const temp = [];
              temp.push(res.data);
              data.spocDetails = temp;
            }
            return data;
          });
        });
      });
    }
    return () => {
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking]);
  function handleEdit() {
    setIsEdit(true);
    setBookingDetails(booking);
    setOpenForm(true);
  }
  function statusColor(status) {
    if (status === "Planned") return hexCode[0];
    else if (status === "Booked") return hexCode[1];
    else return hexCode[2];
  }

  return (
    <div className="booking-data-main-div">
      <div className="details cloudName">
        <span
          className="booking-status"
          style={{ background: statusColor(booking.status) }}
        ></span>
        <h3>{booking.cloudName}</h3>
      </div>
      <div className="details status">
        <h3>{booking.status}</h3>
      </div>
      <div className="details spoc">
        {booking.spocName.length > 0 ? (
          <h3>
            {booking.spocDetails && booking.spocDetails[0].email}
            {booking.spocName.length > 1 && ` +${booking.spocName.length - 1}`}
          </h3>
        ) : (
          <h3>No SPOCs</h3>
        )}
      </div>
      <div className="details env">
        <h3>{booking.environment}</h3>
      </div>
      <div className="details prepDate">
        <h3>{formatDateDMY(booking.prepDate)}</h3>
      </div>

      <div className="details startDate">
        <h3>{formatDateDMY(booking.startDate)}</h3>
      </div>

      <div className="details endDate">
        <h3>{formatDateDMY(booking.endDate)}</h3>
      </div>

      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div style={{ position: "relative", zIndex: "1" }}>
          {user.bookingAdmin ? (
            <button
              className="license-more-btn  booking-btn"
              onClick={(e) => {
                setOpen(!open);
              }}
            >
              <MoreHorizIcon style={{ fontSize: "1vw" }} />
            </button>
          ) : (
            <button className="license-more-btn view" onClick={handleEdit}>
              VIEW
            </button>
          )}
          {open && (
            <div className="license-more-option-div">
              <button className="license-option-btn" onClick={handleEdit}>
                {" "}
                EDIT/VIEW{" "}
              </button>
              <button
                className="license-option-btn"
                style={{ color: "red" }}
                onClick={() => {
                  setBookingId(booking._id);
                  setDialog(true);
                }}
              >
                DELETE
              </button>
            </div>
          )}
        </div>
      </ClickAwayListener>
    </div>
  );
}
