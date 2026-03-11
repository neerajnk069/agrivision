var express = require("express");
var router = express.Router();
const auth = require("../controller/admincontroller/authcontroller");
const authtoken = require("../middleware/authtoken");
const usercontroller = require("../controller/admincontroller/usercontroller");
const contactUsController = require("../controller/admincontroller/contactUsController");
const cmsController = require("../controller/admincontroller/cmsController");
const faqController = require("../controller/admincontroller/faqController");
const newsController = require("../controller/admincontroller/newsController");
const servicesController = require("../controller/admincontroller/serviceController");
const agricultureController = require("../controller/admincontroller/agricultureListingController");
const agricultureImageListController = require("../controller/admincontroller/agricultureImageListController");
router.post("/login", auth.login);
router.get("/profile", authtoken.verifyToken, auth.profile);
router.post("/updateprofile", authtoken.verifyToken, auth.edit_profile);
router.post("/updatepassword", authtoken.verifyToken, auth.reset_password);
router.post("/logout", authtoken.verifyToken, auth.logout);
router.get("/dashboard", authtoken.verifyToken, auth.dashboard);
router.get("/chart", authtoken.verifyToken, auth.chartData);

// router for users
router.get("/userdetail/:id", authtoken.verifyToken, usercontroller.userDetail);
router.post("/userstatus", authtoken.verifyToken, usercontroller.userStatus);
router.post(
  "/userdelete/:id",
  authtoken.verifyToken,
  usercontroller.userDelete,
);
router.get("/userlist", authtoken.verifyToken, usercontroller.userList);
// router for Agent

router.get("/providerlist", authtoken.verifyToken, usercontroller.providerList);

//=============agricultureImagesList==========
router.post(
  "/agricultureImagesAdd",
  authtoken.verifyToken,
  agricultureImageListController.addAgricultureImages,
);

router.get(
  "/agricultureImagesList",
  authtoken.verifyToken,
  agricultureImageListController.listAgricultureImages,
);

router.get(
  "/agricultureImagesView/:id",
  authtoken.verifyToken,
  agricultureImageListController.viewAgricultureImage,
);

router.put(
  "/agricultureImagesEdit",
  authtoken.verifyToken,
  agricultureImageListController.editAgricultureImages,
);

router.delete(
  "/agricultureImagesDelete/:id",
  authtoken.verifyToken,
  agricultureImageListController.deleteAgricultureImage,
);

//=======AgricultureListing=========
router.post(
  "/addAgriculture",
  authtoken.verifyToken,
  agricultureController.addAgriculture,
);
router.put(
  "/editAgriculture/:id",
  authtoken.verifyToken,
  agricultureController.editAgriculture,
);
router.get(
  "/viewAgriculture/:id",
  authtoken.verifyToken,
  agricultureController.viewAgriculture,
);
router.get(
  "/agricultureList",
  authtoken.verifyToken,
  agricultureController.agricultureList,
);
router.put(
  "/agriculture/status/:id",
  agricultureController.updateAgricultureStatus,
);

router.delete(
  "/deleteAgriculture/:id",
  authtoken.verifyToken,
  agricultureController.deleteAgriculture,
);

//====news==========
router.post("/addNews", authtoken.verifyToken, newsController.addNews);
router.put("/editNews/:id", authtoken.verifyToken, newsController.editNews);
router.get("/viewNews/:id", authtoken.verifyToken, newsController.viewNews);
router.get("/newsList", authtoken.verifyToken, newsController.newsList);
router.post("/newStatus", authtoken.verifyToken, newsController.newsStatus);

router.delete(
  "/deleteNews/:id",
  authtoken.verifyToken,
  newsController.deleteNews,
);

//=====service========
router.post(
  "/addService",
  authtoken.verifyToken,
  servicesController.addService,
);
router.put(
  "/editService/:id",
  authtoken.verifyToken,
  servicesController.editService,
);
router.get(
  "/viewService/:id",
  authtoken.verifyToken,
  servicesController.viewService,
);
router.get(
  "/serviceList",
  authtoken.verifyToken,
  servicesController.serviceList,
);
router.post(
  "/serviceStatus",
  authtoken.verifyToken,
  servicesController.serviceStatus,
);

router.delete(
  "/deleteService/:id",
  authtoken.verifyToken,
  servicesController.deleteService,
);

// router for contact us
router.get(
  "/contactList",
  authtoken.verifyToken,
  contactUsController.contactGet,
);
router.get(
  "/contactDetail/:id",
  authtoken.verifyToken,
  contactUsController.contactView,
);
router.post(
  "/contact/:id",
  authtoken.verifyToken,
  contactUsController.contactDelete,
);

// router for faq
router.post("/addFaq", authtoken.verifyToken, faqController.addFaq);
router.get("/faqList", authtoken.verifyToken, faqController.getFaqs);
router.get("/viewFaq/:id", authtoken.verifyToken, faqController.viewFaq);
router.put("/updateFaq/:id", authtoken.verifyToken, faqController.updateFaq);
router.delete("/deleteFaq/:id", authtoken.verifyToken, faqController.deleteFaq);

// router for cms
router.get(
  "/privacypolicy",
  authtoken.verifyToken,
  cmsController.privacy_policy,
);
router.post(
  "/privacypolicy",
  authtoken.verifyToken,
  cmsController.privacypolicy,
);
router.get("/aboutus", authtoken.verifyToken, cmsController.aboutus);
router.post("/aboutus", authtoken.verifyToken, cmsController.updateabout);
router.get("/termsconditions", authtoken.verifyToken, cmsController.term);
router.post(
  "/termsconditions",
  authtoken.verifyToken,
  cmsController.updateterm,
);

module.exports = router;
