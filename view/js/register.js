$(document).ready(function () {
  function assembleContact() {
    let c = {};
    c.firstName = $("#firstName").val();
    c.lastName = $("#lastName").val();
    c.email = $("#email").val();
    c.contact = $("#contact").val();
    c.username = $("#username").val();
    c.password = $("#password").val();
    c.isAdmin = $("#isAdmin").prop("checked");

    c.game = $("#game").val() || undefined;
    return c;
  }

  $("#register").click(function (event) {
    console.log("hey2");
    event.preventDefault();
    let contact = assembleContact();
    console.log(JSON.stringify(contact));
    $.ajax({
      url: "/register",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(contact),
      success: function (response) {
        console.log(JSON.stringify(response));
        window.location.href =
          "././portfolio.html?username=" +
          contact.username +
          "&gameName=sample";
      },

      error: function (xhr, status, error) {
        alert("Error - " + xhr.status + ": " + xhr.responseText);
      },
    });
  });
});
