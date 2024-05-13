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

  var gameNameElement = document.getElementById("game-name");
  if (gameNameElement) {
    gameNameElement.textContent = gameName ? gameName : "Game Name";
  }

  $.ajax({
    url: "/marketstatus",
    type: "GET",
    success: function (response) {
      console.log(response);

      document.getElementById("marketStatus").innerText = response
        ? "Open"
        : "Closed";
    },
    error: function (xhr, status, error) {
      alert("Error - " + xhr.status + ": " + xhr.responseText);
    },
  });

  document.getElementById("portfolio").addEventListener("click", function () {
    window.location.href =
      "././portfolio.html?username=" + username + "&gameName=" + gameName;
  });

  document.getElementById("trades").addEventListener("click", function () {
    window.location.href =
      "././trade.html?username=" + username + "&gameName=" + gameName;
  });

  document.getElementById("buyBtn").addEventListener("click", function () {
    var symbol = document.getElementById("stockSymbol").value;
    var quantity = document.getElementById("quantity").value;

    console.log(gameName);
    var url =
      "/buy?" +
      "quantity=" +
      encodeURIComponent(quantity) +
      "&symbol=" +
      encodeURIComponent(symbol) +
      "&username=" +
      encodeURIComponent(username) +
      "&gameName=" +
      encodeURIComponent(gameName);

    $.ajax({
      url: url,
      type: "POST",
      contentType: "application/json",
      success: function (response) {
        window.location.href =
          "././portfolio.html?username=" + username + "&gameName=" + gameName;
      },
      error: function (xhr, status, error) {
        alert("Error - " + xhr.status + ": " + xhr.responseText);
      },
    });
  });

  document
    .getElementById("chooseGameBtn")
    .addEventListener("click", function () {
      window.location.href =
        "././games.html?username=" + username + "&gameName=" + gameName;
    });

  document.getElementById("sellBtn").addEventListener("click", function () {
    var symbol = document.getElementById("stockSymbol").value;
    var quantity = document.getElementById("quantity").value;

    var url =
      "/sell?" +
      "quantity=" +
      encodeURIComponent(quantity) +
      "&symbol=" +
      encodeURIComponent(symbol) +
      "&username=" +
      encodeURIComponent(username) +
      "&gameName=" +
      encodeURIComponent(gameName);

    $.ajax({
      url: url,
      type: "POST",
      contentType: "application/json",
      success: function (response) {
        window.location.href =
          "././portfolio.html?username=" + username + "&gameName=" + gameName;
      },
      error: function (xhr, status, error) {
        alert("Error - " + xhr.status + ": " + xhr.responseText);
      },
    });
  });

  document.getElementById("quoteBtn").addEventListener("click", function () {
    var symbol = document.getElementById("stockSymbol").value;

    $.ajax({
      url: "/getStockPrice",
      type: "GET",
      data: { symbol: symbol },
      success: function (response) {
        alert("Stock price: " + response);
      },
      error: function (xhr, status, error) {
        alert("Error - " + xhr.status + ": " + xhr.responseText);
      },
    });
  });
});
