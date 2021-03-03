// Global variables of commons.js

var selected_house = "commons";

var selected_mode = "search";
var selected_submode = "basic";

var min_1500 = window.matchMedia("(min-width: 1500px)");
var min_1200 = window.matchMedia("(min-width: 1200px)");
var min_992 = window.matchMedia("(min-width: 992px)");
var min_768 = window.matchMedia("(min-width: 768px)");
var min_576 = window.matchMedia("(min-width: 576px)");
var max_768 = window.matchMedia("(max-width: 768px)");

var GLOBAL;

// DOM has been loaded

$(function() {
  $(window).on("resize", function() {
    if (selected_mode == "explore") {
      /*
      $("#word_cloud").html(
        "<div class='my-3 mx-3' style='text-align:center'><text class='nvd3 nv-noData' style='text-anchor: middle;'>Please make the query again to get a new wordcloud.</text></div>"
      );

      $("#bubble").html(
        "<svg></svg>" +
          "<div class='my-3 mx-3' style='text-align:center'><text class='nvd3 nv-noData' style='text-anchor: middle;'>Please make the query again to get a new bubble chart.</text></div>"
      );*/
    }
  });

  $(window).on("unload", function() {
    cancelPendingSQLQuery();
  });

  if (isIE()) {
    window.location = "index.php";
  }

  if (min_992.matches) {
    $('[data-toggle="tooltip"]').tooltip();
  } else {
    $(".help").tooltip("disable");
    $('[data-toggle="tooltip"]').tooltip("disable");
  }

  $(".navbar .far").click(function() {
    $(".navbar .far").toggle();
  });

  // Aside menu: functions

  $(".menu .function-section").click(function() {
    $("html, body").animate(
      {
        scrollTop:
          $(".title")
            .parent()
            .offset().top + -100
      },
      1000
    );
  });

  $(".menu .function-item").click(function() {
    item = $(this).data("function");

    if (
      $(this)
        .parent(".list-secondary")
        .parent(".nav-item")
        .hasClass("search")
    ) {
      switch (item) {
        case "search_box":
          $("html, body").animate(
            {
              scrollTop:
                $(".search .search-box .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "compare":
          $("html, body").animate(
            {
              scrollTop:
                $(".search .distribution .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "results":
          $("html, body").animate(
            {
              scrollTop:
                $(".search .results .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "compare-results":
          $("html, body").animate(
            {
              scrollTop:
                $(".search .compare-results .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "members":
          $("html, body").animate(
            {
              scrollTop:
                $(".search .members .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "contribution":
          $("html, body").animate(
            {
              scrollTop:
                $(".search .contribution .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;
      }
    } else if (
      $(this)
        .parent(".list-secondary")
        .parent(".nav-item")
        .hasClass("explore")
    ) {
      switch (item) {
        case "type":
          $("html, body").animate(
            {
              scrollTop:
                $(".explore > .type")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "word_cloud":
          $("html, body").animate(
            {
              scrollTop:
                $(".explore .word_cloud .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "distribution":
          $("html, body").animate(
            {
              scrollTop:
                $(".explore .distribution .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "results":
          $("html, body").animate(
            {
              scrollTop:
                $(".explore .results .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "compare-results":
          $("html, body").animate(
            {
              scrollTop:
                $(".explore .compare-results .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "members":
          $("html, body").animate(
            {
              scrollTop:
                $(".explore .members .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;

        case "contribution":
          $("html, body").animate(
            {
              scrollTop:
                $(".explore .contribution .card")
                  .parent()
                  .offset().top + -100
            },
            1000
          );
          break;
      }
    }
  });

  // Minimise cards

  $(".card-body").collapse({ toggle: true });
  $(".card-body").addClass("collapse show");

  $(".fa-window-minimize").click(function() {
    $(this)
      .parents(".card")
      .children(".card-body")
      .collapse("toggle");
  });

  $("input.house[type='radio']:not(.keywords)").click(function() {
    //BORRAR
    if ($(this).val() == "both") {
      $("#underConstructionModal").modal("show");
      $(".basic-search.house[value='commons']").attr("checked", "true");
    } else {
      selectHouse($(this).val());
    }
  });

  $(".new-search").click(function() {
    resetAll();
  });

  $('[data-toggle="tooltip"], .help, th').on("show.bs.tooltip", function() {
    $('[data-toggle="tooltip"], .help, th').tooltip("hide");
  });

  $("#error .error-button").click(function() {
    if ($("#error .error-code").css("display") == "none") {
      $("#error .error-button").html("Hide error code");
      $("#error .error-code").show();
    } else {
      $("#error .error-button").html("Show error code");
      $("#error .error-code").hide();
    }
  });

  $(".modal .memory-button").click(function() {
    if ($(".modal .memory-code").css("display") == "none") {
      $(".modal .memory-button").html("Hide error code");
      $(".modal .memory-code").show();
    } else {
      $(".modal .memory-button").html("Show error code");
      $(".modal .memory-code").hide();
    }
  });

  // Index onclick function

  $(".main-function").click(function() {
    if ($(this).data("function") != selected_mode) {
      selected_mode = $(this).data("function");

      $(".main-function").removeClass("active");
      $(".main-function[data-function='" + selected_mode + "']").addClass(
        "active"
      );

      $(".content > section").hide();
      $(".content > section." + selected_mode).show();

      $(".index .sidebar-sticky .nav-item").hide();
      $(".nav-item." + selected_mode).show();

      $(".card-title:not('.select-function')").hide();
      $(".card-title." + selected_mode).show();
      $(".sidebar.index .new").show();

      if (selected_mode == "search") {
        resetAllExplore();
        $(".nav-item.search-box").show();
        selected_function = "search";
        $("button.new-search").removeClass("explore");
        $("button.new-search").addClass("search");
      } else if (selected_mode == "explore") {
        resetAllSearch();
        selected_function = "explore";
        $("button.new-search").removeClass("search");
        $("button.new-search").addClass("explore");
        //exploreByWords();
      }
    }
  });

  $("#navbarSupportedContent .nav-link").click(function() {
    $("#navbarSupportedContent .nav-link")
      .parent()
      .removeClass("active");
    $(this)
      .parent()
      .addClass("active");
    $("#navbarSupportedContent").collapse("hide");
  });
});

function convertRemToPixels(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getColoursAndTerms(terms_info) {
  elements = {};
  elements["colours"] = new Array();
  elements["terms"] = new Array();
  i = 0;

  $.each(terms_info, function(index, value) {
    elements["colours"][i] = value["colour"];
    elements["terms"][i] = index;
    i++;
  });

  return elements;
}

function getColoursTermsTitle(terms_info) {
  elements = {};
  elements["colours"] = new Array();
  elements["terms"] = new Array();
  elements["title"] = new Array();
  i = 0;

  $.each(terms_info, function(index, value) {
    elements["colours"][i] = value["colour"];
    elements["terms"][i] = index;
    elements["title"][i] = value["title"];
    i++;
  });

  return elements;
}

function isIE() {
  var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
  var msie = ua.indexOf("MSIE "); // IE 10 or older
  var trident = ua.indexOf("Trident/"); //IE 11

  return msie > 0 || trident > 0;
}

function selectHouse(house) {
  if (selected_house != house) {
    selected_house = house;

    $(
      "input:radio[name=basicSearchHouseRadioOptions][value=" + house + "]"
    ).prop("checked", true);
    $(
      "input:radio[name=advancedSearchHouseRadioOptions][value=" + house + "]"
    ).prop("checked", true);
    $("input:radio[name=wcHouseRadioOptions][value=" + house + "]").prop(
      "checked",
      true
    );

    $(".typeahead.advanced-search.typeahead-members").css("display", "none");
    $(".typeahead.advanced-search.typeahead-members." + house + "").css(
      "display",
      "block"
    );

    if (selected_mode == "explore") {
      if ($("section.explore .word_cloud").css("display") != "none") {
        resetWC(true);
      }
    } else if (selected_mode == "search") {
      if (num_queries > 0) {
        if ($("#pills-advanced-tab").hasClass("active")) {
          getDistributionAdvanced();
        } else {
          getDistribution();
        }
      } else {
        updateSearchButtonOn();
      }
    }
  }
}

function resetAll() {
  if (selected_mode == "explore") {
    resetAllExplore();
  } else if (selected_mode == "search") {
    resetAllSearch();
  }
}

function resetSearch() {
  resetSearchCompare();
  resetSearchFree();
}

function resetExplore() {
  cleanExplore();
  $(".explore .function-cards").show();
  $(".explore .function-labels").hide();
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function cancelPendingSQLQuery() {
  $.ajax({
    url: "src/php/search_functions.php",
    type: "post",
    data: { action: "killPID" }
  });
}

function cancelRScripts() {
  $.ajax({
    url: "src/php/explore_functions.php",
    type: "post",
    data: { action: "killBubble" }
  });
}

cancelRScripts;

function updateSearchButtonOn() {
  if (selected_mode == "explore") {
    if ($(".explore .bubble").css("display") != "none") {
      if (
        $(".explore .submit-keywords")
          .html()
          .replace(/\s/g, "") == "Search"
      ) {
        $(".explore .submit-keywords").html("Update");
        $(".explore .submit-keywords").addClass("update");
      }
    }
  } else {
    if (selected_submode == "basic") {
      if ($("section.search .distribution").css("display") != "none") {
        if (
          $(".basic-search .submit")
            .html()
            .replace(/\s/g, "") == "Search"
        ) {
          $(".basic-search .submit").html("Update");
          $(".basic-search .submit").addClass("update");
        }
      }
    } else {
      if ($("section.search .distribution").css("display") != "none") {
        if (
          $(".advanced-search .submit")
            .html()
            .replace(/\s/g, "") == "Search"
        ) {
          $(".advanced-search .submit").html("Update");
          $(".advanced-search .submit").addClass("update");
        }
      }
    }
  }
}

function updateSearchButtonOff() {
  if (selected_mode == "explore") {
    if ($(".explore .bubble").css("display") != "none") {
      if (
        $(".explore .submit-keywords")
          .html()
          .replace(/\s/g, "") == "Update"
      ) {
        $(".explore .submit-keywords").html("Search");
        $(".explore .submit-keywords").removeClass("update");
      }
    }
  } else {
    if (selected_submode == "basic") {
      if ($("section.search .distribution").css("display") != "none") {
        if (
          $(".basic-search .submit")
            .html()
            .replace(/\s/g, "") == "Update"
        ) {
          $(".basic-search .submit").html("Search");
          $(".basic-search .submit").removeClass("update");
        }
      }
    } else {
      if ($("section.search .distribution").css("display") != "none") {
        if (
          $(".advanced-search .submit")
            .html()
            .replace(/\s/g, "") == "Update"
        ) {
          $(".advanced-search .submit").html("Search");
          $(".advanced-search .submit").removeClass("update");
        }
      }
    }
  }
}
