//Global variables of year.js

var wc_ajax = null;
var wc_ajax_complete = true;
var parameter_wc = {};
var wc_distribution_ajax_complete = true;

var wc_filter = new Object();
var wc_filter = {
  year: [2000, 2019]
};
var wc_original_objects = {};

var parameter_kw = {};

var comparisonCorpusHouse = "commons";
var targetCorpusHouse = "commons";

var bubble_ajax = null;
var parameter_bubble = {};
var bubble_ajax_complete = true;
var bubble_original_objects = {};

var TEST;

// DOM has been loaded

$(function() {
  // Auto complete
  $.get(
    "config/forms/typeahead_parliament.json",
    function(data) {
      $(".keywords .typeahead.typeahead-parliament").typeahead({
        source: data
      });
    },
    "json"
  );

  // Auto complete
  $.get(
    "config/forms/typeahead_decades.json",
    function(data) {
      $(".keywords .typeahead.typeahead-decades").typeahead({
        source: data
      });
    },
    "json"
  );

  // Date picker
  $(".explore .keywords .target-corpus .datepicker-from").datepicker({
    format: "yyyy-mm-dd",
    value: "2018-01-01",
    minDate: "1803-11-22",
    maxDate: "2020-12-31",
    uiLibrary: "bootstrap4",
    change: function(e) {
      updateSearchButtonOn();
    }
  });

  $(".explore .keywords .target-corpus .datepicker-to").datepicker({
    format: "yyyy-mm-dd",
    value: "2020-12-31",
    minDate: "1803-11-22",
    maxDate: "2020-12-31",
    uiLibrary: "bootstrap4",
    change: function(e) {
      updateSearchButtonOn();
    }
  });

  $(".explore .keywords .comparison-corpus .datepicker-from").datepicker({
    format: "yyyy-mm-dd",
    value: "2018-01-01",
    minDate: "1803-11-22",
    maxDate: "2020-12-31",
    uiLibrary: "bootstrap4",
    change: function(e) {
      updateSearchButtonOn();
    }
  });

  $(".explore .keywords .comparison-corpus .datepicker-to").datepicker({
    format: "yyyy-mm-dd",
    value: "2020-12-31",
    minDate: "1803-11-22",
    maxDate: "2020-12-31",
    uiLibrary: "bootstrap4",
    change: function(e) {
      updateSearchButtonOn();
    }
  });

  $(".target-corpus input.house.keywords[type='radio']").click(function() {
    if ($(this).val() == "both") {
      $("#underConstructionModal").modal("show");
      $(".target-corpus .house.keywords[value='commons']").attr(
        "checked",
        "true"
      );
    } else {
      targetCorpusHouse = $(this).val();
    }
  });

  $(".comparison-corpus input.house.keywords[type='radio']").click(function() {
    if ($(this).val() == "both") {
      $("#underConstructionModal").modal("show");
      $(".comparison-corpus .house.keywords[value='commons']").attr(
        "checked",
        "true"
      );
    } else {
      comparisonCorpusHouse = $(this).val();
    }
  });

  $(".explore .type > button").click(function() {
    resetExplore();

    $(this).addClass("active");

    switch ($(this).data("function")) {
      case "word_cloud":
        selected_submode = "wordcloud";
        exploreByWords();
        break;
      case "keywords":
        selected_submode = "keyword";
        exploreByKeywords();
        break;
    }
  });

  $(".explore .keywords .submit-keywords").click(function() {
    prepareKeywords();
    generateBubble();
  });

  $(
    ".explore .keywords .date-time.annual .annual-from, .explore .keywords .date-time.annual .annual-to"
  ).change(function() {
    updateSearchButtonOn();
  });

  $(
    ".explore .keywords .date-time.annual .annual-from, .explore .keywords .date-time.annual .annual-to"
  ).keydown(function(e) {
    if (e.which == 13) {
      prepareBasicQuery();
    } else {
      updateSearchButtonOn();
    }
  });

  $(".explore .keywords .typeahead-members").keydown(function(e) {
    /*if (e.which == 13) {
      generateBubble();
    } else {
      updateSearchButtonOn();
    }*/

    updateSearchButtonOn();
  });

  $(".explore .keywords .datepicker").keydown(function(e) {
    /*if (e.which == 13) {
      generateBubble();
    } else {
      updateSearchButtonOn();
    }*/
    updateSearchButtonOn();
  });

  $(".explore .keywords input:text.keywords-search.input-query").keydown(
    function(e) {
      if (
        $("#targetCorpus").data("selected") != null &&
        $("#comparisonCorpus").data("selected") != null
      ) {
        if (e.which == 13) {
          resetKeywords(false);
          prepareKeywords();
          generateBubble();
        } else {
          updateSearchButtonOn();
        }
      }
    }
  );

  $(".target-corpus .dropdown-item").click(function() {
    $("#targetCorpus").html($(this).html());
    $("#targetCorpus").data("selected", $(this).data("preset"));

    presetToggleCorpus(".target-corpus", $(this).data("preset"));

    if ($("#comparisonCorpus").data("selected") != null) {
      $(".submit-keywords, .reset-keywords").show();
    }
  });

  $(".comparison-corpus .dropdown-item").click(function() {
    $("#comparisonCorpus").html($(this).html());
    $("#comparisonCorpus").data("selected", $(this).data("preset"));

    presetToggleCorpus(".comparison-corpus", $(this).data("preset"));

    if ($("#targetCorpus").data("selected") != null) {
      $(".submit-keywords, .reset-keywords").show();
    }
  });

  $(".explore .goto-advanced").click(function() {
    if (
      $(".explore .type > button[data-function='word_cloud']").hasClass(
        "active"
      )
    ) {
      if ($(this).hasClass("compare")) {
        query_explore = $(
          ".explore #compare_query_" + $(this).attr("data-table-num")
        )
          .text()
          .split(" ");

        $(".advanced-search.input-query").val(query_explore[0]);
        $(".search .advanced-search .datepicker-from")
          .datepicker()
          .val(query_explore[1] + "-01-01");
        $(".search .advanced-search .datepicker-to")
          .datepicker()
          .val(query_explore[3] + "-12-31");
      } else {
        query_explore = $(".explore #results_query")
          .text()
          .split(" ");

        $(".advanced-search.input-query").val(query_explore[0]);
        $(".search .advanced-search .datepicker-from")
          .datepicker()
          .val(query_explore[1] + "-01-01");
        $(".search .advanced-search .datepicker-to")
          .datepicker()
          .val(query_explore[3] + "-12-31");
      }
    } else {
    }

    $(".main-function[data-function='search']").trigger("click");
    $(".main-function[data-function='search']").addClass("active");
    $("#pills-advanced-tab").tab("show");
  });

  $(".explore .function-labels").click(function() {
    $(".explore .function-cards").show();
    $(".explore .function-labels").hide();
  });

  $(".explore .reset-terms").click(function() {
    if ($(this).hasClass("word_cloud")) {
      resetWC(true);
    } else if ($(this).hasClass("keywords")) {
      resetKeywords(true);
    } else if ($(this).hasClass("bubble")) {
      resetBubble(false);
    }
  });

  $(".explore .submit-terms").click(function() {
    getDistributionWC();
  });

  $(".explore .submit-kw-terms").click(function() {
    prepareKeywordsContribution();
  });

  $(".explore .reset-explore").click(function() {
    resetExplore();
  });

  $(".explore .distribution .export-png").click(function() {
    saveSvgAsPng($(".explore .distribution svg")[0], "line_chart.png", {
      backgroundColor: "white"
    });
  });

  $(".explore .word_cloud .export-png").click(function() {
    saveSvgAsPng(
      $(".explore .word_cloud #word_cloud svg")[0],
      "word_cloud.png",
      { backgroundColor: "white" }
    );
  });

  $(".explore .bubble .export-png").click(function() {
    saveSvgAsPng($(".explore .bubble #bubble svg")[0], "bubbles.png", {
      backgroundColor: "white"
    });
  });

  $(".explore .export-excel").click(function() {
    saveLineChartAsExcel();
  });

  $(".explore .export-csv").click(function() {
    saveLineChartAsCSV();
  });

  $(".explore .keywords .reset-keywords").click(function() {
    resetKeywords(false);
    $("#targetCorpus").html("Preset");
    $("#targetCorpus").data("selected", null);

    $("#comparisonCorpus").html("Preset");
    $("#comparisonCorpus").data("selected", null);
  });

  $(".explore .bubble .reset-bubble").click(function() {
    resetBubble(false);
  });

  // Slider word_cloud
  noUiSlider.create($("#slider_wc")[0], {
    connect: true,
    behaviour: "tap",
    start: [2000, 2019],
    range: {
      min: 1803,
      max: 2019
    }
  });

  var wc_range_nodes = [
    $(".word_cloud .lower-value")[0],
    $(".word_cloud .upper-value")[0]
  ];

  $("#slider_wc")[0].noUiSlider.on("change", function(
    values,
    handle,
    unencoded,
    isTap,
    positions
  ) {
    wc_range_nodes[handle].innerHTML = parseInt(values[handle]);
    wc_filter["year"][handle] = parseInt(values[handle]);

    exploreByWords();
  });

  $("#slider_wc")[0].noUiSlider.on("slide", function(
    values,
    handle,
    unencoded,
    isTap,
    positions
  ) {
    wc_range_nodes[handle].innerHTML = parseInt(values[handle]);
    wc_filter["year"][handle] = parseInt(values[handle]);

    $(".explore .word_cloud .rangeYear").html(
      wc_filter["year"][0] + " - " + wc_filter["year"][1]
    );
  });
});

