import "../css/bookingForm.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";

export default function BookingForm(props) {
  const {
    booking,
    user,
    setOpenForm,
    isEdit,
    setBookings,
    setBookingDetails,
    handleSubmit,
  } = props;

  const [autocomplete, setAutocomplete] = useState(false);
  const [searched, setSearched] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    if (!booking.creatorName) {
      axios
        .get(`/user/${booking.creator}`)
        .then((res) => {
          setBookingDetails((prev) => {
            return { ...prev, creatorName: res.data.username };
          });
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    }
    if (booking.spocDetails.length < booking.spocName.length)
      if (booking.spocName.length > 1) {
        const data = {
          ids: JSON.stringify(booking.spocName),
        };
        axios
          .get(`/user/multiple`, { params: data })
          .then((res) => {
            setBookingDetails((prev) => {
              return { ...prev, spocDetails: res.data };
            });
            setBookings((prev) => {
              return prev.map((data) => {
                if (data._id === booking._id) {
                  data.spocDetails = res.data;
                }
                return data;
              });
            });
          })
          .catch((err) => {
            alert(err.response.data.error);
          });
      }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking]);

  function updateState(e) {
    setBookingDetails({ ...booking, [e.target.name]: e.target.value });
  }
  function formatDate(date) {
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    let year = d.getFullYear();
    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }
    return [year, month, day].join("-");
  }

  //Search User with throttiling
  async function searchUser(e) {
    clearTimeout(timer.current);
    const char = e.target.value;
    const data = {
      char: char,
    };

    timer.current = setTimeout(async () => {
      if (char.trim().length > 0)
        await axios
          .get(`/user/search`, { params: data })
          .then((res) => {
            if (res.data.length > 0) setAutocomplete(true);
            else setAutocomplete(false);
            setSearched(res.data);
          })
          .catch((err) => {
            alert(err.response.data.error);
          });
      else setAutocomplete(false);
    }, 500);
  }

  function handleUpdateSpoc(data) {
    if (booking.spocName.includes(data._id)) {
      if (isEdit) {
        setBookingDetails((prev) => {
          return {
            ...prev,
            spocDetails: prev.spocDetails.filter(
              (spoc) => spoc.email !== data.email
            ),
            spocName: prev.spocName.filter((spoc) => spoc !== data._id),
          };
        });
        setBookings((prev) => {
          return prev.map((l) => {
            if (l._id === booking._id) {
              l.spocDetails = l.spocDetails.filter(
                (user) => user.email !== data.email
              );
              l.spocName = l.spocName.filter((id) => id !== data._id);
            }
            return l;
          });
        });
      } else {
        setBookingDetails((prev) => {
          return {
            ...prev,
            spocDetails: prev.spocDetails.filter(
              (user) => user.email !== data.email
            ),
            spocName: prev.spocName.filter((id) => id !== data._id),
          };
        });
      }
    } else {
      setBookingDetails((prev) => {
        return {
          ...prev,
          spocDetails: [...prev.spocDetails, data],
          spocName: [...prev.spocName, data._id],
        };
      });
    }
  }

  return (
    <div className="booking-form-main-div">
      <button
        className="update-form-close-btn"
        onClick={() => setOpenForm(false)}
      >
        <CloseIcon style={{ fontSize: "1vw" }} />
      </button>
      <div className="booking-form-title">
        {user.bookingAdmin ? (
          <h1>
            {isEdit ? "Edit " : "Create "}
            Booking
          </h1>
        ) : (
          <h1>View Booking</h1>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="booking-form-details-div">
          <div className="booking-form-details">
            <div className="left">
              <h2>Cloud Name</h2>
              <input
                type="text"
                value={booking.cloudName}
                readOnly={!user.bookingAdmin}
                name="cloudName"
                onChange={updateState}
                required
              />
            </div>
            <div className="middle">
              <h2>Status:</h2>
              <input
                type="text"
                value={isEdit ? booking.status : "To be discovered"}
                readOnly
                name="status"
                onChange={updateState}
              />
            </div>
            <div className="right">
              <h2>Creator:</h2>
              <input
                type="text"
                value={
                  isEdit
                    ? booking.creatorName && booking.creatorName
                    : user.username
                }
                readOnly
                name="creator"
                onChange={updateState}
              />
            </div>
          </div>
          <div className="booking-form-details">
            <div className="left">
              <h2>Environment Type:</h2>
              <input
                type="text"
                value={booking.environment}
                readOnly={!user.bookingAdmin}
                name="environment"
                required
                onChange={updateState}
              />
            </div>
            <div className="middle">
              <h2>Env Size:</h2>
              <input
                type="text"
                value={booking.envSize}
                readOnly={!user.bookingAdmin}
                name="envSize"
                onChange={updateState}
                required
              />
            </div>
            <div className="right">
              <h2>VPN:</h2>
              <input
                type="text"
                value={booking.vpn}
                readOnly={!user.bookingAdmin}
                name="vpn"
                onChange={updateState}
                required
              />
            </div>
          </div>
          <div className="booking-form-details">
            <div className="left">
              <h2>Preparation Date:</h2>
              <input
                type="date"
                value={formatDate(booking.prepDate)}
                readOnly={!user.bookingAdmin}
                name="prepDate"
                onChange={updateState}
                required
              />
            </div>
            <div className="middle">
              <h2>Start Date:</h2>
              <input
                type="date"
                value={formatDate(booking.startDate)}
                readOnly={!user.bookingAdmin}
                name="startDate"
                onChange={updateState}
                required
              />
            </div>
            <div className="right">
              <h2>End Date:</h2>
              <input
                type="date"
                value={formatDate(booking.endDate)}
                readOnly={!user.bookingAdmin}
                name="endDate"
                onChange={updateState}
                required
              />
            </div>
          </div>
          <div className="booking-form-details">
            <div className="booking-form-bottom">
              <h2>Team Name</h2>
              <input
                type="text"
                name="teamName"
                value={booking.teamName}
                readOnly={!user.bookingAdmin}
                onChange={updateState}
                id="teamName"
              />
            </div>
            <div className="booking-form-bottom">
              <h2>Ticket Number</h2>
              <input
                type="text"
                name="ticketNumber"
                value={booking.ticketNumber}
                readOnly={!user.bookingAdmin}
                onChange={updateState}
              />
            </div>
          </div>
          <div className="booking-form-spoc-div">
            <h2>SPOC Names</h2>
            <div style={{ position: "relative" }}>
              {user.bookingAdmin && (
                <input
                  type="text"
                  onInput={searchUser}
                  id="autocomplete"
                  autoComplete="off"
                  placeholder="Search..."
                />
              )}
              {autocomplete && (
                <div className="booking-form-autocomplete-div">
                  {searched.map((user) => {
                    return (
                      <div
                        key={user._id}
                        className="booking-form-autocomplete-div-item"
                        onClick={() => {
                          handleUpdateSpoc(user);
                          setAutocomplete(false);
                          setSearched([]);
                          document.getElementById("autocomplete").value = "";
                        }}
                      >
                        {user.email}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="booking-form-spoc">
              {booking.spocDetails &&
                booking.spocDetails.map((spoc) => {
                  return (
                    <Chip
                      key={spoc._id}
                      style={{
                        fontSize: "1.5vw",
                        margin: "0.5vw",
                        padding: "0.5vw",
                      }}
                      label={spoc.email}
                      onDelete={() => {
                        if (user.bookingAdmin) handleUpdateSpoc(spoc);
                      }}
                    />
                  );
                })}
            </div>
            <div>
              {user.bookingAdmin && (
                <input
                  type="submit"
                  className="booking-form-btn"
                  value={isEdit ? "Update" : "Create"}
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
