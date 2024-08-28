import "../css/booking.css";
import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import BookingData from "./BookingData";
import BookingForm from "./BookingForm";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import NativeSelect from "@mui/material/NativeSelect";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export default function Booking() {
  const [originalList, setOriginalList] = useState([]);
  const [backup, setBackup] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [env, setEnv] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [team, setTeam] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [bookingDetails, setBookingDetails] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [user, setUser] = useState({});
  const ascend = useRef(false);
  const [pending, setPending] = useState(true);
  const sortType = useRef("cloudName");
  const envFilter = useRef("all");
  const statusFilter = useRef("all");
  const teamFilter = useRef("all");
  const monthMap = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  function formatDateDMY(date) {
    const today = new Date(parseInt(Date.parse(date), 10));
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    // return mm + '/' + dd + '/' + yyyy;
    return dd + " " + monthMap[mm] + " " + yyyy;
  }
  useLayoutEffect(() => {
    const ac = new AbortController();
    axios.post("/auth/").then((res) => {
      if (res.data.redirect) window.location.replace(res.data.redirect);
      setUser(res.data);
    });
    return () => {
      ac.abort();
    };
  }, []);
  useEffect(() => {
    const ac = new AbortController();
    if (user.username) {
      axios
        .get("/booking/all")
        .then((res) => {
          setBookings(res.data);
          setOriginalList(res.data);
          setBackup(res.data);
          //get unique env list
          const envList = res.data.map((data) => {
            return data.environment;
          });
          const uniqueEnvList = [...new Set(envList)];
          setEnv(uniqueEnvList);
          //get unique team name
          const teamList = res.data.map((data) => {
            return data.teamName;
          });
          const uniqueTeamList = [...new Set(teamList)];
          setTeam(uniqueTeamList);
        })
        .catch((err) => {
          alert(err.reponse.data.error);
        });
      if (user.bookingAdmin)
        axios
          .get("/notification/all",{params:{type:"booking"}})
          .then((res) => {
            setNotifications(res.data);
          })
          .catch((err) => {
            alert(err.response.data.error);
          });
      if (!user.bookingAdmin)
        axios
          .get(`/request/${user._id}`)
          .then((res) => {
            if (res.data.length <= 1) {
              if (res.data.length === 0 || res.data[0].type === "license") {
                setPending(false);
              }
            }
          })
          .catch((err) => {
            alert(err.reponse.data.error);
          });
    }
    return () => {
      ac.abort();
    };
  }, [user]);

  async function deleteBooking() {
    await axios
      .delete(`/booking/${bookingId}`)
      .then((res) => {
        setBookings((prev) => {
          return prev.filter((booking) => {
            return booking._id !== bookingId;
          });
        });
        setOriginalList((prev) => {
          return prev.filter((booking) => {
            return booking._id !== bookingId;
          });
        });
        setDialog(false);
        setBookingId("");
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // if (
    //   new Date(bookingDetails.prepDate) < new Date() ||
    //   new Date(bookingDetails.startDate) < new Date() ||
    //   new Date(bookingDetails.endDate) < new Date()
    // ) {
    //   alert("Any dates must be in the future");
    //   return;
    // }
    if (
      bookingDetails.startDate > bookingDetails.endDate ||
      bookingDetails.prepDate > bookingDetails.startDate
    ) {
      alert("Please choose a valid timeline for dates");
      return;
    }
    const temp = { ...bookingDetails };
    if(new Date() > new Date(temp.endDate)){
      temp.status= "Rejected/Closed";
    }
    else if(new Date() > new Date(temp.startDate)){
      temp.status= "Booked";
    }
    else{
      temp.status = "Planned";
    }
    if (isEdit) {
      await axios
        .put(`/booking/${bookingDetails._id}`, temp)
        .then((res) => {
          setBookings((prev) => {
            return prev.map((data) => {
              if (data._id === bookingDetails._id) {
                data = res.data;
              }
              return data;
            });
          });
          setOpenForm(false);
          setBookingId("");
          setIsEdit(false);
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    } else {
      await axios
        .post("/booking/", temp)
        .then((res) => {
          setBookings((prev) => {
            return [...prev, res.data];
          });
          setOpenForm(false);
          setBookingId("");
          setIsEdit(false);
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    }
  }
  function searchBooking(e) {
    let clone = [...backup];
    clone = clone.filter((data) => {
      return data.cloudName
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setBookings(clone);
  }

  function sortArray(arr) {
    arr.sort((a, b) => {
      if (sortType.current === "cloudName") {
        if (ascend.current) return a.cloudName.localeCompare(b.cloudName);
        return b.cloudName.localeCompare(a.cloudName);
      } else if (sortType.current === "prepDate") {
        if (ascend.current) return a.prepDate.localeCompare(b.prepDate);
        return b.prepDate.localeCompare(a.prepDate);
      } else if (sortType.current === "startDate") {
        if (ascend.current) return a.startDate.localeCompare(b.startDate);
        return b.startDate.localeCompare(a.startDate);
      } else if (sortType.current === "endDate") {
        if (ascend.current) return a.endDate.localeCompare(b.endDate);
        return b.endDate.localeCompare(a.endDate);
      }

      return 0;
    });
    return arr;
  }

  function sortBooking(e) {
    let clone = [...bookings];
    sortType.current = e.target.value;
    clone = sortArray(clone);
    setBookings(clone);
    setBackup(clone);
  }
  function sortAscending() {
    ascend.current = !ascend.current;
    let clone = [...bookings];
    clone = sortArray(clone);
    setBookings(clone);
    setBackup(clone);
  }
  function filterBooking(e) {
    let clone = [...originalList];
    if (e.target.name === "status") statusFilter.current = e.target.value;
    else if (e.target.name === "environment")
      envFilter.current = e.target.value;
    else if (e.target.name === "teamName") teamFilter.current = e.target.value;
    if (
      statusFilter.current !== "all" ||
      envFilter.current !== "all" ||
      teamFilter.current !== "all"
    ) {
      clone = clone.filter((data) => {
        if (statusFilter.current === "all") {
          if (teamFilter.current === "all")
            return data.environment === envFilter.current;
          else if (envFilter.current === "all")
            return data.teamName === teamFilter.current;
          return (
            data.teamName === teamFilter.current &&
            data.environment === envFilter.current
          );
        } else if (envFilter.current === "all") {
          if (teamFilter.current === "all")
            return data.status === statusFilter.current;
          else if (statusFilter.current === "all")
            return data.teamName === teamFilter.current;
          return (
            data.status === statusFilter.current &&
            data.teamName === teamFilter.current
          );
        } else if (teamFilter.current === "all") {
          if (statusFilter.current === "all")
            return data.environment === envFilter.current;
          else if (envFilter.current === "all")
            return data.status === statusFilter.current;
          return (
            data.status === statusFilter.current &&
            data.environment === envFilter.current
          );
        } else
          return (
            data.status === statusFilter.current &&
            data.environment === envFilter.current &&
            data.teamName === teamFilter.current
          );
      });
    }
    clone = sortArray(clone);
    setBookings(clone);
    setBackup(clone);
  }
  async function requestAccess() {
    if (pending) return;
    const data = {
      type: "booking",
    };
    await axios
      .post("/request/", data)
      .then((res) => {
        setPending(true);
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  }

  function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  function formatDate(date) {
    const today = new Date();
    const newDate = new Date(parseInt(Date.parse(date), 10));
    let diffInDay = dateDiffInDays(newDate, today);
    if (diffInDay === 0) {
      return "today";
    } else {
      if (diffInDay >= 7) {
        return `${Math.floor(diffInDay / 7)} weeks ago`;
      } else {
        return `${diffInDay} days ago`;
      }
    }
  }
  return (
    <div>
      <Navbar
        user={user}
        isLicense={false}
        isBooking={true}
        searchBooking={searchBooking}
        notifications={notifications}
        setNotifications={setNotifications}
        setOpenForm={setOpenForm}
        setIsEdit={setIsEdit}
        setBookingDetails={setBookingDetails}
        formatDate={formatDate}
      />
      <div className="booking-main-div">
        <div className="booking-list-div">
          <div className="booking-list-util-div">
            <h2>Sort By:</h2>
            <NativeSelect onChange={sortBooking} style={{ fontSize: ".8vw" }}>
              <option value="cloudName" style={{ textAlign: "center" }}>
                Cloud Name
              </option>
              <option value="prepDate" style={{ textAlign: "center" }}>
                Preparation Date
              </option>
              <option value="startDate" style={{ textAlign: "center" }}>
                Start Date
              </option>
              <option value="endDate" style={{ textAlign: "center" }}>
                End Date
              </option>
            </NativeSelect>
            <IconButton
              onClick={sortAscending}
              style={{ height: "2vw", width: "2vw", marginLeft: "1vw" }}
            >
              {ascend.current ? (
                <ArrowDownwardIcon style={{ fontSize: "1.5vw" }} />
              ) : (
                <ArrowUpwardIcon style={{ fontSize: "1.5vw" }} />
              )}
            </IconButton>
            <div className="home-license-sort-div booking-filter">
              <h2>Status:</h2>
              <NativeSelect
                onChange={filterBooking}
                style={{ fontSize: ".8vw" }}
                name="status"
              >
                <option value="all" style={{ textAlign: "center" }}>
                  All
                </option>
                <option value="Planned" style={{ textAlign: "center" }}>
                  Planned
                </option>
                <option value="Booked" style={{ textAlign: "center" }}>
                  Booked
                </option>
                <option value="Rejected/Closed" style={{ textAlign: "center" }}>
                  Rejected / Closed
                </option>
              </NativeSelect>
            </div>
            <div className="home-license-sort-div booking-filter">
              <h2>Environment</h2>
              <NativeSelect
                onChange={filterBooking}
                style={{ fontSize: ".8vw" }}
                name="environment"
              >
                <option value="all" style={{ textAlign: "center" }}>
                  All
                </option>
                {env.map((p) => {
                  return (
                    <option key={p} value={p} style={{ textAlign: "center" }}>
                      {p}
                    </option>
                  );
                })}
              </NativeSelect>
            </div>
            <div className="home-license-sort-div booking-filter">
              <h2>Team Name</h2>
              <NativeSelect
                onChange={filterBooking}
                style={{ fontSize: ".8vw" }}
                name="teamName"
              >
                <option value="all" style={{ textAlign: "center" }}>
                  All
                </option>
                {team.map((p) => {
                  return (
                    <option key={p} value={p} style={{ textAlign: "center" }}>
                      {p === "" ? "No Team" : p}
                    </option>
                  );
                })}
              </NativeSelect>
            </div>
            {user.bookingAdmin ? (
              <button
                className="home-license-create-btn booking-request-btn"
                onClick={() => {
                  setOpenForm(true);
                  setBookingDetails({
                    creator: user._id,
                    cloudName: "",
                    prepDate: new Date(),
                    startDate: new Date(),
                    endDate: new Date(),
                    teamName: "",
                    environment: "",
                    status: "",
                    spocName: [],
                    spocDetails: [],
                    creatorName: "",
                    vpn: "",
                    envSize: "",
                    ticketNumber: "",
                  });
                  setIsEdit(false);
                }}
              >
                Create Booking
              </button>
            ) : (
              <button
                className="home-license-create-btn booking-request-btn"
                onClick={requestAccess}
              >
                {pending ? "Pending" : "Request As Admin"}
              </button>
            )}
          </div>
          <div className="booking-list-title">
            <div className="details title-cloudName">
              <h2>Cloud Name</h2>
            </div>
            <div className="details title-status">
              <h2>Status</h2>
            </div>
            <div className="details title-spoc">
              <h2>SPOCs</h2>
            </div>
            <div className="details title-env">
              <h2>Env Type</h2>
            </div>
            <div className="details title-prepDate">
              <h2>Prep Date</h2>
            </div>
            <div className="details title-startDate">
              <h2>Start Date</h2>
            </div>
            <div className="details title-endDate">
              <h2>End Date</h2>
            </div>
          </div>
          {bookings.map((booking) => {
            return (
              <BookingData
                key={booking._id}
                booking={booking}
                setBookings={setBookings}
                user={user}
                formatDateDMY={formatDateDMY}
                setBookingId={setBookingId}
                setBookingDetails={setBookingDetails}
                setOpenForm={setOpenForm}
                setIsEdit={setIsEdit}
                setDialog={setDialog}
                setOriginalList={setOriginalList}
              />
            );
          })}
        </div>
        <Dialog
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setIsEdit(false);
          }}
          keepMounted={false}
          transitionDuration={0}
          maxWidth="100vw"
          PaperProps={{
            style: {
              borderRadius: "1vw",
              width: "90vw",
              height: "auto",
              padding: "1vw",
            },
          }}
        >
          <BookingForm
            booking={bookingDetails}
            setBookingDetails={setBookingDetails}
            user={user}
            isEdit={isEdit}
            setOpenForm={setOpenForm}
            setBookings={setBookings}
            handleSubmit={handleSubmit}
          />
        </Dialog>

        <Dialog
          open={dialog}
          onClose={() => {
            setDialog(false);
            setBookingId("");
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete this booking?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this booking?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDialog(false);
                setBookingId("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={deleteBooking} style={{ color: "red" }}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