$(".explore .word_cloud .terms-list").on(
  "click",
  " .delete-term > .fas.fa-minus",
  function() {
    num_queries--;

    var deleted_term = $(this)
      .parent()
      .siblings(".word")
      .attr("query");

    $.each(parameter_wc, function(index, value) {
      if (value["query"].replace(/\s/g, "") == deleted_term) {
        deleted_index = index;
      }
    });

    $.each(colours_queries, function(index, value) {
      if (parameter_wc[deleted_index]["colour"] == value[0]) {
        colours_queries[index][1] = false;
      }
    });

    wc_original_objects[deleted_index]["object"].style(
      "fill",
      wc_original_objects[deleted_index]["original_colour"]
    );

    delete parameter_wc[deleted_index];
    delete wc_original_objects[deleted_index];

    parameter_wc_aux = parameter_wc;
    parameter_wc = {};

    var j = 0;
    var i = 0;
    var counter = 0;

    while (counter < Object.keys(parameter_wc_aux).length) {
      if (parameter_wc_aux[i] != null) {
        parameter_wc[j] = parameter_wc_aux[i];
        j++;
        i++;
        counter++;
      } else {
        i++;
      }
    }

    $(this)
      .parents(".wordcloud-term")
      .remove();

    position = 0;
    flag_exit = false;

    if (num_queries == 0) {
      resetWC(false);
      $(".explore .distribution #line_chart").html("");
      $(".explore .distribution").hide();
    } else {
      getDistributionWC();
    }
  }
);

