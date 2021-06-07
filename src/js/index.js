var min_1500 = window.matchMedia("(min-width: 1500px)");
var min_1200 = window.matchMedia("(min-width: 1200px)");
var min_992 = window.matchMedia("(min-width: 992px)");
var min_768 = window.matchMedia("(min-width: 768px)");
var min_576 = window.matchMedia("(min-width: 576px)");
var max_768 = window.matchMedia("(max-width: 768px)");

$(function() {
  if (isIE()) {
    $("#IE-compatibility .lead span").css("background-color", "#FFFF66");
    $(".list-unstyled").css("width", "inherit");

    $("#IE-message").modal("show");

    $("#IE-message").on("hidden.bs.modal", function() {
      $("html, body").animate(
        {
          scrollTop: $("#IE-compatibility").offset().top
        },
        500
      );
    });

    $(".application").click(function() {
      $("#IE-message").modal("show");
    });
  } else {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("show")) {
      let param = urlParams.get("show");
      $(".only-one.container").hide();
      param_aux = param.split("_");
      if (param_aux.length > 1) {
        $("#" + param_aux[0]).show();
        $("html, body").animate(
          {
            scrollTop: $("#" + param_aux[1]).offset().top + -100
          },
          1000
        );
      } else {
        $("#" + param).show();
        $("html, body").animate(
          {
            scrollTop: $("#" + param).offset().top + -100
          },
          1000
        );
      }
    }
  }

  $(".ack, .tech, .pub").click(function() {
    window.open($(this).data("url"), "_blank");
  });

  $("#lesley").click(function() {
    window.open("https://pure.hud.ac.uk/en/persons/lesley-jeffries", "_blank");
  });

  $("#marc").click(function() {
    window.open(
      "https://www.gla.ac.uk/schools/critical/staff/marcalexander/",
      "_blank"
    );
  });

  $("#alex").click(function() {
    window.open(
      "https://pure.hud.ac.uk/en/persons/alexander-von-lunen",
      "_blank"
    );
  });

  $("#hugo").click(function() {
    window.open(
      "https://estudiantes.deusto.es/cs/Satellite/estudiantes/en/students-1/academic-information/teaching-staff-1/28212/profesor",
      "_blank"
    );
  });

  $("#fransina").click(function() {
    window.open(
      "https://www.linguisticsathuddersfield.com/fransina-stradling",
      "_blank"
    );
  });
  
  $("#paul").click(function() {
    window.open(
      "https://pure.hud.ac.uk/en/persons/paul-crossley",
      "_blank"
    );
  });

  $(".function").click(function() {
    
    if($(this).hasClass("function-hover2")){
      $(".sub-c").hide();
    }else{
      $(".only-one.container").hide();
    }

    if ($(this).data("function") == "blog") {
      window.open("https://hansardhud.edublogs.org/", "_blank");
    } else if ($(this).data("function") == "brochure") {
      window.open("https://cloud.3dissue.com/18743/41457/106040/POLICY/index.html?r=27", "_blank");
    } else if ($(this).data("function") == "brochure-teach") {
      window.open("https://cloud.3dissue.com/18743/41457/106040/TEACHERS/index.html?r=59", "_blank");
    }else if ($(this).data("function") == "user-guide"){
      window.open("pdf/Hansard at Huddersfield User Guide - Version May 2020_Final.pdf", "_blank");
    } else {

      $("#" + $(this).data("function")).show();

      if ($(this).data("subfunction")) {
        $("html, body").animate(
          {
            scrollTop: $("#" + $(this).data("subfunction")).offset().top + -100
          },
          1000
        );
      } else {
        $("html, body").animate(
          {
            scrollTop: $("#" + $(this).data("function")).offset().top + -100
          },
          1000
        );
      }
    }
  });

  $("#sendMessage").click(function() {
    $(".feedback input").removeClass("is-invalid");
    var flag_error = false;

    var email = "";
    var msg = "";
    var name = "";

    if ($("#txtEmail2").val() == "") {
      if (!isEmail($("#txtEmail").val())) {
        $("#txtEmail").addClass("is-invalid");
        flag_error = true;
      } else {
        email = $("#txtEmail").val();
      }

      if (
        $("#txtMsg")
          .val()
          .trim()
          .replace(/\s+/g, "") == ""
      ) {
        $("#txtMsg").addClass("is-invalid");
        flag_error = true;
      } else {
        msg = $("#txtMsg").val();
      }

      if (
        $("#txtName")
          .val()
          .trim()
          .replace(/\s+/g, "") == ""
      ) {
        $("#txtName").addClass("is-invalid");
        flag_error = true;
      } else {
        name = $("#txtName").val();
      }

      if (!flag_error) {
        $.ajax({
          url: "src/php/contact_functions.php",
          type: "get",
          data: { action: "feedback", message: msg, email: email, name: name },

          success: function(data, status) {
            if (data == "ok") {
              $("#feedback-ok").modal("show");
            } else if ((data = "feedback-already-send")) {
              $("#feedback-already-send").modal("show");
            }
          },
          error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
            $("#errorCodeModal").text("1 - feedback");
            $("#error").modal("show");
          }
        });
      }
    }
  });

  $(".watch-video").click(function() {
    $(".video-player").css("display", "flex");
    $(".video-player").html("");

    /*
    $(".video-player ").append(
      "<div class='d-flex justify-content-center'><video class='col-md-9' height='300px' controls autoplay><source src='video/" +
        $(this).data("video") +
        ".mp4' type='video/mp4'>Your browser does not support the video tag.</video></div>" +
        "<div class='mt-1 d-flex justify-content-center' style='color:#999'>" +
        $(this).data("title") +
        "</div>"
    );
    */

    if (min_1500.matches) {
      var height = 350;
    } else if (min_1200.matches) {
      var height = 350;
    } else if (min_992.matches) {
      var height = 250;
    } else if (min_768.matches) {
      var height = 150;
    } else if (min_576.matches) {
      var height = 150;
    } else {
      var height = 150;
    }

    $(".video-player ").append(
      "<iframe width='60%' height='" +
        height +
        "' src='" +
        $(this).data("video") +
        "'>   </iframe>"
    );

    $("html, body").animate(
      {
        scrollTop: $(".video-player").offset().top + -100
      },
      1000
    );
  });

  $(".case_study span").click(function() {
    window.open("./pdf/" + $(this).data("function"), "_blank");
  });

  $(".user_guide span").click(function() {
    window.open("./pdf/" + $(this).data("function"), "_blank");
  });
});

function isIE() {
  var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
  var msie = ua.indexOf("MSIE "); // IE 10 or older
  var trident = ua.indexOf("Trident/"); //IE 11

  return msie > 0 || trident > 0;
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
