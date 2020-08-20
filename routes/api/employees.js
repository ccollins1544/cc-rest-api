const router = require("express").Router();
const methods = require("../../middlewares/jwtStrategy");
const employeeController = require("../../controllers/employees");

// Matches with "/api/employee" GET POST
router
  .route("/")
  .get(methods.validateAccessToken, employeeController.findAll)
  .post(methods.validateAccessToken, employeeController.create);

// Matches with "/api/employee/:emp_no" GET PUT DELETE
router
  .route("/:emp_no")
  .get(methods.validateAccessToken, employeeController.findByEmpNo)
  .put(methods.validateAccessToken, employeeController.put)
  .delete(methods.validateAccessToken, employeeController.delete);

module.exports = router;