$(".explore .bubble .terms-list").on(
  "click",
  " .delete-term > .fas.fa-minus",
  function() {
    num_queries--;

    var deleted_term = $(this)
      .parent()
      .siblings(".word")
      .attr("query");

    $.each(parameter_bubble, function(index, value) {
      if (value["query"].replace(/\s/g, "") == deleted_term) {
        deleted_index = index;
      }
    });

    $.each(colours_queries, function(index, value) {
      if (parameter_bubble[deleted_index]["colour"] == value[0]) {
        colours_queries[index][1] = false;
      }
    });

    wc_original_objects[deleted_index]["object"].style(
      "fill",
      wc_original_objects[deleted_index]["original_colour"]
    );

    delete parameter_bubble[deleted_index];
    delete bubble_original_objects[deleted_index];

    parameter_bubble_aux = parameter_bubble;
    parameter_bubble = {};

    var j = 0;
    var i = 0;
    var counter = 0;

    while (counter < Object.keys(parameter_bubble_aux).length) {
      if (parameter_bubble_aux[i] != null) {
        parameter_bubble[j] = parameter_bubble_aux[i];
        j++;
        i++;
        counter++;
      } else {
        i++;
      }
    }

    $(this)
      .parents(".bubble-term")
      .remove();

    position = 0;
    flag_exit = false;

    if (num_queries == 0) {
      resetBubble(false);
      //$(".explore .distribution #line_chart").html("");
      //$(".explore .distribution").hide();
    } else {
      //getDistributionWC();
    }
  }
);

function prepareKeywordsContribution() {
  $(".explore .results").hide();
  $(".explore .compare-results").hide();

  if (num_queries > 1) {
    count_of_documents_compare = [0, 0, 0, 0];
    searchContributionCompare(
      parameter_bubble,
      [false, false, false, false],
      ".explore .compare-results"
    );
    $(".explore .compare.goto-advanced").css("display", "inline-block");
  } else {
    count_of_documents = 0;
    searchContribution(null, false, ".explore .results");
    $(".explore .results.goto-advanced").css("display", "inline-block");
  }
}

function presetToggleCorpus(corpus, type) {
  $(".explore .keywords " + corpus + " .kw-sect").hide();
  $(".explore .keywords " + corpus + " .kw-sect." + type).css(
    "display",
    "flex"
  );
}

