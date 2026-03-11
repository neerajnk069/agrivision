const express = require("express");
const router = express.Router();
const authController = require("../controller/Website/authController");
const agricultureImageListController = require("../controller/Website/agricultureImageListController");

router.post("/signup", authController.signup);
router.get(
  "/agricultureImagesList",
  agricultureImageListController.listAgricultureImages,
);

router.get(
  "/agricultureImagesView/:id",
  agricultureImageListController.viewAgricultureImage,
);

module.exports = router;
