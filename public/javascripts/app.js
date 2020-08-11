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
    console.log(data);
  });
});