function resetBubble(reset_flag) {
  num_queries = 0;
  parameter_bubble = {};
  bubble_original_objects = {};

  colours_queries = [
    ["#FF355E", false],
    ["#66FF66", false],
    ["#50BFE6", false],
    ["#FF9933", false]
  ];

  $(".explore .bubble .terms-list > div").html("");
  $(".explore .bubble .terms-list").hide();
  $(".explore .bubble .reset-terms").hide();
  $(".explore .bubble .submit").hide();

  $("#bubble svg g")
    .attr("fill", "#000")
    .attr("font-weight", "normal");
  $("#bubble svg g circle").attr("stroke", "none");

  if (reset_flag) {
    generateBubble();
    resetExploreFromVisual();
  }

  /*
  bubble_ajax_complete = true;
  bubble_distribution_ajax_complete = true;
  */
}

function resetWC(reset_flag) {
  num_queries = 0;
  parameter_wc = {};
  wc_original_objects = {};

  colours_queries = [
    ["#FF355E", false],
    ["#66FF66", false],
    ["#50BFE6", false],
    ["#FF9933", false]
  ];

  $(".explore .word_cloud .terms-list > div").html("");
  $(".explore .word_cloud .terms-list").hide();
  $(".explore .word_cloud .reset-terms").hide();
  $(".explore .word_cloud .submit").hide();

  if (reset_flag) {
    generateWC();

    resetExploreFromVisual();
  }

  wc_ajax_complete = true;
  wc_distribution_ajax_complete = true;
}

// exploreByWord filters data when years are updated
function exploreByWords() {
  resetWC(false);

  $(".explore .word_cloud").show();
  $(".explore .word_cloud .rangeYear").html(
    wc_filter["year"][0] + " - " + wc_filter["year"][1]
  );
  generateWC();
}

function exploreByKeywords() {
  resetKeywords(true);
  $(".explore .keywords").show();
}

function getKeywordsParameters(corpus, type) {
  if (corpus == "targetCorpus") {
    house = targetCorpusHouse;
    className = ".target-corpus";
    name = "Target";
  } else {
    house = comparisonCorpusHouse;
    className = ".comparison-corpus";
    name = "Comparison";
  }

  switch (type) {
    case "self-defined":
      var term = $(
        ".explore .keywords " +
          className +
          " input:text.keywords-search.input-query"
      ).val();

      var member = $(
        ".explore .keywords " +
          className +
          " .typeahead-members." +
          targetCorpusHouse
      ).val();

      var dateFrom_kw = $(
        ".explore .keywords " + className + " .datepicker-from"
      )
        .datepicker()
        .val();

      var dateTo_kw = $(".explore .keywords " + className + " .datepicker-to")
        .datepicker()
        .val();

      var preCalculated = ["false", null];

      if (term != "") {
        term = term.trim().replace(/\s+/g, " ");
      }

      if (member != "") {
        member = member.trim().replace(/\s+/g, " ");
      }

      break;

    case "wars":
      var term = "";
      var member = "";

      var war = $("[name='war" + name + "Radio']:checked").val();

      switch (war) {
        case "1812_war":
          var dateFrom_kw = "1812-06-18";
          var dateTo_kw = "1814-12-30";
          break;

        case "greek_war":
          var dateFrom_kw = "1821-02-21";
          var dateTo_kw = "1829-09-12";
          break;

        case "first-opium_war":
          var dateFrom_kw = "1839-07-04";
          var dateTo_kw = "1842-08-29";
          break;

        case "crimean_war":
          var dateFrom_kw = "1854-03-28";
          var dateTo_kw = "1856-03-30";
          break;

        case "anglo-zulu_war":
          var dateFrom_kw = "1879-01-11";
          var dateTo_kw = "1879-07-04";
          break;

        case "first-boer_war":
          var dateFrom_kw = "1880-12-20";
          var dateTo_kw = "1881-03-23";
          break;

        case "second-boer_war":
          var dateFrom_kw = "1889-10-11";
          var dateTo_kw = "1902-05-31";
          break;

        case "wwi_war":
          var dateFrom_kw = "1914-08-04";
          var dateTo_kw = "1918-11-11";
          break;

        case "wwii_war":
          var dateFrom_kw = "1939-09-01";
          var dateTo_kw = "1945-05-08";
          break;

        case "faklands_war":
          var dateFrom_kw = "1982-04-02";
          var dateTo_kw = "1982-06-14";
          break;

        case "persian_war":
          var dateFrom_kw = "1990-08-02";
          var dateTo_kw = "1991-02-28";
          break;

        case "iraq_war":
          var dateFrom_kw = "2003-03-19";
          var dateTo_kw = "2011-05-22";
          break;
      }

      var preCalculated = ["wars", war];

      break;

    case "parliament":
      var parliament = $(
        ".explore " + className + " input:text.typeahead-parliament"
      ).val();

      var date = parliament.split("-");

      var term = "";
      var member = "";
      var dateFrom_kw = date[0] + "-01-01";
      var dateTo_kw = date[1] + "-12-31";

      var preCalculated = ["parliaments", parliament];

      break;

    case "decades":
      var decade = $(
        ".explore " + className + " input:text.typeahead-decades"
      ).val();

      var date = decade.split("-");

      var term = "";
      var member = "";
      var dateFrom_kw = date[0] + "-01-01";
      var dateTo_kw = date[1] + "-12-31";

      var preCalculated = ["decades", decade];

      break;
  }

  if (corpus == "targetCorpus") {
    dateFrom = dateFrom_kw;
    dateTo = dateTo_kw;
  }

  parameter_kw[corpus] = {
    term: term,
    member: member,
    dateFrom: dateFrom_kw,
    dateTo: dateTo_kw,
    house: house,
    preCalculated: preCalculated
  };

  console.log(parameter_kw);
}

