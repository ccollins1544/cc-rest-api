const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  var employees = sequelize.define(
    "employees",
    {
      emp_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(14),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(16),
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ["M", "F"],
        allowNull: false,
      },
      hire_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: "employees",
    },
  );

  return employees;
};
