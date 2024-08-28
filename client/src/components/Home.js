import axios from "axios";
import { useLayoutEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import UpdateForm from "./UpdateForm";
import License from "./License";
import "../css/home.css";
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

export default function Home() {
  const ascend = useRef(false);
  const statusFilter = useRef("all");
  const podFilter = useRef("all");
  const sortType = useRef("creationDate");
  const [user, setUser] = useState({});
  const [originalList, setOriginalList] = useState([]);
  const [backup, setBackup] = useState([]);
  const [license, setLicense] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [licenseId, setLicenseId] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pending, setPending] = useState(true);
  const [pod, setPod] = useState([]);
  const [licenseData, setLicenseData] = useState({
    deploymentName: "",
    expiryDate: "",
    description: "",
    dateOfCreation: "",
    podName: "",
  });
  const [notifications, setNotifications] = useState([]);
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
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

  //retrieving all data from the database
  useLayoutEffect(() => {
    const ac = new AbortController();
    if (user.username) {
      axios.get("/license/all").then((res) => {
        if (res.status !== 400) {
          setLicense(res.data);
          setOriginalList(res.data);
          //set unique pod names
          const podNames = res.data.map((l) => l.podName);
          const uniquePodNames = [...new Set(podNames)];
          setPod(uniquePodNames);
        } else alert(res.data.error);
      });
      axios
        .get("/notification/all", { params: { type: "license" } })
        .then((res) => {
          if (res.status !== 400) {
            setNotifications(res.data);
          } else {
            alert(res.data.error);
          }
        });
      axios
        .get(`/request/${user._id}`)
        .then((res) => {
          if (res.data.length <= 1) {
            if (res.data.length === 0 || res.data[0].type === "booking") {
              setPending(false);
            }
          }
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    }
    return () => {
      ac.abort();
    };
  }, [user]);

  //delete license
  async function deleteLicense() {
    await axios.delete(`/license/${licenseId}`).then((res) => {
      if (res.status !== 400) {
        setLicense((prev) => {
          return prev.filter((l) => l._id !== licenseId);
        });
        setOriginalList((prev) => {
          return prev.filter((l) => l._id !== licenseId);
        });
        setDialog(false);
        setLicenseId("");
      }
    });
  }

  //search for license by name locally
  function searchLicense(e) {
    let clone = [...backup];
    clone = clone.filter(
      (l) =>
        l.deploymentName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        l.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setLicense(clone);
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
  function formatDateDMY(date) {
    const today = new Date(parseInt(Date.parse(date), 10));
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    // return mm + '/' + dd + '/' + yyyy;
    return dd + " " + monthMap[mm] + " " + yyyy;
  }

  function sortArray(arr) {
    arr.sort((a, b) => {
      if (ascend.current) {
        if (sortType.current === "name") {
          return a.deploymentName.localeCompare(b.deploymentName);
        } else if (sortType.current === "expiryDate") {
          return a.expiryDate.localeCompare(b.expiryDate);
        } else if (sortType.current === "creationDate") {
          return a.dateOfCreation.localeCompare(b.dateOfCreation);
        } else if (sortType.current === "podName") {
          return a.podName.localeCompare(b.podName);
        }
        return 0;
      } else {
        if (sortType.current === "name") {
          return b.deploymentName.localeCompare(a.deploymentName);
        } else if (sortType.current === "expiryDate") {
          return b.expiryDate.localeCompare(a.expiryDate);
        } else if (sortType.current === "creationDate") {
          return b.dateOfCreation.localeCompare(a.dateOfCreation);
        } else if (sortType.current === "podName") {
          return b.podName.localeCompare(a.podName);
        }
        return 0;
      }
    });

    return arr;
  }

  //sort license
  function sortLicense(e) {
    let clone = [...license];
    sortType.current = e.target.value;
    clone = sortArray(clone);
    setLicense(clone);
    setBackup(clone);
  }

  //sort ascending or descending
  function sortAscending() {
    ascend.current = !ascend.current;
    let clone = [...license];
    clone = sortArray(clone);
    setLicense(clone);
    setBackup(clone);
  }

  async function requestAccess() {
    if (pending) return;
    const data = {
      type: "license",
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

  function filterLicense(e) {
    let clone = [...originalList];
    if (e.target.name === "status") {
      statusFilter.current = e.target.value;
    } else if (e.target.name === "pods") {
      podFilter.current = e.target.value;
    }
    if (statusFilter.current !== "all" || podFilter.current !== "all") {
      clone = clone.filter((l) => {
        if (statusFilter.current === "all") {
          return l.podName === podFilter.current;
        } else if (podFilter.current === "all") {
          return l.status === statusFilter.current;
        } else
          return (
            l.status === statusFilter.current && l.podName === podFilter.current
          );
      });
    }
    clone = sortArray(clone);
    setLicense(clone);
    setBackup(clone);
  }

  //update license
  async function handleSubmit(e) {
    e.preventDefault();
    //check if expiry date is later than today
    if (new Date(licenseData.expiryDate) < new Date()) {
      alert("Expiry date must be later than today");
      return;
    }
    if (new Date(licenseData.datOfCreation) > new Date()) {
      alert("Creation date must be earlier than today");
      return;
    }
    if (isEdit) {
      await axios
        .put(`/license/${licenseData._id}`, licenseData)
        .then((res) => {
          if (!res.data.error) {
            setLicense((prev) => {
              let temp = [];
              prev.forEach((l) => {
                if (l._id === licenseData._id) {
                  temp.push(licenseData);
                } else {
                  temp.push(l);
                }
              });
              return temp;
            });
            setOriginalList((prev) => {
              let temp = [];
              prev.forEach((l) => {
                if (l._id === licenseData._id) {
                  temp.push(licenseData);
                } else {
                  temp.push(l);
                }
              });
              return temp;
            });
            setDialog(false);
            setOpenForm(false);
          } else {
            alert(res.data.error);
          }
        });
    } else {
      await axios.post("/license/", licenseData).then((res) => {
        if (!res.data.error) {
          setLicense((prev) => {
            return [res.data, ...prev];
          });
          setOriginalList((prev) => {
            return [res.data, ...prev];
          });
          setDialog(false);
          setOpenForm(false);
        } else {
          alert(res.data.error);
        }
      });
    }
  }
  return (
    <div>
      <Navbar
        notifications={notifications}
        setNotifications={setNotifications}
        setOpenForm={setOpenForm}
        setIsEdit={setIsEdit}
        setLicenseData={setLicenseData}
        searchLicense={searchLicense}
        formatDate={formatDate}
        isLicense={true}
        isBooking={false}
        user={user}
      />
      <div className="home-license-title">
        <div className="home-license-title-holder">
          <div className="home-license-sort-div">
            <h2>Sort By:</h2>
            <NativeSelect onChange={sortLicense} style={{ fontSize: ".8vw" }}>
              <option value="creationDate" style={{ textAlign: "center" }}>
                Created Date
              </option>
              <option value="name" style={{ textAlign: "center" }}>
                Deployment Name
              </option>
              <option value="expiryDate" style={{ textAlign: "center" }}>
                Expiry Date
              </option>
              <option value="podName" style={{ textAlign: "center" }}>
                Pod Name
              </option>
            </NativeSelect>
            <IconButton
              onClick={sortAscending}
              style={{ height: "2vw", width: "2vw" }}
            >
              {ascend.current ? (
                <ArrowDownwardIcon style={{ fontSize: "1.5vw" }} />
              ) : (
                <ArrowUpwardIcon style={{ fontSize: "1.5vw" }} />
              )}
            </IconButton>
          </div>
          <div className="home-license-sort-div">
            <h2>Filters:</h2>
            <NativeSelect
              onChange={filterLicense}
              style={{ fontSize: ".8vw" }}
              name="status"
            >
              <option value="all" style={{ textAlign: "center" }}>
                All
              </option>
              <option value="#06CA06" style={{ textAlign: "center" }}>
                Green Status
              </option>
              <option value="#FFA500" style={{ textAlign: "center" }}>
                Orange Status
              </option>
              <option value="#FF0800" style={{ textAlign: "center" }}>
                Red Status
              </option>
              <option value="#000000" style={{ textAlign: "center" }}>
                Expired
              </option>
            </NativeSelect>
          </div>
          <div className="home-license-sort-div">
            <h2>Pod:</h2>
            <NativeSelect
              onChange={filterLicense}
              style={{ fontSize: ".8vw" }}
              name="pods"
            >
              <option value="all" style={{ textAlign: "center" }}>
                All
              </option>
              {pod.map((p) => {
                return (
                  <option key={p} value={p} style={{ textAlign: "center" }}>
                    {p}
                  </option>
                );
              })}
            </NativeSelect>
          </div>
        </div>
        {user.licenseAdmin ? (
          <button
            className="home-license-create-btn"
            onClick={() => {
              setOpenForm(true);
              setLicenseData({
                deploymentName: "",
                expiryDate: "",
                description: "",
                dateOfCreation: "",
                podName: "",
              });
              setIsEdit(false);
            }}
          >
            Create License
          </button>
        ) : (
          <button className="home-license-create-btn" onClick={requestAccess}>
            {pending ? "Pending" : "Request As Admin"}
          </button>
        )}
      </div>
      <div>
        <div className="license-data-holder-div home">
          <div style={{ fontSize: "1vw" }}>
            <h2>Deployment</h2>
          </div>
          <div className="title-time">
            <h2>Time Left</h2>
          </div>
          <div className="title-pod">
            <h2>Pod</h2>
          </div>
        </div>
        {license.map((license) => (
          <License
            key={license._id}
            user={user}
            license={license}
            setLicenseId={setLicenseId}
            setDialog={setDialog}
            setLicenseData={setLicenseData}
            setIsEdit={setIsEdit}
            setOpenForm={setOpenForm}
            setLicense={setLicense}
            setOriginalList={setOriginalList}
            formatDateDMY={formatDateDMY}
          />
        ))}
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
            width: "40vw",
            height: "auto",
          },
        }}
      >
        <UpdateForm
          isEdit={isEdit}
          licenseData={licenseData}
          setLicenseData={setLicenseData}
          handleSubmit={handleSubmit}
          setOpenForm={setOpenForm}
          user={user}
        />
      </Dialog>

      <Dialog
        open={dialog}
        onClose={() => {
          setDialog(false);
          setLicenseId("");
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this license?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this license?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialog(false);
              setLicenseId("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={deleteLicense} style={{ color: "red" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