function prepareKeywords() {
  var type_search = $("#targetCorpus").data("selected");
  getKeywordsParameters("targetCorpus", type_search);

  var type_search = $("#comparisonCorpus").data("selected");
  getKeywordsParameters("comparisonCorpus", type_search);
}

function resetKeywords(reset_flag) {
  parameter_kw = {};

  $(".explore .bubble").hide();
  $(".explore .bubble svg").html("");

  $(".explore .keywords input:text.keywords-search.input-query").val("");

  $(".explore .keywords .typeahead-members").val("");
  $(".explore .keywords input:text.typeahead-decades").val("");

  $(".explore .keywords .reset-keywords").hide();
  $(".explore .keywords .submit-keywords").hide();
  $(".explore .keywords .parliament").css("display", "none");
  $(".explore .keywords .self-defined").css("display", "none");
  $(".explore .keywords .wars").css("display", "none");
  $(".explore .keywords .decades").css("display", "none");

  if (reset_flag) {
    $("#comparisonCorpus").html("Preset");
    $("#targetCorpus").html("Preset");
    //$("#targetCorpus").data("selected", null);
    //$("#comparisonCorpus").data("selected", null);
    $(".explore .keywords").hide();
  }
}

function generateBubble() {
  if (bubble_ajax != null) {
    bubble_ajax.abort();
  }

  if (!bubble_ajax_complete) {
    cancelSQLQuery("." + selected_mode + " .bubble");
  }

  if (checkLimitsKeywords()) {
    bubble_ajax = $.ajax({
      url: "src/php/explore_functions.php",
      type: "post",
      data: { action: "bubble", params: parameter_kw },

      beforeSend: function() {
        $(".explore .bubble").show();

        bubble_ajax_complete = false;
        $(".explore #bubble svg").hide();

        $(".explore .bubble .loader").css("display", "block");
        $(".explore .bubble .cancel-query").css("display", "flex");

        $("html, body").animate(
          {
            scrollTop: $(".explore .bubble #bubble").offset().top
          },
          500
        );
      },

      complete: function() {
        updateSearchButtonOff();
        bubble_ajax_complete = true;
        $(".explore .bubble .loader").css("display", "none");
        $(".explore .bubble .cancel-query").css("display", "none");

        $(".explore #bubble svg").show();

        $("html, body").animate(
          {
            scrollTop: $("#bubble").offset().top
          },
          500
        );
      },
      success: function(data, status) {
        if (data) {
          if (data.indexOf("Out of memory") != -1) {
            const regex = / Out of memory \(allocated ([0-9]*)\) \(tried to allocate ([0-9]*) bytes\)/;
            const result = data.match(regex);

            $("#warningMemory .memory-error").html(
              parseInt((parseInt(result[1]) + parseInt(result[2])) / 1048576) +
                " MB required"
            );
            $("#warningMemoryDev").modal("show");

            //$("#warningMemoryProd").modal("show");
          } else {
            bubble("./tmp/" + data, parameter_kw["targetCorpus"]["term"]);
            console.log("./tmp/" + data);
          }
        } else {
          $(".error-code").html("1 - bubble");
          $("#error").modal("show");
        }
      },
      error: function(xhr, desc, err) {
        if (err != "abort") {
          console.log(xhr);
          console.log("Details: " + desc + "\nError:" + err);
          $(".error-code").html("2 - bubble");
          $("#error").modal("show");
        }
      }
    });
  } else {
    $("#warningKeywordsLarge").modal("show");
  }
}

