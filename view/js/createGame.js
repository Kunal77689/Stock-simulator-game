document.addEventListener("DOMContentLoaded", function () {
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var username = getParameterByName("username");

  var createGameForm = document.getElementById("createGameForm");
  var createGameBtn = document.getElementById("createGameBtn");

  createGameForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var gameName = document.getElementById("gameName").value;
    var description = document.getElementById("description").value;

    var url =
      "/createGame?Name=" +
      gameName +
      "&creatorusername=" +
      username +
      "&description=" +
      description;
    $.ajax({
      url: url,
      type: "POST",

      success: function (response) {
        alert("Game created successfully");
        window.location.href = "/register.html";
      },
      error: function (xhr, status, error) {
        alert("Error - " + xhr.status + ": " + xhr.responseText);
      },
    });
  });
});
