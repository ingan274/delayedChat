const express = require('express');
const router = express.Router();
const controller = require("../controller/messageController");

// MCC Crew Chat  (/mcccrew/:location)
router.route("/:location")
    .get(controller.chatMCCCrew)

router.route("/")
    .get(controller.sentMessages)
    .post(controller.newMessageMCCCrew)

// MCC Crew Chat  (/mcccrew/ignorepress)
router.route("/ignorepress")
    .put(controller.mccObsoletePress)


module.exports = router;