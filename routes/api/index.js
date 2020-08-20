const router = require("express").Router();
const payloadRouter = require("./payload");
const tokenRouter = require("./token");
const employeesRouter = require("./employees");

// Matches with /api/<route>
router.use("/payload", payloadRouter);
router.use("/token", tokenRouter);
router.use("/employee", employeesRouter);

module.exports = router;
