$(document).ready(function () {
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
  var gameName = getParameterByName("gameName");

  var url = "/getUserRegisteredGames?username=" + username;
  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {
      var registeredGamesDropdown = $("#registeredGamesDropdown");
      response.forEach(function (game) {
        console.log(game);
        registeredGamesDropdown.append(
          `<option value="${game}">${game}</option>`
        );
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching user registered games:", error);
    },
  });

  $.ajax({
    url: "/getAllGames",
    type: "GET",
    success: function (response) {
      var allGamesDropdown = $("#allGamesDropdown");
      response.forEach(function (game) {
        allGamesDropdown.append(
          `<option value="${game.Name}">${game.Name}</option>`
        );
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching all games:", error);
    },
  });

  $("#openGameBtn").click(function () {
    var gameId = $("#registeredGamesDropdown").val();
    if (gameId) {
      window.location.href =
        "/portfolio.html?username=" + username + "&gameName=" + gameId;
    } else {
      alert("Please select a game to open.");
    }
  });

  $("#registerNewGameBtn").click(function () {
    window.location.href = "/register.html";
  });

  $("#createNewGameBtn").click(function () {
    window.location.href = "/createGame.html?username=" + username;
  });
});
