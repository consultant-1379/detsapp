import "../css/license.css";
import { useState, useLayoutEffect } from "react";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";

export default function License(props) {
  const {
    license,
    setLicenseId,
    setDialog,
    setLicenseData,
    setIsEdit,
    setOpenForm,
    setLicense,
    setOriginalList,
    user,
    formatDateDMY,
  } = props;
  const hexCode = {
    0: "#06CA06",
    1: "#FFA500",
    2: "#FF0800",
    3: "#000000",
  };
  const [open, setOpen] = useState(false);

  //count days left for expiryDate to display
  function countDaysLeft(date) {
    const today = new Date();
    const expiryDate = new Date(date);
    const diff = expiryDate.getTime() - today.getTime();
    const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
    return daysLeft + 1;
  }

  useLayoutEffect(() => {
    const ac = new AbortController();
    const daysLeft = countDaysLeft(license.expiryDate);
    setLicense((prev) => {
      return prev.map((l) => {
        if (l._id === license._id) {
          if (daysLeft < 0) {
            l.status = hexCode[3];
          } else if (daysLeft < 7) {
            l.status = hexCode[2];
          } else if (daysLeft < 14) {
            l.status = hexCode[1];
          } else if (daysLeft >= 14) {
            l.status = hexCode[0];
          }
        }
        return l;
      });
    });
    setOriginalList((prev) => {
      return prev.map((l) => {
        if (l._id === license._id) {
          if (daysLeft < 0) {
            l.status = hexCode[3];
          } else if (daysLeft < 7) {
            l.status = hexCode[2];
          } else if (daysLeft < 14) {
            l.status = hexCode[1];
          } else if (daysLeft >= 14) {
            l.status = hexCode[0];
          }
        }
        return l;
      });
    });

    if (!license.email) {
      axios.get(`/user/${license.creator}`).then((res) => {
        if (res.status !== 400) {
          setLicense((prev) => {
            return prev.map((l) => {
              if (l._id === license._id) {
                l.email = res.data.email;
              }
              return l;
            });
          });
          setOriginalList((prev) => {
            return prev.map((l) => {
              if (l._id === license._id) {
                l.email = res.data.email;
              }
              return l;
            });
          });
        } else {
          alert(res.data.error);
        }
      });
    }
    return () => {
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [license]);

  function handleEdit() {
    setIsEdit(true);
    setLicenseData(license);
    setOpenForm(true);
  }
  return (
    <div className="license-data-holder-div">
      <div className="license-data-div">
        <div className="license-data-name-div">
          <h2>{license.deploymentName}</h2>
          <span
            className="license-data-priority"
            style={{ backgroundColor: `${license.status && license.status}` }}
          />
          <span className="license-data-date">
            Created on: {formatDateDMY(license.dateOfCreation)}{" "}
          </span>
        </div>
        <div className="license-data-details-div">
          {countDaysLeft(license.expiryDate) >= 0 ? (
            <h3>
              {countDaysLeft(license.expiryDate) === 0
                ? "Expires Today"
                : `Expires in ${countDaysLeft(license.expiryDate)} days`}
            </h3>
          ) : (
            <h3>Expired</h3>
          )}
          {license.email && "Created By: " + license.email}
        </div>
      </div>
      <div className="license-data-pod">
        <h3>{license.podName}</h3>
      </div>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div style={{ position: "relative", zIndex: "1" }}>
          {user.licenseAdmin ? (
            <button
              className="license-more-btn"
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
                  setLicenseId(license._id);
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
