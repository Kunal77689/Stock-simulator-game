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
  var gameName = getParameterByName("gameName");

  var loggedInUserElement = document.getElementById("loggedInUser");
  if (loggedInUserElement) {
    loggedInUserElement.textContent = username ? username : "User Profile";
  }

  var loggedInGameElement = document.getElementById("gamename");
  if (loggedInGameElement) {
    loggedInGameElement.textContent = gameName ? gameName : "Game";
  }

  function updateOverviewValues(cashAmount, stocks) {
    console.log(cashAmount, stocks);
    stocks = JSON.stringify(stocks);

    document.getElementById("cashValue").innerText = cashAmount;
    document.getElementById("stocksValue").innerText = stocks;
  }

  $.ajax({
    url: "/portfolio",
    type: "GET",
    data: { username: username, game: gameName },
    success: function (response) {
      updateOverviewValues(response.cashAmount, response.stocks);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });

  document
    .getElementById("chooseGameBtn")
    .addEventListener("click", function () {
      window.location.href =
        "././games.html?username=" + username + "&gameName=" + gameName;
    });

  document.getElementById("portfolio").addEventListener("click", function () {
    window.location.href =
      "././portfolio.html?username=" + username + "&gameName=" + gameName;
  });

  document.getElementById("trade").addEventListener("click", function () {
    window.location.href =
      "././trade.html?username=" + username + "&gameName=" + gameName;
  });

  $.ajax({
    url: "/marketstatus",
    type: "GET",
    success: function (response) {
      console.log(response);
      var marketStatus = response ? "Open" : "Closed";
      document.getElementById("marketStatus").innerText = marketStatus;
    },
    error: function (xhr, status, error) {
      alert("Error - " + xhr.status + ": " + xhr.responseText);
    },
  });
});