function generateWC() {
  if (wc_ajax != null) {
    wc_ajax.abort();
  }

  wc_ajax = $.ajax({
    url: "src/php/explore_functions.php",
    type: "post",
    data: { action: "wordcloud", house: selected_house, params: wc_filter },

    beforeSend: function() {
      wc_ajax_complete = false;
      $("#word_cloud").html("");

      $(".explore .word_cloud .loader").css("display", "block");
      $(".explore .word_cloud .cancel-query").css("display", "flex");
    },

    complete: function() {
      updateSearchButtonOff();
      wc_ajax_complete = true;
      $(".explore .word_cloud .loader").css("display", "none");
      $(".explore .word_cloud .cancel-query").css("display", "none");
      $("html, body").animate(
        {
          scrollTop: $("#word_cloud").offset().top
        },
        500
      );
    },
    success: function(data, status) {
      if (data) {
        try {
          wordsAux = JSON.parse(data);

          offset = convertRemToPixels(5);

          if (min_1500.matches) {
            sizes = [990 - offset, 500];
          } else if (min_1200.matches) {
            sizes = [768 - offset, 500];
          } else if (min_992.matches) {
            sizes = [590 - offset, 450];
          } else if (min_768.matches) {
            sizes = [768 - offset, 250];
          } else if (min_576.matches) {
            sizes = [576 - offset, 250];
          } else {
            sizes = [300, 250];
          }

          var cloud = d3
            .wordcloud()
            .size(sizes)
            .fill(
              d3.scale
                .ordinal()
                /*.range([
                  "#838B8B",
                  "#668B8B",
                  "#2F4F4F",
                  "#528B8B",
                  "#388E8E",
                  "#8FD8D8",
                  "#70DBDB",
                  "#8DEEEE",
                  "#008B8B",
                  "#00FFFF",
                  "#BBFFFF",
                  "#00CED1"
                ])*/
                .range([
                  "#d3d6de",
                  "#c4c8d4",
                  "#b6bac9",
                  "#a7acbe",
                  "#989fb3",
                  "#8a91a8",
                  "#7b839d",
                  "#6c7592",
                  "#626a84",
                  "#2f3337"
                ])
            )
            .words(
              deepCopyWordCloud(wordsAux).filter(function(d, i) {
                return d;
              })
            )
            .onwordclick(function(d, i, text_tag) {
              if (num_queries < 4) {
                var flag_repeated = false;
                var selected_colour;

                for (var i = 0; i < num_queries; i++) {
                  if (parameter_wc[i]["query"] == d.text) {
                    flag_repeated = true;
                  }
                }

                if (!flag_repeated) {
                  if (num_queries == 0) {
                    $(".explore .word_cloud .terms-list").show();
                    $(".explore .word_cloud .reset-terms").show();
                    $(".explore .word_cloud .submit").show();
                  }

                  var flag_exit = false;
                  $.each(colours_queries, function(index, value) {
                    if (!flag_exit) {
                      if (!value[1]) {
                        selected_colour = value[0];
                        colours_queries[index][1] = true;
                        flag_exit = true;
                      }
                    }
                  });

                  wc_original_objects[num_queries] = {};
                  wc_original_objects[num_queries]["object"] = text_tag;
                  wc_original_objects[num_queries][
                    "original_colour"
                  ] = text_tag.style("fill");

                  parameter_wc[num_queries] = {};
                  parameter_wc[num_queries]["colour"] = selected_colour;
                  parameter_wc[num_queries]["query"] = d.text;
                  parameter_wc[num_queries]["term"] = d.text;

                  $(".explore .word_cloud .terms-list > div").append(
                    "<div class='wordcloud-term'><span class='word' style='color:" +
                      selected_colour +
                      "' query='" +
                      d.text +
                      "'>" +
                      d.text +
                      "</span> <span class='badge badge-danger delete-term' title='Delete term'><i class='fas fa-minus'></i></span></div>"
                  );
                  text_tag.style("fill", selected_colour);

                  num_queries++;
                }
              } else {
                $("#warningModalMaxTerms").modal("show");
              }
            })
            .start();
        } catch (e) {
          $(".error-code").html("2 - wordcloud");
          $("#error").modal("show");
        }
      }
    },
    error: function(xhr, desc, err) {
      if (err != "abort") {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
        $(".error-code").html("2 - wordcloud");
        $("#error").modal("show");
      }
    }
  });
}

function deepCopyWordCloud(oldValue) {
  var newValue;
  strValue = JSON.stringify(oldValue);
  return (newValue = JSON.parse(strValue));
}

