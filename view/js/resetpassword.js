document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      c = {};

      console.log("hey");
      var username = document.getElementById("username").value;
      var email = document.getElementById("email").value;
      var newPassword = document.getElementById("newPassword").value;

      c.username = username;
      c.email = email;
      c.newPassword = newPassword;

      console.log("Username:", username);
      console.log("Email:", email);
      console.log("New Password:", newPassword);

      $.ajax({
        url: "/resetPassword",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(c),
        success: function (response) {
          console.log(JSON.stringify(response));
          console.log("heyyyyyyyy");
          window.location.href = "././login.html";
        },

        error: function (xhr, status, error) {
          alert("Error - " + xhr.status + ": " + xhr.responseText);
        },
      });
    });
});
