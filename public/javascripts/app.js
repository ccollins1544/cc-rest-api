/**
 * ===============[ TABLE OF CONTENTS ]===============
 * 1. Functions
 *   1.1 AlertMessage()
 *   1.2 getFormData
 *   1.3 startClock
 *
 * 2. Document Ready
 *   2.1 Update Home Page Content
 *     2.1.1 Banner Date and Times
 *     2.1.2 Save Local Storage payload and token
 *
 *   2.2 Update Login Page Content
 *     2.2.1 Retrieve Local Storage payload and token
 *
 *   2.3 Login Form Submit
 *   2.4 Logout Click
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
    appendAfterElement = $("#main-container");
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

/**
 * 1.3 startClock
 * Displays current time and continues counting the seconds.
 * @param {string} divSelector - defaults to #clock
 */
var startClock = function (divSelector) {
  divSelector = divSelector === undefined ? "#clock" : divSelector;
  setInterval(function () {
    $(divSelector).html(moment().format("MMMM D, YYYY hh:mm:ss A"));
  }, 1000);
}; // END startClock

/**
 * 2. Document Ready
 */
$(function () {
  startClock();

  if ($("#home_page").length > 0) {
    // 2.1 Update Home Page Content
    // 2.1.1 Banner Date and Times
    let iatEpoch = parseInt($("#iat").text());
    let expEpoch = parseInt($("#exp").text());
    let nowEpoch = moment().unix();

    // Countdown Timer
    var diffTime = expEpoch - nowEpoch;
    var duration = moment.duration(diffTime * 1000, "milliseconds");
    var interval = 1000;

    setInterval(function () {
      duration = moment.duration(duration - interval, "milliseconds");
      $("#time_remaining").text(
        duration.hours() + ":" + duration.minutes() + ":" + duration.seconds(),
      );

      let target_parent = $("#time_remaining").closest("li");
      let primary_class = target_parent.hasClass("list-group-item-primary");
      let warning_class = target_parent.hasClass("list-group-item-warning");
      let danger_class = target_parent.hasClass("list-group-item-danger");

      if (duration.minutes() < 10 && danger_class === false) {
        if (primary_class) {
          target_parent.removeClass("list-group-item-primary");
        } else if (warning_class) {
          target_parent.removeClass("list-group-item-warning");
        }
        target_parent.addClass("list-group-item-danger");
      } else if (
        duration.minutes() < 15 &&
        duration.minutes() > 10 &&
        warning_class === false
      ) {
        if (primary_class) {
          target_parent.removeClass("list-group-item-primary");
        } else if (danger_class) {
          target_parent.removeClass("list-group-item-danger");
        }
        target_parent.addClass("list-group-item-warning");
      } else if (duration.minutes() > 15 && primary_class === false) {
        if (warning_class) {
          target_parent.removeClass("list-group-item-warning");
        } else if (danger_class) {
          target_parent.removeClass("list-group-item-danger");
        }
        target_parent.addClass("list-group-item-primary");
      }
    }, interval);

    // Human Readable Dates
    $("#iat").html(moment.unix(iatEpoch).format("MMMM, D, YYYY hh:mm:ss A"));
    $("#exp").html(moment.unix(expEpoch).format("MMMM, D, YYYY hh:mm:ss A"));

    // 2.1.2 Save Local Storage payload and token
    let payload = $("#main-footer").data("payload");
    let token = $("#main-footer").data("token");

    if (Object.keys(payload).length > 0) {
      localStorage.setItem("cc_rest_api_payload", JSON.stringify(payload));
    }

    if (token.trim() !== "") {
      localStorage.setItem("cc_rest_api_token", token);
    }
  } else if ($("#login_page").length > 0) {
    // 2.2 Update Login Page Content
    // 2.2.1 Retrieve Local Storage payload and token
    let payload =
      localStorage.getItem("cc_rest_api_payload") !== null
        ? localStorage.getItem("cc_rest_api_payload")
        : "{}";
    payload = JSON.parse(payload);

    let token =
      localStorage.getItem("cc_rest_api_token") !== null
        ? localStorage.getItem("cc_rest_api_token")
        : "";

    // Check if token has expired
    if (payload.hasOwnProperty("exp") && token !== "") {
      let remaining_time = payload.exp - moment().unix();
      if (remaining_time > 0) {
        $.ajax({
          url: "/",
          type: "GET",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          },
          success: function () {
            remaining_time = Math.round(remaining_time / 60);
            AlertMessage(
              "Local Storage Token is still valid for " +
                remaining_time +
                " minutes!",
              "success",
            );

            let card_body = $("<button>").addClass("btn btn-dark").text("Home");
            card_body = $("<a>").attr("href", "/").append(card_body);
            $("#login-form").replaceWith(card_body);
          },
          error: function (request, error) {
            let { status, statusText, responseText, data } = request;
            let ErrorMessage = "Error: " + status + ", " + statusText;
            ErrorMessage = +(responseText !== null && responseText !== "")
              ? "<br />" + responseText
              : "";
            ErrorMessage = +(data !== null && Object.keys(data).length > 0)
              ? "<br /><pre>" + JSON.stringify(data, null, 2) + "</pre>"
              : "";
            AlertMessage(ErrorMessage, "danger");
          },
        });
      } else {
        remaining_time = Math.abs(Math.round(remaining_time / 60));
        AlertMessage(
          "Local Storage Token has expired " + remaining_time + " minutes ago.",
          "danger",
        );
      }
    }
  }

  // 2.2 Login Form Submit
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

  // 2.3 Logout Click
  $("#logout").on("click", function (e) {
    e.preventDefault();

    $.ajax({
      url: "/logout",
      method: "DELETE",
      success: function (response) {
        localStorage.removeItem("cc_rest_api_token");
        localStorage.removeItem("cc_rest_api_payload");

        if (response.ok) {
          AlertMessage(response.message, "success");
          window.location.href = "/login";
        } else {
          AlertMessage(response.message, "danger");
        }
      },
      error: function (request, error) {
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