function resetDistribution() {
  $(".explore .results #contribution_table").bootstrapTable("removeAll");
  $(".explore .results").hide();

  $(".explore .compare-results table").bootstrapTable("removeAll");
  $(".explore .compare-results").hide();
}

function getDistributionWC() {
  /*
  $(".explore .convert-rank")
    .parent(".custom-control")
    .removeClass("hidden");
  $(".explore .convert-kwic-doc")
    .parent(".custom-control")
    .addClass("hidden");
  */

  if (wc_filter["year"][0] < wc_filter["year"][1]) {
    dateFrom = wc_filter["year"][0];
    dateTo = wc_filter["year"][1];
  } else {
    dateTo = wc_filter["year"][0];
    dateFrom = wc_filter["year"][1];
  }

  if (!wc_distribution_ajax_complete) {
    wc_distribution_ajax.abort();
  }

  wc_distribution_ajax = $.ajax({
    url: "src/php/explore_functions.php",
    type: "post",
    data: {
      parameters: parameter_wc,
      action: "multiple_line_chart",
      house: selected_house,
      dateFrom: dateFrom,
      dateTo: dateTo
    },

    beforeSend: function() {
      resetDistribution();

      wc_distribution_ajax_complete = false;

      $(".explore .distribution #line_chart").html("");
      $(".explore .distribution").show();

      $(".explore .distribution .loader").css("display", "block");
      $(".explore .distribution .cancel-query").css("display", "flex");

      $("html, body").animate(
        {
          scrollTop: $(".explore .distribution #line_chart").offset().top
        },
        500
      );
    },

    complete: function() {
      updateSearchButtonOff();
      wc_distribution_ajax_complete = true;

      $(".explore .distribution .loader").css("display", "none");
      $(".explore .distribution .cancel-query").css("display", "none");

      $("html, body").animate(
        {
          scrollTop: $(".explore .distribution #line_chart").offset().top
        },
        500
      );
    },

    success: function(data, status) {
      if (data) {
        try {
          if (selected_house == "both") {
            label_y = "Frequency (per million)";
          } else {
            label_y = "Frequency (per million)";
          }

          data_json = JSON.parse(data);
          freq_line_data = data_json;

          nv.addGraph(function() {
            chart = nv.models.lineChart().options({
              transitionDuration: 2000,
              useInteractiveGuideline: true
            });
            chart.xAxis
              .axisLabel("Year")
              .tickFormat(d3.format("d"))
              .staggerLabels(false);
            chart.yAxis
              .axisLabel(label_y)
              .tickFormat(d3.format(".2f"))
              .staggerLabels(false);
            chart.lines.dispatch.on("elementClick", function(e) {
              if (range_of_dates_distrib.length == 0) {
                range_of_dates_distrib.push(e[0].point.x);

                $(".explore .nv-point.nv-point-" + e[0].pointIndex).addClass(
                  "selected"
                );
                $(".explore .distribution .timeline-one").html(e[0].point.x);
              } else if (range_of_dates_distrib.length == 1) {
                range_of_dates_distrib.push(e[0].point.x);
                $(".explore .nv-point.nv-point-" + e[0].pointIndex).addClass(
                  "selected"
                );
                $(".explore .distribution .timeline-two").html(e[0].point.x);

                if (range_of_dates_distrib[0] > range_of_dates_distrib[1]) {
                  dateFrom = range_of_dates_distrib[1];
                  dateTo = range_of_dates_distrib[0];
                } else {
                  dateFrom = range_of_dates_distrib[0];
                  dateTo = range_of_dates_distrib[1];
                }

                if (num_queries > 1) {
                  count_of_documents_compare = [0, 0, 0, 0];
                  CLICKED_POINTS_DISTRIB = e;
                  searchContributionCompare(
                    e,
                    [false, false, false, false],
                    ".explore .compare-results"
                  );
                  $(".explore .compare.goto-advanced").css(
                    "display",
                    "inline-block"
                  );
                } else {
                  count_of_documents = 0;
                  CLICKED_POINTS_DISTRIB = e;
                  searchContribution(e, false, ".explore .results");
                  $(".explore .results.goto-advanced").css(
                    "display",
                    "inline-block"
                  );
                }
              } else if (range_of_dates_distrib.length == 2) {
                resetFromDistributionExplore();
                range_of_dates_distrib.push(e[0].point.x);
                $(".explore .nv-point.nv-point-" + e[0].pointIndex).addClass(
                  "selected"
                );
                $(".explore .distribution .timeline-one").html(e[0].point.x);
              }
            });

            d3.select(".explore #line_chart")
              .append("svg")
              .datum(data_json)
              .call(chart);
            nv.utils.windowResize(chart.update);
            return chart;
          });
        } catch (e) {
          $(".error-code").html("1 - wc distribution");
          $("#error").modal("show");
        }
      } else {
        $(".explore .distribution #line_chart").html(
          "<div style='text-align:center'><text class='nvd3 nv-noData' style='text-anchor: middle;'>Error!</text></div>"
        );
        $(".error-code").html("2 - wc distribution");
        $("#error").modal("show");
      }
    },
    error: function(xhr, desc, err) {
      if (err != "abort") {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
        $(".error-code").html("3 - wc distribution");
        $("#error").modal("show");
      }
    }
  });
}

