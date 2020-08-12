/**
 * ===============[ TABLE OF CONTENTS ]===============
 * 1. Functions
 *   1.1 AlertMessage()
 *   1.2 getFormData
 ******************************************************/
/* ===============[ 1. FUNCTIONS ]====================*/
/**
 * 1.1 AlertMessage()
 * @param {string} message - Message to go in the alert box
 * @param {string} addThisClass - defaults to empty string. Can be info, danger, or success.
 */
function AlertMessage(message = "", addThisClass = "info", appendAfterElement) {
  $("#alert_message").remove();

  var alertElement = $("<div>")
    .addClass("col-12 alert")
    .attr("id", "alert_message");

  // RESET Alert Message
  if (message === "") {
    $("#main-section .first-row").empty();
    return;
  } else if (addThisClass === "info") {
    // Default alert
    addThisClass = "alert-info";
  } else if (addThisClass === "danger") {
    addThisClass = "alert-danger";
  } else if (addThisClass === "success") {
    addThisClass = "alert-success";
  }

  // IF same alert message keeps getting spammed then add ! and change color red
  if (
    $("#alert-messages").html() !== undefined &&
    $("#alert-messages").html() === message
  ) {
    message += "!";
    addThisClass = "alert-danger";
  }

  // Add the new class
  alertElement.addClass(addThisClass);

  // Display the alert message
  alertElement.html(message);

  if (appendAfterElement === undefined) {
    appendAfterElement = $("#main-section");
  }

  appendAfterElement.prepend(alertElement);
  return;
}

/**
 * 1.2 getFormData
 * @param {domObject} formID - e.target.id
 */
function getFormData(formID) {
  let formArray = $("#" + formID).serializeArray();
  var formData = {}; // NOTE: {} creates and object and [] creates an Array.

  for (var i in formArray) {
    var KEY = "";
    var VALUE = "";

    for (var key in formArray[i]) {
      if (key === "name") {
        KEY = formArray[i][key];
      } else if (key === "value") {
        VALUE = formArray[i][key];
      }
    }
    formData[KEY] = VALUE.trim();
    if (formData[KEY] === "") {
      return; // prevent empty entries into database
    }
  }

  return formData;
}

$(function () {
  $("#login-form").on("submit", function (e) {
    e.preventDefault();
    var data = getFormData(e.target.id);

    $.ajax({
      url: "/login",
      method: "POST",
      data: data,
      dataType: "json",
      timeout: 5000,
      success: function (response) {
        if (response.ok) {
          AlertMessage(response.message, "success");
          window.location.href = "/";
        } else {
          AlertMessage(response.message, "danger");
        }
      },
      error: function (request, error) {
        // console.log("request", request);
        // console.log("responseText", JSON.parse(request.responseText));
        // console.log("error", error);

        let responseText = JSON.parse(request.responseText);
        let ErrorMessage =
          "Error: " + request.status + ", " + request.statusText;
        ErrorMessage += responseText.hasOwnProperty("message")
          ? " " + responseText.message
          : "";

        if (request.status === 200) {
          AlertMessage(ErrorMessage, "success");
          window.location.href = "/";
        } else {
          AlertMessage(ErrorMessage, "danger");
        }
      },
    });
  });

  $("#logout").on("click", function (e) {
    e.preventDefault();

    $.ajax({
      url: "/logout",
      method: "DELETE",
      success: function (response) {
        if (response.ok) {
          AlertMessage(response.message, "success");
          window.location.href = "/login";
        } else {
          AlertMessage(response.message, "danger");
        }
      },
      error: function (request, error) {
        // console.log("request", request);
        // console.log("responseText", JSON.parse(request.responseText));
        // console.log("error", error);

        let responseText = JSON.parse(request.responseText);
        let ErrorMessage =
          "Error: " + request.status + ", " + request.statusText;
        ErrorMessage += responseText.hasOwnProperty("message")
          ? " " + responseText.message
          : "";

        if (request.status === 200) {
          AlertMessage(ErrorMessage, "success");
          window.location.href = "/login";
        } else {
          AlertMessage(ErrorMessage, "danger");
        }
      },
    });
  });
});
