import "../css/updateForm.css";
import CloseIcon from "@mui/icons-material/Close";
export default function UpdateForm(props) {
  const {
    setLicenseData,
    licenseData,
    isEdit,
    handleSubmit,
    setOpenForm,
    user,
  } = props;
  //update licenseData
  function updateValue(e) {
    if (e.target.name === "deploymentName") {
      setLicenseData({ ...licenseData, deploymentName: e.target.value });
    } else if (e.target.name === "description") {
      setLicenseData({ ...licenseData, description: e.target.value });
    } else if (e.target.name === "expiryDate") {
      setLicenseData({ ...licenseData, expiryDate: e.target.value });
    } else if (e.target.name === "creationDate") {
      setLicenseData({ ...licenseData, dateOfCreation: e.target.value });
    } else if (e.target.name === "podName") {
      setLicenseData({ ...licenseData, podName: e.target.value });
    }
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

  return (
    <div className="update-form-div">
      <button
        className="update-form-close-btn"
        onClick={() => setOpenForm(false)}
      >
        <CloseIcon style={{ fontSize: "1vw" }} />
      </button>
      <div className="update-form-title">
        {user.licenseAdmin ? (
          <h1>{isEdit ? "Edit License" : "Create License"}</h1>
        ) : (
          <h1>View License</h1>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="update-form-input">
          <h2>Deployment Name</h2>
          <input
            readOnly={!user.licenseAdmin}
            required
            type="text"
            name="deploymentName"
            value={licenseData.deploymentName && licenseData.deploymentName}
            onChange={updateValue}
          />
        </div>
        <div className="update-form-input">
          <h2>Pod Name</h2>
          <input
            readOnly={!user.licenseAdmin}
            required
            type="text"
            name="podName"
            value={licenseData.podName && licenseData.podName}
            onChange={updateValue}
          />
        </div>
        <div className="update-form-input">
          <h2>Description</h2>
          <textarea
            readOnly={!user.licenseAdmin}
            name="description"
            value={licenseData.description && licenseData.description}
            onChange={updateValue}
          />
        </div>
        <div className="update-form-input date">
          <h2>Expiry Date</h2>
          <input
            required
            readOnly={!user.licenseAdmin}
            type="date"
            name="expiryDate"
            value={licenseData.expiryDate && formatDate(licenseData.expiryDate)}
            onChange={updateValue}
          />
        </div>
        <div className="update-form-input date">
          <h2>Creation Date</h2>
          <input
            required
            readOnly={!user.licenseAdmin}
            type="date"
            name="creationDate"
            value={
              licenseData.dateOfCreation &&
              formatDate(licenseData.dateOfCreation)
            }
            onChange={updateValue}
          />
        </div>
        <div className="update-form-submit-div">
          {user.licenseAdmin && (
            <input
              type="submit"
              value={isEdit ? "Update" : "Create"}
              id="update-form-btn"
            />
          )}
        </div>
      </form>
    </div>
  );
}
