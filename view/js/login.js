document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      c = {};

      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;

      c.username = username;
      c.password = password;

      $.ajax({
        url: "/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(c),
        success: function (response) {
          console.log(JSON.stringify(response));
          window.location.href =
            "././portfolio.html?username=" + c.username + "&gameName=sample";
        },

        error: function (xhr, status, error) {
          alert("Error - " + xhr.status + ": " + xhr.responseText);
        },
      });
    });

  document
    .getElementById("forgotPassword")
    .addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "././resetpassword.html";

      console.log("Forgot password clicked");
    });
});
