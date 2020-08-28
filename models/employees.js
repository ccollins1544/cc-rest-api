const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    emp_no: String,
    birth_date: Date,
    first_name: String,
    last_name: String,
    gender: String,
    hire_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

employeeSchema.pre("save", function (next) {
  if (!this.emp_no) {
    this.emp_no = this._id;
  }
  next();
});

const Employees = mongoose.model("Employees", employeeSchema);
module.exports = Employees;
