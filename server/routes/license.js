const router = require("express").Router();
const License = require("../entities/license");
const licenseManager = require("../dbmanager/licenseManager");
const notificationManager = require("../dbmanager/notificationManager");

//get all licenses
router.get("/all", async (req, res) => {
  try {
    const licenses = await licenseManager.getAllLicenses();
    res.status(200).send(licenses);
  } catch (err) {
    res.status(400).send(err);
  }
});

//create new license
router.post("/", async (req, res) => {
  try {
    if (await licenseManager.getLicenseByName(req.body.deploymentName))
      return res.status(200).send({ error: "License already exists" });
    const license = new License.Builder()
      .setCreator(req.user._id)
      .setDescription(req.body.description)
      .setExpiryDate(new Date(req.body.expiryDate))
      .setDateOfCreation(new Date(req.body.dateOfCreation))
      .setDeploymentName(req.body.deploymentName)
      .build();
    const newLicense = await licenseManager.createNewLicense(license);
    res.status(200).send(newLicense);
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: "There was an error creating the license" });
  }
});

//get license by id
router.get("/:id", async (req, res) => {
  try {
    const license = await licenseManager.getLicenceById(req.params.id);
    res.status(200).send(license);
  } catch (err) {
    res.status(400).send(err);
  }
});

//update license by id
router.put("/:id", async (req, res) => {
  try {
    const check = await licenseManager.getLicenseByName(
      req.body.deploymentName
    );
    if (check && check._id.toString() !== req.params.id) {
      return res.status(200).send({ error: "License already exists" });
    }
    const updatedLicense = new License.Builder()
      .setCreator(req.body.creator)
      .setDateOfCreation(new Date(req.body.dateOfCreation))
      .setExpiryDate(new Date(req.body.expiryDate))
      .setDeploymentName(req.body.deploymentName)
      .setDescription(req.body.description)
      .setPodName(req.body.podName)
      .build();
    const license = await licenseManager.updateLicense(
      req.params.id,
      updatedLicense
    );
    res.status(200).send(license);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const license = await licenseManager.deleteLicense(req.params.id);
    await notificationManager.deleteAllNotificationByLicenseId(license._id);
    res.status(200).send(license);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