function resetFromDistributionExplore() {
  range_of_dates_distrib = [];

  $(".nv-point").removeClass("selected");

  dateFrom = 0;
  dateTo = 0;

  $(
    ".explore .distribution .timeline-one, .explore .distribution .timeline-two"
  ).html("");
}

function resetExploreFromVisual() {
  $(".explore .distribution").hide();
  $(".explore .results").hide();
  $(".explore .compare-results").hide();
  $(".explore .members").hide();
  $(".explore .contribution").hide();
}

function resetExplore() {
  abortAjax();

  hideResultsExplore();
  resetListsExplore();

  $(".explore .type > button").removeClass("active");
  $("#tooltip").remove();
}

function hideResultsExplore() {
  $(".explore .distribution").hide();
  $(".explore .results").hide();
  $(".explore .compare-results").hide();
  $(".explore .members").hide();
  $(".explore .contribution").hide();
  $(".explore .word_cloud").hide();
  $("#word_cloud").html("");
  resetWC(false);
  $(".explore .bubble").hide();
  resetBubble(false);
  resetKeywords(true);
}

function resetAllExplore() {
  resetExplore();
}

function resetListsExplore() {
  $(".explore .word_cloud .terms-list > div").html("");
  $(".explore .bubble .terms-list > div").html("");
}

function checkLimitsKeywords() {
  if (parameter_kw["targetCorpus"]["preCalculated"][0] == "false") {
    if (
      (parameter_kw["targetCorpus"]["dateFrom"].substring(0, 2) == "18" &&
        parameter_kw["targetCorpus"]["dateTo"].substring(0, 4) -
          parameter_kw["targetCorpus"]["dateFrom"].substring(0, 4) <
          10) ||
      (parameter_kw["targetCorpus"]["dateFrom"].substring(0, 2) != "18" &&
        parameter_kw["targetCorpus"]["dateTo"].substring(0, 4) -
          parameter_kw["targetCorpus"]["dateFrom"].substring(0, 4) <
          4) ||
      (parameter_kw["targetCorpus"]["term"] != "" &&
        parameter_kw["targetCorpus"]["dateFrom"].substring(0, 2) != "18" &&
        parameter_kw["targetCorpus"]["dateTo"].substring(0, 4) -
          parameter_kw["comparisonCorpus"]["dateFrom"].substring(0, 4) <
          25)
    ) {
      targetCorpus_flag = true;
    } else {
      targetCorpus_flag = false;
    }
  } else {
    targetCorpus_flag = true;
  }

  if (parameter_kw["comparisonCorpus"]["preCalculated"][0] == "false") {
    if (
      (parameter_kw["comparisonCorpus"]["dateFrom"].substring(0, 2) == "18" &&
        parameter_kw["comparisonCorpus"]["dateTo"].substring(0, 4) -
          parameter_kw["comparisonCorpus"]["dateFrom"].substring(0, 4) <
          10) ||
      (parameter_kw["comparisonCorpus"]["dateFrom"].substring(0, 2) != "18" &&
        parameter_kw["comparisonCorpus"]["dateTo"].substring(0, 4) -
          parameter_kw["comparisonCorpus"]["dateFrom"].substring(0, 4) <
          5) ||
      (parameter_kw["comparisonCorpus"]["term"] != "" &&
        parameter_kw["comparisonCorpus"]["dateFrom"].substring(0, 2) != "18" &&
        parameter_kw["comparisonCorpus"]["dateTo"].substring(0, 4) -
          parameter_kw["comparisonCorpus"]["dateFrom"].substring(0, 4) <
          25)
    ) {
      comparisonCorpus_flag = true;
    } else {
      comparisonCorpus_flag = false;
    }
  } else {
    comparisonCorpus_flag = true;
  }

  return targetCorpus_flag && comparisonCorpus_flag;
}
