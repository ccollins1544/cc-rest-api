const router = require("express").Router();
const payloadRoute = require("./payloadRoute");
const tokenRoute = require("./tokenRoute");

router.use("/payload", payloadRoute);
router.use("/token", tokenRoute);

module.exports = router;
