// Global variables of search.js
var DATA;

var distribution_ajax_complete = true;
var contribution_ajax_complete = true;

var hits_ajax_complete = true;
var hits_ajax = null;
var hits_compare_ajax_complete = [true, true, true, true];
var hits_ajax_compare = [null, null, null, null];

var distribution_ajax = null;
var wc_distribution_ajax = null;

var search_rank = false;
var flag_normalised = true;

var num_queries = 0;
var colours_queries = [
  ["#FF355E", false],
  ["#66FF66", false],
  ["#50BFE6", false],
  ["#FF9933", false]
];

var dateFrom;
var dateTo;

var range_of_dates_distrib = [];

var freq_line_data;

var count_flag = false;
var count_of_documents = 0;

var count_of_documents_compare = [0, 0, 0, 0];
var count_flag_compare = [false, false, false, false];

var selected_semantic_tags = [];
var context = 10;
var parameters;

var CLICKED_POINTS_DISTRIB;

var SELECTED_ID;
var SELECTED_QUERY;

var SEMANTIC_SEARCH = false;

var parameter_basic = {};
var parameter_advanced = {};

$.xhrPool = [];

$.xhrPool.abortAll = function() {
  $(this).each(function(i, jqXHR) {
    jqXHR.abort();
    $.xhrPool.splice(i, 1);
  });
};

$(function() {
  // Date picker
  $(".advanced-search .datepicker-from").datepicker({
    format: "yyyy-mm-dd",
    value: "2000-01-01",
    minDate: "1803-11-22",
    maxDate: "2019-11-05",
    uiLibrary: "bootstrap4",
    change: function(e) {
      updateSearchButtonOn();
    }
  });

  $(".advanced-search .datepicker-to").datepicker({
    format: "yyyy-mm-dd",
    value: "2019-11-05",
    minDate: "1803-11-22",
    maxDate: "2019-11-05",
    uiLibrary: "bootstrap4",
    change: function(e) {
      updateSearchButtonOn();
    }
  });

  // Auto complete
  $.get(
    "config/forms/typeahead_members_commons.json",
    function(data) {
      $(
        ".search-box .typeahead.typeahead-members.commons, .keywords.typeahead.typeahead-members.commons"
      ).typeahead({
        source: data
      });
    },
    "json"
  );

  $.get(
    "config/forms/typeahead_members_lords.json",
    function(data) {
      $(
        ".search-box .typeahead.typeahead-members.lords, .keywords.typeahead.typeahead-members.lords"
      ).typeahead({
        source: data
      });
    },
    "json"
  );

  $.get(
    "config/forms/typeahead_members_both.json",
    function(data) {
      $(
        ".search-box .typeahead.typeahead-members.both, .keywords.typeahead.typeahead-members.both"
      ).typeahead({
        source: data
      });
    },
    "json"
  );

  //  Search box interactions

  $(".cancel-query").click(function() {
    if (
      $(this)
        .data("cancel")
        .indexOf("bubble") != -1
    ) {
      bubble_ajax.abort();
      cancelRScripts();
    }
    cancelSQLQuery("." + selected_mode + " ." + $(this).data("cancel"));
  });

  $(".related-search.basic-search").click(function() {
    relatedTerms();
  });

  $(".basic-search.related-terms").on("click", ".add", function() {
    related_term = $(this)
      .html()
      .replace("_", " ");
    $(".search input:text.basic-search.input-query").val(related_term);

    resetRelatedTerms();
  });

  $(".basic-search.related-terms").on("click", ".reset", function() {
    resetRelatedTerms();
  });

  $(".reset-term.basic-search, .reset-term.advanced-search").click(function() {
    resetAllSearch();
  });

  $(".tooltip-config").change(function() {
    if ($(this).is(":checked")) {
      $(".tooltip-config").prop("checked", true);

      $("[data-toggle='tooltip'], .help, th").tooltip("enable");

      $(".semantic-tags-search.advanced-search").attr("title", "");
      $(".related-search.basic-search").attr("title", "");
    } else {
      $(".tooltip-config").prop("checked", false);

      $("[data-toggle='tooltip'], .help, th, .keep-open.btn-group").tooltip(
        "disable"
      );

      $(".semantic-tags-search.advanced-search").attr("title", "Disambiguate");
      $(".related-search.basic-search").attr("title", "Related terms");
    }
  });

  $(
    ".basic-search .input-query, .basic-search .annual-from,  .basic-search .annual-to "
  ).keydown(function(e) {
    if (e.which == 13) {
      prepareBasicQuery();
    } else {
      updateSearchButtonOn();
    }
  });

  $(".basic-search .submit").click(function() {
    prepareBasicQuery();
  });

  $("#pills-advanced-tab").click(function() {
    resetAllSearch();
    $("section.search > .row > .search-box").removeClass("col-xl-10 col-lg-12");

    $("section.search > .row > .search-box").addClass("col-12");
    selected_subfunction = "advanced";
  });

  $("#pills-basic-tab").click(function() {
    resetAllSearch();

    $("section.search > .row > .search-box").addClass("col-xl-10 col-lg-12");

    $("section.search > .row > .search-box").removeClass("col-12");
    selected_subfunction = "basic";
  });

  $(".advanced-search").on(
    "click",
    ".terms-list .compare-term .delete-term > .fas.fa-minus",
    function() {
      $(this)
        .parents(".compare-term")
        .remove();
      num_queries--;

      var deleted_term = $(this)
        .parent()
        .siblings(".word")
        .attr("query");

      $.each(parameter_advanced, function(index, value) {
        if (value["query"].replace(/\s/g, "") == deleted_term) {
          deleted_index = index;
        }
      });

      $.each(colours_queries, function(index, value) {
        if (parameter_advanced[deleted_index]["colour"] == value[0]) {
          colours_queries[index][1] = false;
        }
      });

      delete parameter_advanced[deleted_index];

      parameter_advanced_aux = parameter_advanced;
      parameter_advanced = {};

      var j = 0;
      var i = 0;
      var counter = 0;

      while (counter < Object.keys(parameter_advanced_aux).length) {
        if (parameter_advanced_aux[i] != null) {
          parameter_advanced[j] = parameter_advanced_aux[i];
          j++;
          i++;
          counter++;
        } else {
          i++;
        }
      }

      hideResultsSearch();
      resetBadgesAndButtons();

      if (
        $("." + selected_mode + " .compare-term .delete-term > .fas.fa-minus")
          .length != 0
      ) {
        if (num_queries > 0) {
          getDistributionAdvanced();
        }
      } else {
        $("." + selected_mode + " .terms-list > div").html("");
        $("." + selected_mode + " .terms-list").hide();
      }
    }
  );

  $(".basic-search").on(
    "click",
    ".terms-list .compare-term .delete-term > .fas.fa-minus",
    function() {
      $(this)
        .parents(".compare-term")
        .remove();
      num_queries--;

      deleted_term = $(this)
        .parent()
        .siblings(".word")
        .attr("query");

      $.each(parameter_basic, function(index, value) {
        if (value["query"].trim() == deleted_term) {
          deleted_index = index;
        }
      });

      $.each(colours_queries, function(index, value) {
        if (parameter_basic[deleted_index]["colour"] == value[0]) {
          colours_queries[index][1] = false;
        }
      });

      delete parameter_basic[deleted_index];

      parameter_basic_aux = parameter_basic;
      parameter_basic = {};

      var j = 0;
      var i = 0;
      var counter = 0;

      while (counter < Object.keys(parameter_basic_aux).length) {
        if (parameter_basic_aux[i] != null) {
          parameter_basic[j] = parameter_basic_aux[i];
          j++;
          i++;
          counter++;
        } else {
          i++;
        }
      }

      hideResultsSearch();
      resetBadgesAndButtons();

      if (
        $("." + selected_mode + " .compare-term .delete-term > .fas.fa-minus")
          .length != 0
      ) {
        if (num_queries > 0) {
          getDistribution();
        }
      } else {
        $("." + selected_mode + " .terms-list > div").html("");
        $("." + selected_mode + " .terms-list").hide();
      }
    }
  );

  $(
    ".basic-search .date-time.annual .annual-from, .basic-search .date-time.annual .annual-to"
  ).change(function() {
    updateSearchButtonOn();
  });

  $(".advanced-search .input-query").keydown(function(e) {
    if (e.which == 13) {
      if (
        $(".search input:text.advanced-search.input-query")
          .val()
          .trim()
          .replace(/\s+/g, "") != ""
      ) {
        prepareAdvancedQuery();
      } else {
        $(".search input:text.advanced-search.input-query").addClass(
          "is-invalid"
        );
      }
    } else {
      updateSearchButtonOn();
    }
  });

  $(".advanced-search .input-description").keydown(function(e) {
    if (e.which == 13) {
      if (
        $(".search input:text.advanced-search.input-description")
          .val()
          .trim()
          .replace(/\s+/g, "") != ""
      ) {
        prepareAdvancedQuery();
      } else {
        $(".search input:text.advanced-search.input-description").addClass(
          "is-invalid"
        );
      }
    } else {
      updateSearchButtonOn();
    }
  });

  $(".advanced-search .typeahead-members").keydown(function(e) {
    if (e.which == 13) {
      prepareAdvancedQuery();
    } else {
      updateSearchButtonOn();
    }
  });

  $(".advanced-search .submit").click(function() {
    prepareAdvancedQuery();
  });

  $(".advanced-search .datepicker").keydown(function(e) {
    if (e.which == 13) {
      prepareAdvancedQuery();
    } else {
      updateSearchButtonOn();
    }
  });

  // Contribution interactions

  $("button.analysis").click(function() {
    $("button.analysis").removeClass("active");
    $(this).addClass("active");
    saveOriginalContribution();
  });

  $(".contribution button.kw-analysis").click(function() {
    KWAnalysis("." + selected_mode);
  });

  $(".advanced-search, .basic-search").on(
    "click",
    ".semantic-tags.reset",
    function() {
      $("." + selected_mode + " .advanced-search .semantic-tags-list").hide();
      $(
        "." + selected_mode + " .advanced-search .semantic-tags-list > div"
      ).html("");
    }
  );

  // Export visualisations

  $(".search .export-excel").click(function() {
    saveLineChartAsExcel();
  });

  $(".search .export-csv").click(function() {
    saveLineChartAsCSV();
  });

  $(".search .export-png").click(function() {
    saveSvgAsPng($(".search .line-chart svg")[0], "line_chart.png", {
      backgroundColor: "white"
    });
    $("#downloadFile").modal("show");
  });

  // Concordances interactions

  $(".selections").click(function() {
    if (selected_mode == "search") {
      if ($(".search .convert-kwic-doc").is(":checked")) {
        action = "contribution-kwic";
      } else {
        action = "contribution";
      }
    } else {
      if ($(".explore .convert-kwic-doc").is(":checked")) {
        action = "contribution-kwic";
      } else {
        action = "contribution";
      }
    }

    var offset;

    if ($(this).hasClass("compare")) {
      table_num = $(this).data("table-num");

      data_json = JSON.stringify(
        $("." + selected_mode + " #compare_table_" + table_num).bootstrapTable(
          "getSelections"
        )
      );

      if (data_json.length > 0) {
        if (action == "contribution") {
          data = $(
            "." + selected_mode + " #compare_table_" + table_num
          ).bootstrapTable("getSelections");
          offset =
            ($(
              "." + selected_mode + " #compare_table_" + table_num
            ).bootstrapTable("getOptions").pageNumber -
              1) *
            $(
              "." + selected_mode + " #compare_table_" + table_num
            ).bootstrapTable("getOptions").pageSize;

          saveResultsAsZip(data, offset);
        } else if (action == "contribution-kwic") {
          $("#tsv-excel").attr(
            "table",
            "." + selected_mode + " #compare_table_" + table_num
          );
          $("#tsv-excel").modal("show");
        }
      }
    } else if ($(this).hasClass("results")) {
      data_json = JSON.stringify(
        $("." + selected_mode + " #results_table").bootstrapTable(
          "getSelections"
        )
      );
      data = $("." + selected_mode + " #results_table").bootstrapTable(
        "getSelections"
      );

      offset =
        ($("." + selected_mode + " #results_table").bootstrapTable("getOptions")
          .pageNumber -
          1) *
        $("." + selected_mode + " #results_table").bootstrapTable("getOptions")
          .pageSize;

      if (data_json.length > 0) {
        if (action == "contribution") {
          saveResultsAsZip(data, offset);
        } else if (action.indexOf("kwic") != -1) {
          $("#tsv-excel").attr(
            "table",
            "." + selected_mode + " #results_table"
          );
          $("#tsv-excel").modal("show");
        }
      }
    }
  });

  $(".excel-selections").click(function() {
    saveResultsAsExcel();
  });

  $(".tsv-selections").click(function() {
    saveResultsAsTSV();
  });

  $(".convert-rank").click(function() {
    $("." + selected_mode + " .convert-rank").prop(
      "checked",
      $(this).prop("checked")
    );

    if ($(this).is(":checked")) {
      search_rank = true;
    } else {
      search_rank = false;
    }

    if (selected_submode == "basic" || selected_submode == "wordcloud") {
      if ($(this).hasClass("compare")) {
        searchContributionCompare(
          CLICKED_POINTS_DISTRIB,
          [false, false, false, false],
          "." + selected_mode + " .compare-results"
        );
      } else if ($(this).hasClass("results")) {
        searchContribution(
          CLICKED_POINTS_DISTRIB,
          false,
          "." + selected_mode + " .results"
        );
      }
    } else if (selected_submode == "keywords") {
      if ($(this).hasClass("compare")) {
        searchContributionAdvancedCompare(
          parameter_bubble,
          [false, false, false, false],
          "." + selected_mode + " .compare-results"
        );
      } else {
        searchContributionAdvanced(
          null,
          false,
          "." + selected_mode + " .results"
        );
      }
    } else if (selected_submode == "advanced") {
      if ($(this).hasClass("compare")) {
        searchContributionAdvancedCompare(
          CLICKED_POINTS_DISTRIB,
          [false, false, false, false],
          "." + selected_mode + " .compare-results"
        );
      } else {
        searchContributionAdvanced(
          CLICKED_POINTS_DISTRIB,
          false,
          "." + selected_mode + " .results"
        );
      }
    }
  });

  $(".convert-kwic-doc").click(function() {
    $("." + selected_mode + " .convert-kwic-doc").prop(
      "checked",
      $(this).prop("checked")
    );

    if ($(this).prop("checked")) {
      $("." + selected_mode + " .context-word-container").show();
    } else {
      $("." + selected_mode + " .context-word-container").hide();
    }

    //compare more than one term is available on these modes
    if (selected_submode == "basic" || selected_submode == "wordcloud") {
      if ($(this).hasClass("compare")) {
        searchContributionCompare(
          CLICKED_POINTS_DISTRIB,
          [false, false, false, false],
          "." + selected_mode + " .compare-results"
        );
      } else if ($(this).hasClass("results")) {
        searchContribution(
          CLICKED_POINTS_DISTRIB,
          false,
          "." + selected_mode + " .results"
        );
      }
    } else if (selected_submode == "keyword") {
      if ($(this).hasClass("compare")) {
        searchContributionCompare(
          null,
          [false, false, false, false],
          "." + selected_mode + " .compare-results"
        );
      } else if ($(this).hasClass("results")) {
        searchContribution(
          parameter_bubble,
          false,
          "." + selected_mode + " .results"
        );
      }
    } else if (selected_submode == "advanced") {
      if ($(this).hasClass("compare")) {
        searchContributionAdvancedCompare(
          CLICKED_POINTS_DISTRIB,
          [false, false, false, false],
          "." + selected_mode + " .compare-results"
        );
      } else {
        searchContributionAdvanced(
          CLICKED_POINTS_DISTRIB,
          false,
          "." + selected_mode + " .results"
        );
      }
    }
  });

  $(".update-kwic").click(function() {
    $(".update-kwic").addClass("invisible");

    //compare more than one term is available on these modes
    if (selected_submode == "basic" || selected_submode == "wordcloud") {
      if ($(this).hasClass("compare")) {
        searchContributionCompare(
          CLICKED_POINTS_DISTRIB,
          [false, false, false, false],
          "." + selected_mode + " .compare-results"
        );
      } else if ($(this).hasClass("results")) {
        searchContribution(
          CLICKED_POINTS_DISTRIB,
          false,
          "." + selected_mode + " .results"
        );
      }
    } else if (selected_submode == "keywords") {
      if ($(this).hasClass("compare")) {
        searchContributionCompare(
          null,
          [false, false, false, false],
          "." + selected_mode + " .compare-results"
        );
      } else if ($(this).hasClass("results")) {
        searchContribution(
          parameter_bubble,
          false,
          "." + selected_mode + " .results"
        );
      }
    } else if (selected_submode == "advanced") {
      prepareAdvancedQuery();
    }
  });

  $(".convert-title").click(function() {
    if ($(this).prop("checked")) {
      $("." + selected_mode + " .table").bootstrapTable(
        "showColumn",
        "description"
      );
    } else {
      $("." + selected_mode + " .table").bootstrapTable(
        "hideColumn",
        "description"
      );
    }

    $("." + selected_mode + " .convert-title").prop(
      "checked",
      $(this).prop("checked")
    );
  });

  $(".context-word").change(function() {
    $(".context-word").val($(this).val());
    context = $(this).val();
    $(".update-kwic").removeClass("invisible");
  });

  // Individual contribution interactions

  $(".contribution .reset-contribution").click(function() {
    resetContribution();
  });

  $(".ner-help").click(function() {
    $("#ner-categories").modal("show");
  });

  $(".sem-help").click(function() {
    if ($(":checkbox.complex-tags").is(":checked")) {
      window.open("./pdf/Full-Semantic-Categories.pdf", "_blank");
    } else {
      $("#sem-categories").modal("show");
    }
  });
});

function getTotalHits(compare_flag, identif) {
  if (selected_mode == "search") {
    if (!compare_flag) {
      if (!hits_ajax_complete) {
        hits_ajax.abort();
      }

      if (selected_submode == "basic") {
        hits_ajax = $.ajax({
          url: "src/php/search_functions.php",
          type: "post",
          data: {
            type: "basic",
            parameters: parameter_basic[identif],
            action: "hits",
            house: selected_house,
            dateFrom: dateFrom,
            dateTo: dateTo
          },

          beforeSend: function() {
            $("." + selected_mode + " #results_hits").html(
              "Loading number of hits"
            );
            $("." + selected_mode + " #results_hits").show();

            hits_ajax_complete = false;
          },

          complete: function() {
            updateSearchButtonOff();
            hits_ajax_complete = true;
          },

          success: function(data, status) {
            if ((data != null) & isJson(data)) {
              data_json = JSON.parse(data);

              $("." + selected_mode + " #results_hits").html(
                data_json[0].count + " hits"
              );
            } else {
              $(".error-code").html("<b>Error code:</b> 1 - hits");
              $("#error").modal("show");
            }
          },
          error: function(xhr, desc, err) {
            if (err != "abort") {
              console.log(xhr);
              console.log("Details: " + desc + "\nError:" + err);

              $("." + selected_mode + " #results_hits").html(
                "Error getting number of hits."
              );

              $(".error-code").html("<b>Error code:</b> 2 - hits");
              $("#error").modal("show");
            }
          }
        });
      } else {
        hits_ajax = $.ajax({
          url: "src/php/search_functions.php",
          type: "post",
          data: {
            type: "advanced",
            parameters: parameter_advanced[0],
            action: "hits",
            house: selected_house,
            //Database does not accept YYYY-MM format causing hits to fail, so I've added -01 to the end of dateFrom
            dateFrom: dateFrom.toString().length == 4 ? dateFrom : dateFrom + "-01",
            //and the very last day of the month to the end of dateTo. ex (2020-02 would become 2020-02-28)
            dateTo: dateTo.toString().length == 4 ? dateTo : () => { 
              //logic below creates a date variable, adds a month then removes a day to work out the days in a month. 
              let x = new Date(dateTo); 
              x = new Date(x.setMonth(x.getMonth()+1)); 
              x = new Date(x.setDate(x.getDate()-1)); 
              return `${dateTo}-${x.getDate()}` }
          },

          beforeSend: function() {
            $("." + selected_mode + " #results_hits").html(
              "Loading number of hits"
            );
            $("." + selected_mode + " #results_hits").show();

            hits_ajax_complete = false;
          },

          complete: function() {
            updateSearchButtonOff();
            hits_ajax_complete = true;
          },

          success: function(data, status) {
            if ((data != null) & isJson(data)) {
              data_json = JSON.parse(data);
              $("." + selected_mode + " #results_hits").html(
                data_json[0].count + " hits"
              );
            } else {
              $(".error-code").html("<b>Error code:</b> 3 - hits");
              $("#error").modal("show");
            }
          },
          error: function(xhr, desc, err) {
            if (err != "abort") {
              console.log(xhr);
              console.log("Details: " + desc + "\nError:" + err);

              $("." + selected_mode + " #results_hits").html(
                "Error getting number of hits."
              );
              $(".error-code").html("<b>Error code:</b> 4 - hits");
              $("#error").modal("show");
            }
          }
        });
      }
    } else {
      if (!hits_compare_ajax_complete[identif]) {
        hits_ajax_compare[identif].abort();
      }

      if (selected_submode == "basic") {
        hits_ajax_compare[identif] = $.ajax({
          url: "src/php/search_functions.php",
          type: "post",
          data: {
            type: "basic",
            parameters: parameter_basic[identif],
            action: "hits",
            house: selected_house,
            dateFrom: dateFrom,
            dateTo: dateTo
          },

          beforeSend: function() {
            $("." + selected_mode + " #compare_hits_" + (identif + 1)).html(
              "Loading number of hits"
            );
            $("." + selected_mode + " #compare_hits_" + (identif + 1)).show();

            hits_compare_ajax_complete[identif] = false;
          },

          complete: function() {
            updateSearchButtonOff();
            hits_compare_ajax_complete[identif] = true;
          },

          success: function(data, status) {
            if ((data != null) & isJson(data)) {
              data_json = JSON.parse(data);

              if (data_json == "-") {
                $("." + selected_mode + " #compare_hits_" + (identif + 1)).css(
                  "display",
                  "none"
                );
              } else {
                $("." + selected_mode + " #compare_hits_" + (identif + 1)).html(
                  data_json[0].count + " hits"
                );
              }
            } else {
              $(".error-code").html("<b>Error code:</b> 5 - hits");
              $("#error").modal("show");
            }
          },
          error: function(xhr, desc, err) {
            if (err != "abort") {
              console.log(xhr);
              console.log("Details: " + desc + "\nError:" + err);

              $("." + selected_mode + " #compare_hits_" + i).html(
                "Error getting number of hits."
              );
              $(".error-code").html("<b>Error code:</b> 6 - hits");
              $("#error").modal("show");
            }
          }
        });
      } else {
        if (!hits_compare_ajax_complete[identif]) {
          hits_ajax_compare[identif].abort();
        }

        hits_ajax_compare[identif] = $.ajax({
          url: "src/php/search_functions.php",
          type: "post",
          data: {
            type: "advanced",
            parameters: parameter_advanced[identif],
            action: "hits",
            house: selected_house,
            dateFrom: dateFrom,
            dateTo: dateTo
          },

          beforeSend: function() {
            $("." + selected_mode + " #compare_hits_" + (identif + 1)).html(
              "Loading number of hits"
            );
            $("." + selected_mode + " #compare_hits_" + (identif + 1)).show();

            hits_compare_ajax_complete[identif] = false;
          },

          complete: function() {
            updateSearchButtonOff();
            hits_compare_ajax_complete[identif] = true;
          },

          success: function(data, status) {
            if ((data != null) & isJson(data)) {
              data_json = JSON.parse(data);
              $("." + selected_mode + " #compare_hits_" + (identif + 1)).html(
                data_json[0].count + " hits"
              );
            } else {
              if (data_json == "-") {
                $("." + selected_mode + " #compare_hits_" + (identif + 1)).css(
                  "display",
                  "none"
                );
              } else {
                $(".error-code").html("<b>Error code:</b> 7 - hits");
                $("#error").modal("show");
              }
            }
          },
          error: function(xhr, desc, err) {
            if (err != "abort") {
              console.log(xhr);
              console.log("Details: " + desc + "\nError:" + err);

              $("." + selected_mode + " #compare_hits_" + i).html(
                "Error getting number of hits."
              );
              $(".error-code").html("<b>Error code:</b> 8 - hits");
              $("#error").modal("show");
            }
          }
        });
      }
    }
  } else {

    if(selected_submode=="wordcloud"){
      var type = "basic";
      var parameter = parameter_wc;
    }else{
      var type = "advanced";
      var parameter = parameter_bubble;
    }
    if(!compare_flag) {

      hits_ajax = $.ajax({
        url: "src/php/search_functions.php",
        type: "post",
        data: {
          parameters: parameter[0],
          action: "hits",
          house: selected_house,
          dateFrom: dateFrom,
          dateTo: dateTo,
          type: type
        },
  
        beforeSend: function() {
          $("." + selected_mode + " #results_hits").html(
            "Loading number of hits"
          );
          $("." + selected_mode + " #results_hits").show();
  
          hits_ajax_complete = false;
        },
  
        complete: function() {
          updateSearchButtonOff();
          hits_ajax_complete = true;
        },
  
        success: function(data, status) {
          if ((data != null) & isJson(data)) {
            data_json = JSON.parse(data);
  
            $("." + selected_mode + " #results_hits").html(
              data_json[0].count + " hits"
            );
          } else {
            if (data_json == "-") {
              $("." + selected_mode + " #results_hits").css(
                "display",
                "none"
              );
            } else {
              $(".error-code").html("<b>Error code:</b> 11 - hits");
              $("#error").modal("show");
            }
          }
        },
        error: function(xhr, desc, err) {
          if (err != "abort") {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
            $("." + selected_mode + "  #results_hits").html(
              "Error getting number of hits."
            );
            $(".error-code").html("<b>Error code:</b> 12 - hits");
            $("#error").modal("show");
          }
        }
      });


    }else{

      hits_ajax_compare[identif] = $.ajax({
        url: "src/php/search_functions.php",
        type: "post",
        data: {
          parameters: parameter[identif],
          action: "hits",
          house: selected_house,
          dateFrom: dateFrom,
          dateTo: dateTo,
          type: type
        },
  
        beforeSend: function() {
          $("." + selected_mode + " #compare_hits_" + (identif + 1)).html(
            "Loading number of hits"
          );
          $("." + selected_mode + " #compare_hits_" + (identif + 1)).show();
  
          hits_ajax_complete = false;
        },
  
        complete: function() {
          updateSearchButtonOff();
          hits_ajax_complete = true;
        },
  
        success: function(data, status) {
          if ((data != null) & isJson(data)) {
            data_json = JSON.parse(data);
  
            $("." + selected_mode + " #compare_hits_" + (identif + 1)).html(
              data_json[0].count + " hits"
            );
          } else {
            if (data_json == "-") {
              $("." + selected_mode + " #compare_hits_" + (identif + 1)).css(
                "display",
                "none"
              );
            } else {
              $(".error-code").html("<b>Error code:</b> 13 - hits");
              $("#error").modal("show");
            }
          }
        },
        error: function(xhr, desc, err) {
          if (err != "abort") {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
            $("." + selected_mode + " #compare_hits_" + i).html(
              "Error getting number of hits."
            );
            $(".error-code").html("<b>Error code:</b> 14 - hits");
            $("#error").modal("show");
          }
        }
      });


    }

  }
}

function getTotalDocuments(table, action, f_kwic) {
  $(table).bootstrapTable("refresh", {
    query: { count: 1, action: action, kwick: f_kwic }
  });
}

function prepareAdvancedQuery() {
  $(".search .advanced-search.form-control").removeClass("is-invalid");

  var parameters_count = 0;

  var parameter_term = false;
  var parameter_member = false;
  var parameter_description = false;

  var semantic = "";
  var semantic_title = [];

  count_of_documents = 0;

  var term = $(".search input:text.advanced-search.input-query")
    .val()
    .trim()
    .replace(/\s+/g, " ");
  var member = $(".search input:text.typeahead-members." + selected_house)
    .val()
    .trim()
    .replace(/\s+/g, " ");
  var description = $(".search input:text.advanced-search.input-description")
    .val()
    .trim()
    .replace(/\s+/g, " ");

  var oldDateFrom = dateFrom;
  var oldDateTo = dateTo;

  dateFrom = $(".search .advanced-search .datepicker-from")
    .datepicker()
    .val();
  dateTo = $(".search .advanced-search .datepicker-to")
    .datepicker()
    .val();

  var selected_semantic_tags = $(
    "." + selected_mode + " .semantic-tags-list :checkbox.semantic-tags:checked"
  );
  var available_semantic_tags = $(
    "." + selected_mode + " .semantic-tags-list :checkbox.semantic-tags"
  );

  if (term != "" && term != " ") {
    parameters_count += 1;
    parameter_term = true;
  }
  if (member != "" && member != " " && member != null) {
    parameters_count += 1;
    parameter_member = true;
  }
  if (description != "" && description != " ") {
    parameters_count += 1;
    parameter_description = true;
    $("." + selected_mode + " .convert-title").attr("checked", true);
  } else {
    $("." + selected_mode + " .convert-title").attr("checked", false);
  }

  if (parameters_count == 0) {
    if (
      (oldDateFrom == dateFrom) & (oldDateTo == dateTo) ||
      (oldDateFrom == null) & (oldDateTo == null)
    ) {
      $(".search .advanced-search.form-control").addClass("is-invalid");
    } else {
      getDistributionAdvanced("parameters", ".search .results");
    }
  } else {
    hideResultsSearch();
    resetBadgesAndButtons();

    if (parameters_count == 1) {
      if (parameter_term) {
        parameters_vars = "Term: " + term;

        if (
          selected_semantic_tags.length > 0 &&
          selected_semantic_tags.length != available_semantic_tags.length
        ) {
          selected_semantic_tags.each(function(i) {
            if (i == 0) {
              semantic = $(this).data("tag");
              parameters_vars +=
                " (" +
                $(this)
                  .siblings("label")
                  .html();
              semantic_title.push(
                $(this)
                  .siblings("label")
                  .html()
              );
            } else {
              semantic += "-" + $(this).data("tag");
              parameters_vars +=
                " & " +
                $(this)
                  .siblings("label")
                  .html();
              semantic_title.push(
                $(this)
                  .siblings("label")
                  .html()
              );
            }
          });
          parameters_vars += ")";
        }

        parameter_advanced[num_queries] = {
          term: term,
          member: member,
          description: description,
          query: parameters_vars,
          semantic: semantic,
          semantic_title: semantic_title
        };

        addCompareTermAdvanced(parameters_vars);
        getDistributionAdvanced("advanced", ".search .results");
      } else {
        $(".search .convert-rank")
          .parent(".custom-control")
          .addClass("hidden");
        $(".search .convert-rank").prop("checked", false);

        if (parameter_member) {
          parameters_vars = "Member: " + member;

          parameter_advanced[num_queries] = {
            term: term,
            member: member,
            description: description,
            query: parameters_vars,
            semantic: semantic,
            semantic_title: semantic_title
          };

          addCompareTermAdvanced(parameters_vars);
          getDistributionAdvanced("member", ".search .results");
          //getDistributionAdvanced("member", ".search .members");
        } else if (parameter_description) {
          parameters_vars = "Desc.: " + description;

          parameter_advanced[num_queries] = {
            term: term,
            member: member,
            description: description,
            query: parameters_vars,
            semantic: semantic,
            semantic_title: semantic_title
          };

          addCompareTermAdvanced(parameters_vars);
          getDistributionAdvanced("description", ".search .results");
          //getDistributionAdvanced("description", ".search .descriptions");
        }
      }
    } else {
      parameters_vars = "";

      if (parameter_term) {
        parameters_vars = "Term: " + term;
      }

      if (parameter_description) {
        if (parameters_vars == "") {
          parameters_vars += "Desc.: " + description;
        } else {
          parameters_vars += ";\n\rDesc.: " + description;
        }
      }

      if (parameter_member) {
        if (parameters_vars != "") {
          parameters_vars += ";\n\rMember: " + member;
        } else {
          parameters_vars += "Member: " + member;
        }
      }

      parameter_advanced[num_queries] = {
        term: term,
        member: member,
        description: description,
        query: parameters_vars
      };
      if (parameters_vars != "") {
        addCompareTermAdvanced(parameters_vars);
      }
      getDistributionAdvanced("parameters", ".search .results");
    }
  }
}

function searchContributionAdvanced(data_point, c_flag, func) {
  selected_submode = "advanced"
  count_flag = c_flag;

  $(func + " #results_query").html(
    parameter_advanced[0]["query"] +
      " <span class='badge badge-light'>" +
      dateFrom +
      " - " +
      dateTo +
      " </span>"
  );

  html_term = parameter_advanced[0]["term"];
  $.each(parameter_advanced[0]["semantic_title"], function(i, v) {
    html_term += " <span class='badge badge-light'>" + v + "</span>";
  });

  $(func + " #results_term").html(html_term);

  $(func + " #results_dates").html(dateFrom + " - " + dateTo);

  $(func + " #results_description").html(parameter_advanced[0]["description"]);

  $(func + " #results_member").html(parameter_advanced[0]["member"]);

  $(func + " .loader").css("display", "block");
  $(func + " .cancel-query").css("display", "flex");
  $(func).show();

  $("html, body").animate(
    {
      scrollTop: $(func + " #results_table").offset().top
    },
    500
  );

  $(func + " #results_table").bootstrapTable("removeAll");

  if(parameter_advanced[0]["term"] == ""){
    $(".search .convert-kwic-doc")
      .prop('checked', false)
      .parent(".custom-control")
      .addClass("hidden");
  }else{
    $(".search .convert-kwic-doc")
      .parent(".custom-control")
      .removeClass("hidden");
  }

  if ($(".search .convert-kwic-doc").is(":checked")) {
    action = "contribution-advanced-kwic";
    $("#tooltip_4_6.help").tooltip("disable");
    flag_kwic = "true";
  } else {
    action = "contribution-advanced";
    $(func + "results_hits").hide();
    $("#tooltip_4_6.help").tooltip("enable");
    flag_kwic = "false";
  }
  
  // if (parameter_advanced[0]["term"] == "") {


  //   $(".search .convert-rank")
  //     .parent(".custom-control")
  //     .removeClass("hidden");
  //   $(".search .convert-rank").prop("checked", false);
  //   $(".search .convert-kwic-doc")
  //     .parent(".custom-control")
  //     .removeClass("hidden");
  // } else {
  //   action = "contribution-advanced";
  //   flag_kwic = "false";

  //   $(".search .convert-rank")
  //     .parent(".custom-control")
  //     .addClass("hidden");
  //   $(".search .convert-rank").prop("checked", false);
  //   $(".search .convert-kwic-doc")
  //     .parent(".custom-control")
  //     .addClass("hidden");
  // }


  /*if (parameter_advanced[0]["query"] != "") {
    if ($(".search .convert-kwic-doc").is(":checked")) {
      action = "contribution-advanced-kwic";
      $("#tooltip_4_6.help").tooltip("disable");
      flag_kwic = "true";
    } else {
      action = "contribution-advanced";
      $(func + "results_hits").hide();
      $("#tooltip_4_6.help").tooltip("enable");
      flag_kwic = "false";
    }
  } else {
          return;
  }*/

  

  conf = getTableConfiguration(action, null);
  columns_conf = conf["columns_conf"];
  action_conf = "contribution-advanced";
  sort_name = conf["sort_name"]; //First time

  if (search_rank) {
    rank = "true";
  } else {
    rank = "false";
  }

  $(func + " #results_sem").html("");

  $(func + " #results_table")
    .bootstrapTable("destroy")
    .bootstrapTable({
      columns: columns_conf,
      formatLoadingMessage: function() {
        return "Loading, please wait ...";
      },
      sortName: sort_name,
      formatShowingRows: function(pageFrom, pageTo, totalRows) {
        return (
          "Showing " +
          pageFrom +
          " to " +
          pageTo +
          " of " +
          totalRows +
          " contributions"
        );
      },
      formatRecordsPerPage: function(pageNumber) {
        return pageNumber + " contributions per page";
      },
      ajaxOptions: {
        beforeSend: function(jqXHR) {
          $.xhrPool.push(jqXHR);
        },
        complete: function(jqXHR) {
          var index = $.inArray(jqXHR, $.xhrPool);

          if (index > -1) {
            $.xhrPool.splice(index, 1);
          }
        }
      },
      queryParams: function(p) {
        parameter_advanced[0]["action"] = action_conf;

        return {
          limit: p.limit,
          offset: p.offset,
          sort: p.sort,
          order: p.order,
          action: action_conf,
          dateFrom: dateFrom,
          dateTo: dateTo,
          house: selected_house,
          context: context,
          count: count_of_documents,
          parameters: parameter_advanced[0],
          kwic: flag_kwic,
          rank: rank
        };
      },
      url: "src/php/search_functions.php",
      method: "get",

      onLoadSuccess: function(data) {
        if ((data != null) & isJson('"' + data + '"')) {
          $(func + " .loader").css("display", "none");
          $(func + " .cancel-query").css("display", "none");

          $(func + ' th[data-field="member"]').tooltip({
            delay: { show: 3000, hide: 500 },
            placement: "top",
            html: true,
            title:
              "Click on a member’s name to find more information about them."
          });

          $(func + ' th[data-field="contribution"]').tooltip({
            delay: { show: 3000, hide: 500 },
            placement: "top",
            html: true,
            title:
              "This display shows the search term in the context of a single contribution from the current speaker. There may be more than one hit in the contribution and the additional number of hits is noted after the extract shown. If you want to see the whole contribution, you can click anywhere on the text."
          });

          $(func + " .keep-open.btn-group").attr(
            "data-original-title",
            "Use this to exclude date, contribution, Member and/or House from the display."
          );
          $(func + " .keep-open.btn-group").tooltip({
            delay: { show: 3000, hide: 500 },
            placement: "left",
            html: true
          });

          if (action.indexOf("kwic") != -1) {
            $(func + ' th[data-field="#document"]').tooltip({
              delay: { show: 3000, hide: 500 },
              placement: "top",
              html: true,
              title:
                "Hits are numbered to correspond to the number of the contribution that they occur in, which is why there is often more than one identical number in this column."
            });
          }

          if ($(".tooltip-config").not(":checked").length == 1) {
            $(
              "[data-toggle='tooltip'], .help, th, .keep-open.btn-group"
            ).tooltip("disable");
          }

          if (data.total == 0) {
            $(func + " #results_table")
              .bootstrapTable("destroy")
              .bootstrapTable({
                formatNoMatches: function() {
                  return "Sorry, there are no results that match your search.";
                }
              });
          }
          if (!count_flag) {
            if ($(".search .convert-kwic-doc").is(":checked")) {
              flag_kwic = true;
            } else {
              flag_kwic = false;
            }
            getTotalDocuments(
              func + " #results_table",
              parameter_advanced[0]["action"]
            );
            count_flag = true;
            $(func + " #results_table th div").prop("disabled", true);
            $(func + " #results_table th div").attr("data-disabled", true);

            if (action.indexOf("kwic") != -1) {
              getTotalHits(false, 0);
            }
          }

          if (data.total != 0) {
            if (data.total != "total") {
              if (count_of_documents == 0) {
                $(func + " #results_docs").html(data.total + " contributions");
                count_of_documents = data.total;
              }
              $(func + " #results_table th div").prop("disabled", false);
              $(func + " #results_table th div").attr("data-disabled", false);
            } else {
              $(func + " #results_docs").html(
                "Loading number of contributions"
              );
            }
            $(".dropdown-toggle").click(function() {
              $(".tooltip").tooltip("hide");
            });

            if ($(func + " .convert-title").prop("checked")) {
              $(func + " .table").bootstrapTable("showColumn", "description");
            } else {
              $(func + " .table").bootstrapTable("hideColumn", "description");
            }
          } else {
            $(func + " #results_docs").html("0 contributions");
          }
        } else {
          $(".error-code").html("<b>Error code:</b> 1 - advanced contribution");
          $("#error").modal("show");
        }
      },
      onLoadError: function(status) {
        console.log(status);

        $(func + " #results_table")
          .bootstrapTable("destroy")
          .bootstrapTable({
            formatNoMatches: function() {
              return 'Unexpected error, please contact us <a target="_blank" href="index.php?show=feedback">here</a>.';
            }
          });

        $(".error-code").html("<b>Error code:</b> 2 - advanced contribution");
        $("#error").modal("show");
      },
      onClickCell: function(field, value, row, $element) {
        $("td").removeClass("text-info font-weight-bold");
        $element.addClass("text-info font-weight-bold");

        identif = row.document_id;
        date = row.date;
        row_house = row.house.replace(/<(?:.|\n)*?>/gm, "").toLowerCase();

        member_span = $(row.member);
        member = $(member_span).text();
        url_member = $(member_span).data("url");

        switch (field) {
          case "member":
            window.open(url_member, "_blank");
            break;

          case "left_context":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameter_advanced[0],
              ".search .contribution"
            );
            break;

          case "right_context":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameter_advanced[0],
              ".search .contribution"
            );
            break;

          case "hit":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameter_advanced[0],
              ".search .contribution"
            );
            break;

          case "contribution":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameter_advanced[0],
              ".search .contribution"
            );
            break;

          case "date":
            searchContributionDate(identif, date, member, $element);
            break;
        }
      }
    });
}

function searchContributionAdvancedCompare(data_points, c_flag, func) {
  
  selected_submode = "advanced"
  var num = num_queries;

  count_flag_compare = c_flag;
  $(
    func +
      " #compare_table_1, " +
      func +
      "  #compare_table_2, " +
      func +
      " #compare_table_3, " +
      func +
      " #compare_table_4"
  ).hide();

  switch (num) {
    case 2:
      $(
        func + " #compare_table_1, " + func + " #compare_table_2"
      ).bootstrapTable("removeAll");
      $(
        func + " #compare_table_1, " + func + " #compare_table_2"
      ).bootstrapTable({
        formatLoadingMessage: function() {
          return "<br><br> Loading, please wait ... <br>";
        }
      });

      $(
        func +
          " #compare_table_1, " +
          func +
          " #toolbar_compare_1 .selections, " +
          func +
          " #compare_table_2, " +
          func +
          " #toolbar_compare_2 .selections"
      ).show();
      break;

    case 3:
      $(
        func +
          " #compare_table_1, " +
          func +
          " #compare_table_2, " +
          func +
          " #compare_table_3"
      ).bootstrapTable("removeAll");
      $(
        func +
          " #compare_table_1, " +
          func +
          " #compare_table_2, " +
          func +
          " #compare_table_3"
      ).bootstrapTable({
        formatLoadingMessage: function() {
          return "<br><br> Loading, please wait ... <br>";
        }
      });

      $(
        func +
          " #compare_table_1, " +
          func +
          " #toolbar_compare_1 .selections, " +
          func +
          " #compare_table_2, " +
          func +
          " #toolbar_compare_2 .selections, " +
          func +
          " #compare_table_3, " +
          func +
          " #toolbar_compare_3 .selections"
      ).show();
      break;

    case 4:
      $(
        func +
          " #compare_table_1, " +
          func +
          " #compare_table_2, " +
          func +
          " #compare_table_3, " +
          func +
          " #compare_table_4"
      ).bootstrapTable("removeAll");
      $(
        func +
          " #compare_table_1, " +
          func +
          " #compare_table_2, " +
          func +
          " #compare_table_3, " +
          func +
          " #compare_table_4"
      ).bootstrapTable({
        formatLoadingMessage: function() {
          return "<br><br> Loading, please wait ... <br>";
        }
      });
      $(
        func +
          " #compare_table_1, " +
          func +
          " #toolbar_compare_1 .selections, " +
          func +
          " #compare_table_2, " +
          func +
          " #toolbar_compare_2 .selections, " +
          func +
          " #compare_table_3, " +
          func +
          " #toolbar_compare_3 .selections, " +
          func +
          " #compare_table_4, " +
          func +
          " #toolbar_compare_4 .selections"
      ).show();
      break;
  }

  $(func + " .loader").css("display", "block");
  $(func + " .cancel-query").css("display", "flex");
  $(func).show();

  $("html, body").animate(
    {
      scrollTop: $(func + " #compare_table_1").offset().top
    },
    500
  );

  let isTerm = false;
  $.each(data_points, function(index, value) {
    if (parameter_advanced[index]["term"] == "") {
      action = "contribution-advanced";
      flag_kwic = "false";

      $(".search .convert-rank")
        .parent(".custom-control")
        .addClass("hidden");
      $(".search .convert-rank").prop("checked", false);
    } else {
      isTerm=true;
      if ($(".search .convert-kwic-doc").is(":checked")) {
        action = "contribution-advanced-kwic";
        $("#tooltip_4_6.help").tooltip("disable");
        flag_kwic = "true";
      } else {
        action = "contribution-advanced";
        $(func + "results_hits").hide();
        $("#tooltip_4_6.help").tooltip("enable");
        flag_kwic = "false";
      }
    }
    if(isTerm){
      $(".search .convert-kwic-doc")
        .parent(".custom-control")
        .removeClass("hidden");
    }else{
      $(".search .convert-kwic-doc")
        .parent(".custom-control")
        .addClass("hidden");
    }

    conf = getTableConfiguration(action, null);

    columns_conf = conf["columns_conf"];
    action_conf = "contribution-advanced";
    sort_name = conf["sort_name"]; //First time

    if (search_rank) {
      rank = "true";
    } else {
      rank = "false";
    }

    html_term = parameter_advanced[index]["term"];
    $.each(parameter_advanced[index]["semantic_title"], function(i, v) {
      html_term += " <span class='badge badge-light'>" + v + "</span>";
    });

    $(func + " #compare_term_" + (index + 1)).html(html_term);

    $(func + " #compare_dates_" + (index + 1)).html(dateFrom + " - " + dateTo);

    $(func + " #compare_description_" + (index + 1)).html(
      parameter_advanced[index]["description"]
    );

    $(func + " #compare_member_" + (index + 1)).html(
      parameter_advanced[index]["member"]
    );

    $(func + " #compare_table_" + (index + 1))
      .bootstrapTable("destroy")
      .bootstrapTable({
        columns: columns_conf,
        sortName: sort_name, //First time
        formatShowingRows: function(pageFrom, pageTo, totalRows) {
          return (
            "Showing " +
            pageFrom +
            " to " +
            pageTo +
            " of " +
            totalRows +
            " contributions"
          );
        },
        formatRecordsPerPage: function(pageNumber) {
          return pageNumber + " contributions per page";
        },
        formatLoadingMessage: function() {
          return "Loading, please wait ...";
        },
        ajaxOptions: {
          beforeSend: function(jqXHR) {
            $.xhrPool.push(jqXHR);
          },
          complete: function(jqXHR) {
            var index = $.inArray(jqXHR, $.xhrPool);

            if (index > -1) {
              $.xhrPool.splice(index, 1);
            }
          }
        },
        queryParams: function(p) {
          parameter_advanced[index]["action"] = action_conf;

          return {
            limit: p.limit,
            offset: p.offset,
            sort: p.sort,
            order: p.order,
            parameters: parameter_advanced[index],
            action: action_conf,
            dateFrom: dateFrom,
            dateTo: dateTo,
            house: selected_house,
            context: context,
            count: count_of_documents_compare[index],
            formatDate: "full",
            kwic: flag_kwic,
            rank: rank
          };
        },
        url: "src/php/search_functions.php",
        method: "get",

        onLoadSuccess: function(data) {
          if ((data != null) & isJson('"' + data + '"')) {
            $(
              func +
                " #compare_table_" +
                (index + 1) +
                ' th[data-field="member"]'
            ).tooltip({
              delay: { show: 3000, hide: 500 },
              placement: "top",
              html: true,
              title:
                "Click on a member’s name to find more information about them."
            });

            $(
              func +
                " #compare_table_" +
                (index + 1) +
                ' th[data-field="contribution"]'
            ).tooltip({
              delay: { show: 3000, hide: 500 },
              placement: "top",
              html: true,
              title:
                "This display shows the search term in the context of a single contribution from the current speaker. There may be more than one hit in the contribution and the additional number of hits is noted after the extract shown. If you want to see the whole contribution, you can click anywhere on the text."
            });

            $(
              func + " #compare_table_" + (index + 1) + " .keep-open.btn-group"
            ).attr(
              "data-original-title",
              "Use this to exclude date, contribution, Member and/or House from the display."
            );
            $(
              func + " #compare_table_" + (index + 1) + " .keep-open.btn-group"
            ).tooltip({
              delay: { show: 3000, hide: 500 },
              placement: "left",
              html: true
            });

            if (flag_kwic) {
              $(
                func +
                  " #compare_table_" +
                  (index + 1) +
                  ' th[data-field="#document"]'
              ).tooltip({
                delay: { show: 3000, hide: 500 },
                placement: "top",
                html: true,
                title:
                  "Hits are numbered to correspond to the number of the contribution that they occur in, which is why there is often more than one identical number in this column."
              });
            }

            if ($(".tooltip-config").not(":checked").length == 1) {
              $(
                "[data-toggle='tooltip'], .help, th, .keep-open.btn-group"
              ).tooltip("disable");
            }

            if (data.total == 0) {
              $(func + " #compare_table_" + (index + 1))
                .bootstrapTable("destroy")
                .bootstrapTable({
                  formatNoMatches: function() {
                    return "Sorry, there are no results that match your search.";
                  }
                });
            }

            if (!count_flag_compare[index]) {
              if (
                $(".search .convert-kwic-doc").is(":checked") &&
                parameter_advanced[index]["term"] != ""
              ) {
                flag_kwic = true;
              } else {
                flag_kwic = false;
              }
              getTotalDocuments(
                func + " #compare_table_" + (index + 1),
                parameter_advanced[index]["action"],
                flag_kwic
              );
              count_flag_compare[index] = true;
              $(func + " #compare_table_" + (index + 1) + " th div").prop(
                "disabled",
                true
              );
              $(func + " #compare_table_" + (index + 1) + " th div").attr(
                "data-disabled",
                true
              );

              if (
                action.indexOf("kwic") != -1 &&
                parameter_advanced[index]["term"] != ""
              ) {
                getTotalHits(true, index);
              }
            }

            if (data.total != 0) {
              if (data.total != "total") {
                if (count_of_documents_compare[index] == 0) {
                  $(func + " #compare_docs_" + (index + 1)).html(
                    data.total + " contributions"
                  );
                  count_of_documents_compare[index] = data.total;
                }
                $(func + " #compare_table_" + (index + 1) + " th div").prop(
                  "disabled",
                  false
                );
                $(func + " #compare_table_" + (index + 1) + " th div").attr(
                  "data-disabled",
                  false
                );
              } else {
                $(func + " #compare_docs_" + (index + 1)).html(
                  "Loading number of contributions"
                );
              }

              $(".dropdown-toggle").click(function() {
                $(".tooltip").tooltip("hide");
              });

              if ($("." + selected_mode + " .convert-title").prop("checked")) {
                $(func + " #compare_table_" + (index + 1)).bootstrapTable(
                  "showColumn",
                  "description"
                );
              } else {
                $(func + " #compare_table_" + (index + 1)).bootstrapTable(
                  "hideColumn",
                  "description"
                );
              }
            } else {
              $(func + " #compare_docs_" + (index + 1)).html("0 contributions");
            }
          } else {
            $(".error-code").html(
              "<b>Error code:</b> 3 - advanced contribution"
            );
            $("#error").modal("show");
          }
        },
        onLoadError: function(status) {
          console.log(status);

          $(func + " #compare_table_" + (index + 1))
            .bootstrapTable("destroy")
            .bootstrapTable({
              formatNoMatches: function() {
                return 'Unexpected error, please contact us <a target="_blank" href="index.php?show=feedback">here</a>.';
              }
            });

          $(".error-code").html("<b>Error code:</b> 4 - advanced contribution");
          $("#error").modal("show");
        },
        onClickCell: function(field, value, row, $element) {
          $("td").removeClass("text-info font-weight-bold");
          $element.addClass("text-info font-weight-bold");

          identif = row.document_id;
          date = row.date;
          row_house = row.house.replace(/<(?:.|\n)*?>/gm, "").toLowerCase();

          member_span = row.member;
          member = $(member_span).text();
          url_member = $(member_span).data("url");

          switch (field) {
            case "member":
              window.open(url_member, "_blank");
              break;

            case "contribution":
              showContribution(
                date,
                member,
                identif,
                row_house,
                parameter_advanced[index],
                "." + selected_mode + " .contribution"
              );
              break;

            case "left_context":
              showContribution(
                date,
                member,
                identif,
                row_house,
                parameter_advanced[index],
                "." + selected_mode + " .contribution"
              );
              break;

            case "right_context":
              showContribution(
                date,
                member,
                identif,
                row_house,
                parameter_advanced[index],
                "." + selected_mode + " .contribution"
              );
              break;

            case "hit":
              showContribution(
                date,
                member,
                identif,
                row_house,
                parameter_advanced[index],
                "." + selected_mode + " .contribution"
              );
              break;

            case "date":
              searchContributionDate(
                identif,
                date,
                member,
                $element,
                row_house
              );
              break;
          }
        }
      });
  });

  $(func + " .loader").css("display", "none");
  $(func + " .cancel-query").css("display", "none");
  $("html, body").animate(
    {
      scrollTop: $(func + " #compare_table_1").offset().top
    },
    500
  );
}

function KWAnalysis() {
  if (!contribution_ajax_complete) {
    cancelSQLQuery("." + selected_mode + " .contribution");
  }

  contribution_ajax = $.ajax({
    url: "src/php/search_functions.php",
    type: "post",
    data: { action: "contribution-KW", house: selected_house },

    beforeSend: function() {
      contribution_ajax_complete = false;

      $("." + selected_mode + " .contribution .loader").css("display", "block");
      $("." + selected_mode + " .contribution .cancel-query").css(
        "display",
        "flex"
      );
      $("." + selected_mode + " .contribution.card .btn-toolbar").css(
        "display",
        "none"
      );

      $("html, body").animate(
        {
          scrollTop: $("." + selected_mode + " .kw-analysis.analysis").offset()
            .top
        },
        500
      );
    },

    complete: function() {
      updateSearchButtonOff();
      contribution_ajax_complete = true;

      $("." + selected_mode + " .contribution .loader").css("display", "none");
      $("." + selected_mode + " .contribution .cancel-query").css(
        "display",
        "none"
      );
      $("." + selected_mode + " .contribution.card .btn-toolbar").css(
        "display",
        "block"
      );

      $("html, body").animate(
        {
          scrollTop: $("." + selected_mode + " .kw-analysis.analysis").offset()
            .top
        },
        500
      );
    },

    success: function(data, status) {
      if ((data != null) & isJson(data)) {
        data_json = JSON.parse(data);

        if (data_json.data.length != 0) {
          $("#KWModal").modal("show");

          $("#KW_table")
            .bootstrapTable("destroy")
            .bootstrapTable({
              pagination: false,
              columns: [
                {
                  field: "#",
                  title: "#",
                  width: "8%",
                  sortable: true
                },
                {
                  field: "word",
                  title: "Word",
                  width: "60%",
                  sortable: true
                },
                {
                  field: "score",
                  title: "RAKE score",
                  width: "25%",
                  sortable: true
                }
              ]
            });

          $("#KW_table").bootstrapTable("load", data_json.data);

          $("#KW_table").tableExport({
            headers: true, // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
            footers: true, // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
            formats: ["xlsx", "csv", "txt"], // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
            filename: "id", // (id, String), filename for the downloaded file, (default: 'id')
            bootstrap: false, // (Boolean), style buttons using bootstrap, (default: true)
            exportButtons: true, // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
            position: "bottom", // (top, bottom), position of the caption element relative to table, (default: 'bottom')
            ignoreRows: null, // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
            ignoreCols: null, // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
            trimWhitespace: true // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
          });
        } else {
          $("#KW_table").bootstrapTable("destroy");
          $("#KWNull").modal("show");
        }
      } else {
        $(".error-code").html("<b>Error code:</b> 1 - keyword");
        $("#error").modal("show");
      }
    },
    error: function(xhr, desc, err) {
      if (err != "abort") {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
        $(".search .contribution #contribution_card").html(
          'Unexpected error, please contact us <a target="_blank" href="index.php?show=feedback">here</a>.'
        );

        $(".error-code").html("<b>Error code:</b> 2 - keyword");
        $("#error").modal("show");
      }
    }
  });
}

function relatedTerms() {
  query = $(".search input:text.basic-search.input-query").val();

  if (query.trim().replace(/\s+/g, "") != "") {
    if (!contribution_ajax_complete) {
      cancelSQLQuery("." + selected_mode + " .contribution");
    }

    contribution_ajax = $.ajax({
      url: "src/php/search_functions.php",
      type: "post",
      data: { action: "related-terms", query: query, house: selected_house },

      beforeSend: function() {
        contribution_ajax_complete = false;
        $("button.related-search.basic-search").html("Loading ...");
        $("button.related-search.basic-search").addClass(
          "btn-loading-warning btn-warning"
        );
        $("button.related-search.basic-search").removeClass("btn-outline-info");
      },

      complete: function() {
        updateSearchButtonOff();
        contribution_ajax_complete = true;
        $(".related-terms.basic-search").show();

        $("button.related-search.basic-search").html(
          "<i class='fas fa-search-plus'></i> Related terms"
        );
        $("button.related-search.basic-search").removeClass(
          "btn-loading-warning btn-warning"
        );
        $("button.related-search.basic-search").addClass("btn-outline-info");
      },

      success: function(data, status) {
        if (data != null) {
          try {
            html_value = "<label><small>Related terms:   </small></label> ";

            data_json = JSON.parse(data);

            $.each(data_json.data, function(index, value) {
              html_value +=
                "<span class='badge badge-warning related-term add' title='Add term'>" +
                value +
                "</span> ";
            });
          } catch (e) {
            $(".error-code").html("<b>Error code:</b> 1 - related terms");
            $("#error").modal("show");
          }
        } else {
          html_value = "<span class='badge badge-danger'>No results</span>";
        }
        html_value +=
          "<span class='badge badge-danger related-term reset' title='Delete all related terms'><i class='far fa-trash-alt'></i></span>";
        $(".related-terms.basic-search > div").html(html_value);
      },
      error: function(xhr, desc, err) {
        if (err != "abort") {
          console.log(xhr);
          console.log("Details: " + desc + "\nError:" + err);
          $(".search .contribution #contribution_card").html(
            "Details: " + desc + "\nError:" + err
          );
          $(".error-code").html("<b>Error code:</b> 2 - related terms");
          $("#error").modal("show");
        }
      }
    });
  } else {
    $(".search input:text.basic-search.input-query").addClass("is-invalid");
  }
}

function searchContributionDate(identif, date, member, element) {
  $("#underConstructionModal").modal("show");
}

function getDistributionAdvanced(type, container) {
  if (!distribution_ajax_complete) {
    cancelSQLQuery("." + selected_mode + " .distribution");
  }

  action = "distribution-advanced";

  flag_normalised = true;
  $.each(parameter_advanced, function(index, value) {
    if (value["term"] == "") {
      flag_normalised = false;
    }
  });

  dateFrom = $(".search .advanced-search .datepicker-from")
    .datepicker()
    .val();
  dateTo = $(".search .advanced-search .datepicker-to")
    .datepicker()
    .val();

  if (dateTo.substring(0, 4) - dateFrom.substring(0, 4) <= 5) {
    flag_monthly_based = true;
  } else {
    flag_monthly_based = false;
  }

  distribution_ajax = $.ajax({
    url: "src/php/search_functions.php",
    type: "post",
    data: {
      action: action,
      dateTo: dateTo,
      dateFrom: dateFrom,
      house: selected_house,
      parameters: parameter_advanced,
      flag_normalised: flag_normalised,
      flag_monthly_based: flag_monthly_based
    },

    beforeSend: function() {
      distribution_ajax_complete = false;

      resetComparison();
      $(".search .distribution .line-chart").html("");
      $(".search .distribution").show();

      $(".search .distribution .loader").css("display", "block");
      $(".search .distribution .cancel-query").css("display", "flex");

      $("html, body").animate(
        {
          scrollTop: $(".search .distribution .line-chart").offset().top
        },
        500
      );
    },

    complete: function() {
      updateSearchButtonOff();
      distribution_ajax_complete = true;

      $("html, body").animate(
        {
          scrollTop: $(".search .distribution .line-chart").offset().top
        },
        500
      );
    },

    success: function(data, status) {
      if ((data != null) & isJson(data)) {
        $(".search .distribution .loader").css("display", "none");
        $(".search .distribution .cancel-query").css("display", "none");

        if (flag_normalised) {
          label_y = "Frequency (hits per million of words)";
        } else {
          label_y = "Frequency (number of documents)";
        }

        data_json = JSON.parse(data);

        //cleans up the data before creating a table (ex. sorts by date, merges duplicates)
        data_json.forEach((entry)=>{
          //sort by date
          entry.values.sort((a,b)=> Date.parse(a.x) - Date.parse(b.x))
          //group duplicates
          prevEntry = null;
          entry.values.forEach((e)=>{
            if(prevEntry != null){
              if(prevEntry.x === e.x){
                e.y += prevEntry.y
                e.freqRaw += prevEntry.freqRaw
                entry.values.splice(prevEntry, 1)
              }
            }
            prevEntry = e
          })
        })

        freq_line_data = data_json;

        nv.addGraph(function() {
          if (flag_monthly_based) {
            chart = nv.models
              .lineChart()
              .x(function(d) {
                return new Date(d.x);
              })
              .options({
                transitionDuration: 2000,
                useInteractiveGuideline: true
              });

            chart.xAxis
              .axisLabel("Year")
              .tickFormat(function(d) {
                return d3.time.format("%Y-%m")(new Date(d));
              })
              .staggerLabels(false);
          } else {
            chart = nv.models
              .lineChart()
              .x(function(d) {
                return new Date(d.x);
              })
              .options({
                transitionDuration: 2000,
                useInteractiveGuideline: true
              });

            chart.xAxis
              .axisLabel("Year")
              .tickFormat(d3.format("d"))
              .staggerLabels(false);
          }

          chart.yAxis
            .axisLabel(label_y)
            .tickFormat(d3.format(".2f"))
            .staggerLabels(false);

          chart.legend.maxKeyLength(1000);

          chart.lines.dispatch.on("elementClick", function(e) {
            if (range_of_dates_distrib.length == 0) {
              range_of_dates_distrib.push(e[0].point.x);

              $(".search .nv-point.nv-point-" + e[0].pointIndex).addClass(
                "selected"
              );
              $(".search .distribution .timeline-one").html(e[0].point.x);
            } else if (range_of_dates_distrib.length == 1) {
              range_of_dates_distrib.push(e[0].point.x);
              $(".search .nv-point.nv-point-" + e[0].pointIndex).addClass(
                "selected"
              );
              $(".search .distribution .timeline-two").html(e[0].point.x);

              if (range_of_dates_distrib[0] > range_of_dates_distrib[1]) {
                dateFrom = range_of_dates_distrib[1];
                dateTo = range_of_dates_distrib[0];
              } else {
                dateFrom = range_of_dates_distrib[0];
                dateTo = range_of_dates_distrib[1];
              }

              if (
                $(":checkbox.basic-search.only-contribution").is(":checked")
              ) {
                search_all = false;
              } else {
                search_all = true;
              }

              resetFromDistribution();

              if (num_queries > 1) {
                count_of_documents_compare = [0, 0, 0, 0];
                CLICKED_POINTS_DISTRIB = e;
                searchContributionAdvancedCompare(
                  e,
                  [false, false, false, false],
                  ".search .compare-results"
                );
              } else {
                count_of_documents = 0;
                CLICKED_POINTS_DISTRIB = e;
                searchContributionAdvanced(
                  e, 
                  false, 
                  ".search .results"
                );
              }
            } else if (range_of_dates_distrib.length == 2) {
              resetComparison();
              range_of_dates_distrib.push(e[0].point.x);
              $(".search .nv-point.nv-point-" + e[0].pointIndex).addClass(
                "selected"
              );
              $(".search .distribution .timeline-one").html(e[0].point.x);
            }
          });

          d3.select(".search .distribution .line-chart")
            .append("svg")
            .datum(data_json)
            .call(chart);
          nv.utils.windowResize(chart.update);
          return chart;
        });
      } else {
        if (data.indexOf("Query canceled") == -1) {
          $(".search .distribution .line-chart").html(
            "<div style='text-align:center'><text class='nvd3 nv-noData' style='text-anchor: middle;'>Error!</text></div>"
          );

          $(".error-code").html("<b>Error code:</b> 1 - advanced distribution");
          $("#error").modal("show");

          $(".search .distribution .loader").css("display", "none");
          $(".search .distribution .cancel-query").css("display", "none");
        }
      }
    },
    error: function(xhr, desc, err) {
      if (err != "abort") {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
        if (err != "abort") {
          $(".error-code").html("<b>Error code:</b> 3 - advanced distribution");
          $("#error").modal("show");
          $(".search .distribution .loader").css("display", "none");
          $(".search .distribution .cancel-query").css("display", "none");
        }
      }
    }
  });
}

function getDistribution() {
  if (!distribution_ajax_complete) {
    cancelSQLQuery("." + selected_mode + " .distribution");
  }

  dateFrom = $(".basic-search .date-time.annual .annual-from").val();
  dateTo = $(".basic-search .date-time.annual .annual-to").val();

  distribution_ajax = $.ajax({
    url: "src/php/search_functions.php",
    type: "post",
    data: {
      parameters: parameter_basic,
      action: "distribution",
      dateTo: dateTo,
      dateFrom: dateFrom,
      house: selected_house
    },

    beforeSend: function() {
      distribution_ajax_complete = false;

      resetComparison();
      $(".search .distribution .line-chart").html("");
      $(".search .distribution").show();

      $(".search .distribution .loader").css("display", "block");
      $(".search .distribution .cancel-query").css("display", "flex");

      $("html, body").animate(
        {
          scrollTop: $(".search .distribution .line-chart").offset().top
        },
        500
      );
    },

    complete: function() {
      updateSearchButtonOff();
      distribution_ajax_complete = true;

      $("html, body").animate(
        {
          scrollTop: $(".search .distribution .line-chart").offset().top
        },
        500
      );
    },

    success: function(data, status) {
      if ((data != null) & isJson(data)) {
        $(".search .distribution .loader").css("display", "none");
        $(".search .distribution .cancel-query").css("display", "none");

        label_y = "Frequency (hits per million of words)";

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

              $(".search .nv-point.nv-point-" + e[0].pointIndex).addClass(
                "selected"
              );
              $(".search .distribution .timeline-one").html(e[0].point.x);
            } else if (range_of_dates_distrib.length == 1) {
              range_of_dates_distrib.push(e[0].point.x);
              $(".search .nv-point.nv-point-" + e[0].pointIndex).addClass(
                "selected"
              );
              $(".search .distribution .timeline-two").html(e[0].point.x);

              if (range_of_dates_distrib[0] > range_of_dates_distrib[1]) {
                dateFrom = range_of_dates_distrib[1];
                dateTo = range_of_dates_distrib[0];
              } else {
                dateFrom = range_of_dates_distrib[0];
                dateTo = range_of_dates_distrib[1];
              }

              if (
                $(":checkbox.basic-search.only-contribution").is(":checked")
              ) {
                search_all = false;
              } else {
                search_all = true;
              }

              resetFromDistribution();

              if (num_queries > 1) {
                count_of_documents_compare = [0, 0, 0, 0];
                CLICKED_POINTS_DISTRIB = e;
                searchContributionCompare(
                  e,
                  [false, false, false, false],
                  ".search .compare-results"
                );
              } else {
                count_of_documents = 0;
                CLICKED_POINTS_DISTRIB = e;
                searchContribution(e, false, ".search .results");
              }
            } else if (range_of_dates_distrib.length == 2) {
              resetComparison();
              range_of_dates_distrib.push(e[0].point.x);
              $(".search .nv-point.nv-point-" + e[0].pointIndex).addClass(
                "selected"
              );
              $(".search .distribution .timeline-one").html(e[0].point.x);
            }
          });

          d3.select(".search .distribution .line-chart")
            .append("svg")
            .datum(data_json)
            .call(chart);
          nv.utils.windowResize(chart.update);
          return chart;
        });
      } else {
        if (data.indexOf("Query canceled") == -1) {
          $(".search .distribution .line-chart").html(
            "<div style='text-align:center'><text class='nvd3 nv-noData' style='text-anchor: middle;'>Error!</text></div>"
          );
          $(".error-code").html("<b>Error code:</b> 1 - distribution");
          $("#error").modal("show");

          $(".search .distribution .loader").css("display", "none");
          $(".search .distribution .cancel-query").css("display", "none");
        }
      }
    },
    error: function(xhr, desc, err) {
      if (err != "abort") {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
        $(".error-code").html("<b>Error code:</b> 3 - distribution");
        $("#error").modal("show");
        $(".search .distribution .loader").css("display", "none");
        $(".search .distribution .cancel-query").css("display", "none");
      }
    }
  });
}

function hexc(colorval) {
  var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  delete parts[0];
  for (var i = 1; i <= 3; ++i) {
    parts[i] = parseInt(parts[i]).toString(16);
    if (parts[i].length == 1) parts[i] = "0" + parts[i];
  }
  color = "#" + parts.join("");

  return color.toUpperCase();
}

function prepareBasicQuery() {
  $(".search .basic-search .form-control").removeClass("is-invalid");

  var term = $(".search input:text.basic-search.input-query").val();

  var oldDateFrom = dateFrom;
  var oldDateTo = dateTo;

  dateFrom = $(".basic-search .date-time.annual .annual-from").val();
  dateTo = $(".basic-search .date-time.annual .annual-to").val();

  if (
    term.match(/\w+/g) != null ||
    oldDateFrom != dateFrom ||
    oldDateTo != dateTo ||
    (oldDateFrom == null) & (oldDateTo == null)
  ) {
    if (
      parseInt(dateFrom) >= 1803 &&
      parseInt(dateFrom) <= 2019 &&
      parseInt(dateTo) >= 1803 &&
      parseInt(dateTo) <= 2019
    ) {
      if (num_queries == 0) {
        $(".basic-search .terms-list").show();
      }

      if (num_queries < 4) {
        hideResultsSearch();
        resetBadgesAndButtons();

        if (term.match(/\w+/g) != null) {
          addCompareTerm(term);
        }

        getDistribution();
      } else {
        $("#warningModalMaxTerms").modal("show");
      }
    } else {
      $(".basic-search .date-time.annual .annual-from").addClass("is-invalid");
      $(".basic-search .date-time.annual .annual-to").addClass("is-invalid");
    }
  } else {
    if (term.match(/\w+/g) == null) {
      $(".search input:text.basic-search.input-query").addClass("is-invalid");
    }

    if (
      !(parseInt(dateFrom) >= 1803 && parseInt(dateFrom) < 2019) &&
      parseInt(dateTo) >= 1803 &&
      parseInt(dateTo) <= 2019
    ) {
      $(".basic-search .date-time.annual .annual-from").addClass("is-invalid");
      $(".basic-search .date-time.annual .annual-to").addClass("is-invalid");
    }
  }
}

function addCompareTerm(term) {
  var flag_repeated = false;
  var selected_colour;

  for (var i = 0; i < num_queries; i++) {
    if (parameter_basic[i]["query"] == term) {
      flag_repeated = true;
    }
  }

  if (!flag_repeated) {
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

    parameter_basic[num_queries] = {
      term: term,
      query: term,
      colour: selected_colour
    };

    $(".basic-search .terms-list > div").append(
      "<span class='compare-term mx-1'><span class='word' style='color:" +
        parameter_basic[num_queries]["colour"] +
        "' query='" +
        parameter_basic[num_queries]["term"].replace(/\s+/g, " ") +
        "'>" +
        parameter_basic[num_queries]["term"].replace(/\s+/g, " ") +
        "</span> <span class='badge badge-danger delete-term' title='Delete term'><i class='fas fa-minus'></i></span></span>"
    );
    num_queries++;
    $(".search input:text.basic-search.input-query").val("");
  } // else it is a repeated element, so do nothing
}

function addCompareTermAdvanced(query) {
  $(".search input.advanced-search").removeClass("is-invalid");

  if (query != "") {
    if (num_queries == 0) {
      $(".advanced-search .terms-list").show();
    }

    if (num_queries != 4) {
      flag_repeated = false;

      for (var i = 0; i < num_queries; i++) {
        if (parameter_advanced[i]["query"] == query) {
          flag_repeated = true;
        }
      }

      if (!flag_repeated) {
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

        parameter_advanced[num_queries]["colour"] = selected_colour;

        $(".search input:text.advanced-search.input-query").val("");
        $(".search input:text.typeahead-members." + selected_house).val("");
        $(".search input:text.advanced-search.input-description").val("");

        $(".search .advanced-search .semantic-tags-list > div").html("");
        $(".search .advanced-search .semantic-tags-list").hide();

        $(".advanced-search .terms-list > div").append(
          "<span class='compare-term mx-1'><span class='word' style='color:" +
            selected_colour +
            "' query='" +
            query.replace(/\s/g, "") +
            "'>" +
            query +
            "</span> <span class='badge badge-danger delete-term' title='Delete term'><i class='fas fa-minus'></i></span></span>"
        );
        num_queries++;
      } // else it is a repeated element, so do nothing
    } else {
      $("#warningModalMaxTerms").modal("show");
    }
  } else {
    $(".search input.advanced-search").addClass("is-invalid");
  }
}

// generate a download for blow
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

function saveLineChartAsExcel() {
  var wb = XLSX.utils.book_new();

  for (i = 0; i < freq_line_data.length; i++) {
    x = "";
    y = "";

    object = new Array();
    object.push([
      freq_line_data[i]["key"],
      selected_house.charAt(0).toUpperCase() + selected_house.slice(1)
    ]);

    if (flag_normalised) {
      object.push(["Date", "Frequency (number of documents)"]);
    } else {
      object.push(["Date", "Frequency (hits per million of words)"]);
    }

    $.each(freq_line_data[i]["values"], function() {
      $.each($(this)[0], function(index, value) {
        if (index == "x") {
          if (x != "") {
            object.push([x, y]);
          }
          x = value;
        } else if (index == "y") {
          y = value;
        }
      });
    });

    object.push([x, y]);

    var ws = XLSX.utils.json_to_sheet(object, { skipHeader: true });

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      freq_line_data[i]["key"]
        .replace(":", "_")
        .replace("\\", "_")
        .replace("/", "_")
        .replace("?", "_")
        .replace("[", "_")
        .replace("]", "_")
    );

    var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  }
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "line_chart.xlsx"
  );
  $("#downloadFile").modal("show");
}

function saveResultsAsExcel() {
  data = $($("#tsv-excel").attr("table")).bootstrapTable("getSelections");

  var wb = XLSX.utils.book_new();
  object = new Array();

  for (i = 0; i < data.length; i++) {
    element = new Array();

    $.each(data[i], function(index, value) {
      if (index == "date") {
        element["Date"] = value;
      } else if (index == "left_context") {
        element["Left Context"] = value;
      } else if (index == "hit") {
        value = value.replace("<b>", "");
        value = value.replace("</b>", "");

        element["Hit"] = value;
      } else if (index == "right_context") {
        element["Right Context"] = value;
      } else if (index == "member") {
        member_span = $(value);
        member = $(member_span).text();
        element["Member"] = member;
      } else if (index == "house") {
        if (value == "-") {
          value =
            selected_house.charAt(0).toUpperCase() + selected_house.slice(1);
        }
        element["House"] = $("<div/>")
          .html(value)
          .text();
      } else if (index == "description") {
        element["Debate title"] = value;
      } else if (index == "relevance") {
        if (value != "-") {
          element["Relevance"] = value;
        }
      }
    });

    object.push(element);
  }

  var ws = XLSX.utils.json_to_sheet(object);
  var colWidth = [
    { wch: 10 },
    { wch: 50 },
    { wch: 10 },
    { wch: 50 },
    { wch: 20 },
    { wch: 50 },
    { wch: 10 },
    { wch: 10 }
  ];

  ws["!cols"] = colWidth;
  XLSX.utils.book_append_sheet(wb, ws, "Concordances", { cellStyles: true });
  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "Concordances.xlsx"
  );
  $("#downloadFile").modal("show");
}

function saveResultsAsTSV() {
  data = $($("#tsv-excel").attr("table")).bootstrapTable("getSelections");
  var wb = XLSX.utils.book_new();
  object = new Array();

  tsv_content = "";
  relevance_flag = false;

  for (i = 0; i < data.length; i++) {
    element = new Array();

    $.each(data[i], function(index, value) {
      if (index == "date") {
        tsv_content += value;
      } else if (index == "left_context") {
        tsv_content += "\t" + value;
      } else if (index == "hit") {
        value = value.replace("<b>", "");
        value = value.replace("</b>", "");

        tsv_content += "\t" + value;
      } else if (index == "right_context") {
        tsv_content += "\t" + value;
      } else if (index == "member") {
        member_span = $(value);
        member = $(member_span).text();
        tsv_content += "\t" + member;
      } else if (index == "house") {
        if (value == "-") {
          tsv_content +=
            "\t" +
            selected_house.charAt(0).toUpperCase() +
            selected_house.slice(1);
        }
        tsv_content +=
          "\t" +
          $("<div/>")
            .html(value)
            .text();
      } else if (index == "description") {
        tsv_content += "\t" + value;
      } else if (index == "relevance") {
        if (value != "-") {
          relevance_flag = true;
          tsv_content += "\t" + value;
        }
      }
    });
    tsv_content += "\n";
  }

  if (relevance_flag) {
    tsv_content =
      "Date\tLeft Context\tRight Context\tMember\tHouse\tDebate\tTitle\tRelevance\n" +
      tsv_content;
  } else {
    tsv_content =
      "Date\tLeft Context\tRight Context\tMember\tHouse\tDebate\tTitle\n" +
      tsv_content;
  }

  saveAs(new Blob([tsv_content], { type: "text/tsv" }), "Concordances.tsv");
  $("#downloadFile").modal("show");
}

function saveResultsAsZip(data, offset) {
  ids_str_query = "";

  for (i = 0; i < data.length; i++) {
    $.each(data[i], function(index, value) {
      if (index == "document_id") {
        if (ids_str_query == "") {
          ids_str_query = "'" + value + "'";
        } else {
          ids_str_query += ",'" + value + "'";
        }
      }
    });
  }
  $.ajax({
    url: "src/php/search_functions.php",
    type: "post",
    data: {
      query: ids_str_query,
      action: "save_documents",
      house: selected_house,
      offset: offset
    },

    beforeSend: function() {},

    complete: function() {
      updateSearchButtonOff();
    },

    success: function(data, status) {
      if (data != null) {
        window.location = "tmp/" + data;
        $("#downloadFile").modal("show");
      } else {
        $(".error-code").html("<b>Error code:</b> 1 -download");
        $("#error").modal("show");
      }
    },
    error: function(xhr, desc, err) {
      if (err != "abort") {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
        $(".error-code").html("<b>Error code:</b> 2 -download");
        $("#error").modal("show");
      }
    }
  });
}

function saveLineChartAsCSV() {
  csv_content = new Array();
  csv_keys = new Array();

  for (i = 0; i < freq_line_data.length; i++) {
    if (flag_normalised) {
      csv_content[i] = "Date,Frequency (hits per million of words)\n";
    } else {
      csv_content[i] = "Date,Frequency (number of documents)\n";
    }

    csv_keys[i] = freq_line_data[i]["key"];

    x = "";
    y = "";

    $.each(freq_line_data[i]["values"], function() {
      $.each($(this)[0], function(index, value) {
        if (index == "x") {
          csv_content[i] += value + ",";
        } else if (index == "y") {
          csv_content[i] += value + "\n";
        }
      });
    });
  }
  for (i = 0; i < freq_line_data.length; i++) {
    saveAs(
      new Blob([csv_content[i]], { type: "text/csv" }),
      "line_chart_" + csv_keys[i] + ".csv"
    );
  }
  $("#downloadFile").modal("show");
}

//func = .search .results
//c_flag = count on background
function searchContribution(data_point, c_flag, func) {

  // a fix to ensure that submode returns to basic when not in explore, when refactoring will clean up some of this missing logic.
  if(typeof selected_function === 'undefined'){
    selected_submode = "basic"
  }else{
    if(selected_function !== "explore"){
      selected_submode = "basic"
    }
  }

  count_flag = c_flag;

  
  $(".search .convert-kwic-doc")
  .parent(".custom-control")
  .removeClass("hidden");

  if (func.indexOf("explore") != -1) {
    if ($(".search .convert-kwic-doc").is(":checked")) {
      action = "contribution-kwic";
      $("#tooltip_4_6.help").tooltip("disable");
    } else {
      action = "contribution";
      $("#tooltip_4_6.help").tooltip("enable");
      $(func + "results_hits").hide();
      action = "contribution";
    }

    if (selected_submode == "wordcloud") {
      parameters = parameter_wc;
      formatDate = "year";
    } else {
      parameters = parameter_bubble;
      formatDate = "full";
    }
  } else {
    if (selected_submode == "basic") {
      action = "contribution";
      formatDate = "year";

      if ($(".search .convert-kwic-doc").is(":checked")) {
        action += "-kwic";
        $("#tooltip_4_6.help").tooltip("disable");
      } else {
        $("#tooltip_4_6.help").tooltip("enable");
        $(func + "results_hits").hide();
      }
    } else if ($("#pills-advanced-tab").hasClass("active")) {
      action = "contribution";

      if ($(".search .convert-kwic-doc").is(":checked")) {
        action += "-kwic";
        $("#tooltip_4_6.help").tooltip("disable");
      } else {
        $("#tooltip_4_6.help").tooltip("enable");
        $(func + "results_hits").hide();
      }
    }
    parameters = parameter_basic;
  }

  $(func + " #results_term").html(
    parameters[0]["term"] +
      " <span class='badge badge-light'>" +
      dateFrom +
      " - " +
      dateTo +
      " </span>"
  );

  $(func + " .loader").css("display", "block");
  $(func + " .cancel-query").css("display", "flex");
  $(func).show();

  $("html, body").animate(
    {
      scrollTop: $(func + " #results_table").offset().top
    },
    500
  );

  $(func + " #results_table").bootstrapTable("removeAll");

  conf = getTableConfiguration(action, null);

  columns_conf = conf["columns_conf"];
  action_conf = conf["action"];
  sort_name = conf["sort_name"]; //First time

  $(func + " #results_table")
    .bootstrapTable("destroy")
    .bootstrapTable({
      columns: columns_conf,
      formatLoadingMessage: function() {
        return "Loading, please wait ...";
      },
      sortName: sort_name,
      formatShowingRows: function(pageFrom, pageTo, totalRows) {
        return (
          "Showing " +
          pageFrom +
          " to " +
          pageTo +
          " of " +
          totalRows +
          " contributions"
        );
      },
      formatRecordsPerPage: function(pageNumber) {
        return pageNumber + " contributions per page";
      },
      ajaxOptions: {
        beforeSend: function(jqXHR) {
          $.xhrPool.push(jqXHR);
        },
        complete: function(jqXHR) {
          var index = $.inArray(jqXHR, $.xhrPool);

          if (index > -1) {
            $.xhrPool.splice(index, 1);
          }
        }
      },
      queryParams: function(p) {
        return {
          limit: p.limit,
          offset: p.offset,
          sort: p.sort,
          order: p.order,
          parameters: parameters[0],
          action: action_conf,
          dateFrom: dateFrom,
          dateTo: dateTo,
          house: selected_house,
          context: context,
          count: count_of_documents,
          formatDate: formatDate
        };
      },
      url: "src/php/search_functions.php",
      method: "get",

      onLoadSuccess: function(data) {
        if ((data != null) & isJson('"' + data + '"')) {
          $(func + " .loader").css("display", "none");
          $(func + " .cancel-query").css("display", "none");

          $(func + ' th[data-field="member"]').tooltip({
            delay: { show: 3000, hide: 500 },
            placement: "top",
            html: true,
            title:
              "Click on a member’s name to find more information about them."
          });

          $(func + ' th[data-field="contribution"]').tooltip({
            delay: { show: 3000, hide: 500 },
            placement: "top",
            html: true,
            title:
              "This display shows the search term in the context of a single contribution from the current speaker. There may be more than one hit in the contribution and the additional number of hits is noted after the extract shown. If you want to see the whole contribution, you can click anywhere on the text."
          });

          $(func + " .keep-open.btn-group").attr(
            "data-original-title",
            "Use this to exclude date, contribution,<br>\n\r Member and/or House <br>\n\rfrom the display."
          );
          $(func + " .keep-open.btn-group").tooltip({
            delay: { show: 3000, hide: 500 },
            placement: "left",
            html: true
          });

          if (action.indexOf("kwic") != -1) {
            $(func + ' th[data-field="#document"]').tooltip({
              delay: { show: 3000, hide: 500 },
              placement: "top",
              html: true,
              title:
                "Hits are numbered to correspond to the number of the contribution that they occur in, which is why there is often more than one identical number in this column."
            });
          }

          if ($(".tooltip-config").not(":checked").length == 1) {
            $(
              "[data-toggle='tooltip'], .help, th, .keep-open.btn-group"
            ).tooltip("disable");
          }

          if (data.total == 0) {
            $(func + " #results_table")
              .bootstrapTable("destroy")
              .bootstrapTable({
                formatNoMatches: function() {
                  return "Sorry, there are no results that match your search.";
                }
              });
          }

          if (!count_flag) {
            if ($(".search .convert-kwic-doc").is(":checked")) {
              flag_kwic = true;
            } else {
              flag_kwic = false;
            }
            getTotalDocuments(
              func + " #results_table",
              parameters[0]["action"],
              flag_kwic
            );
            count_flag = true;
            $(func + " #results_table th div").prop("disabled", true);
            $(func + " #results_table th div").attr("data-disabled", true);

            if (action.indexOf("kwic") != -1) {
              getTotalHits(false, 0);
            }
          }

          if (data.total != 0) {
            if (data.total != "total") {
              if (count_of_documents == 0) {
                $(func + " #results_docs").html(data.total + " contributions");
                count_of_documents = data.total;
              }
              $(func + " #results_table th div").prop("disabled", false);
              $(func + " #results_table th div").attr("data-disabled", false);
            } else {
              $(func + " #results_docs").html(
                "Loading number of contributions"
              );
            }

            $(".dropdown-toggle").click(function() {
              $(".tooltip").tooltip("hide");
            });

            if ($(func + " .convert-title").prop("checked")) {
              $(func + " .table").bootstrapTable("showColumn", "description");
            } else {
              $(func + " .table").bootstrapTable("hideColumn", "description");
            }
          } else {
            $(func + " #compare_docs_" + (index + 1)).html("0 contributions");
          }
        } else {
          $(".error-code").html("<b>Error code:</b> 1 - basic contribution");
          $("#error").modal("show");
        }
      },
      onLoadError: function(status) {
        console.log(status);

        $(func + " #results_table")
          .bootstrapTable("destroy")
          .bootstrapTable({
            formatNoMatches: function() {
              return 'Unexpected error, please contact us <a target="_blank" href="index.php?show=feedback">here</a>.';
            }
          });

        $(".error-code").html("<b>Error code:</b> 2 - basic contribution");
        $("#error").modal("show");
      },
      onClickCell: function(field, value, row, $element) {
        $("td").removeClass("text-info font-weight-bold");
        $element.addClass("text-info font-weight-bold");

        identif = row.document_id;
        date = row.date;
        row_house = row.house.replace(/<(?:.|\n)*?>/gm, "").toLowerCase();

        member_span = $(row.member);
        member = $(member_span).text();
        url_member = $(member_span).data("url");

        switch (field) {
          case "member":
            window.open(url_member, "_blank");
            break;
          case "contribution":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameters[0],
              "." + selected_mode + " .contribution"
            );
            break;

          case "left_context":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameters[0],
              "." + selected_mode + " .contribution"
            );
            break;

          case "right_context":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameters[0],
              "." + selected_mode + " .contribution"
            );
            break;

          case "hit":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameters[0],
              "." + selected_mode + " .contribution"
            );
            break;

          case "date":
            searchContributionDate(identif, date, member, $element);
            break;
        }
      }
    });
}

//func = .search .contribution
function showContribution(
  date_table,
  member_table,
  id_table,
  house_table,
  query_table,
  func
) {
  resetContribution();

  $("." + selected_mode + " #contribution_original").html("");

  SELECTED_ID = id_table;
  SELECTED_QUERY = query_table["term"];

  query_title = query_table["query"];

  if (!contribution_ajax_complete) {
    cancelSQLQuery("." + selected_mode + " .contribution");
  }

  contribution_ajax = $.ajax({
    url: "src/php/search_functions.php",
    type: "post",
    data: {
      id: SELECTED_ID,
      action: "contribution-expand",
      house: selected_house,
      row_house: house_table,
      query: query_table["term"]
    },

    beforeSend: function() {
      contribution_ajax_complete = false;

      $(func + " #contribution_card").html("");

      $(func + " #contribution_member").html(member_table);
      $(func + " #contribution_query").html(
        query_title +
          " <span class='badge badge-light'>" +
          date_table +
          " </span>"
      );

      $(func + " .loader").css("display", "block");
      $(func + " .cancel-query").css("display", "flex");
      $(func).show();

      $("html, body").animate(
        {
          scrollTop: $(func + " #contribution_card").offset().top
        },
        500
      );

      $(func + " .btn-toolbar").css("display", "none");
    },

    complete: function() {
      updateSearchButtonOff();
      contribution_ajax_complete = true;

      $(func + " .loader").css("display", "none");
      $(func + " .cancel-query").css("display", "none");
      $(func + " .btn-toolbar").css("display", "block");
      $("html, body").animate(
        {
          scrollTop: $(func + " #contribution_card").offset().top
        },
        500
      );
    },

    success: function(data, status) {
      if ((data != null) & isJson(data)) {
        data_json = JSON.parse(data);
        $(func + " #contribution_card").html(data_json.contributiontext);
      } else {
        $(".error-code").html("<b>Error code:</b> 1 - show contribution");
        $("#error").modal("show");
      }
    },
    error: function(xhr, desc, err) {
      if (err != "abort") {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
        $(".error-code").html("<b>Error code:</b> 2 - show contribution");
        $("#error").modal("show");
      }
    }
  });
}

//data_points = frequency lines
//func = .search .compare-results
//c_flag = count on background
function searchContributionCompare(data_points, c_flag, func) {
  
  if(typeof selected_function === 'undefined'){
    selected_submode = "basic"
  }else{
    if(selected_function !== "explore"){
      selected_submode = "basic"
    }
  }

  var num = num_queries;
  $(".search .convert-kwic-doc")
  .parent(".custom-control")
  .removeClass("hidden");


  if (selected_submode == "basic" && func.indexOf(".search") != -1) {
    action = "contribution";

    formatDate = "year";

    if ($(".search .convert-kwic-doc").is(":checked")) {
      action += "-kwic";
      $("#tooltip_4_6.help").tooltip("disable");
    } else {
      $("#tooltip_4_6.help").tooltip("enable");
      $(func + "results_hits").hide();
    }
    var parameters = parameter_basic;
  } else if (func == ".explore .compare-results") {
    if ($(".explore .convert-kwic-doc").is(":checked")) {
      action = "contribution-kwic";
      $("#tooltip_4_6.help").tooltip("disable");
    } else {
      action = "contribution";
      $("#tooltip_4_6.help").tooltip("enable");
      $(func + "results_hits").hide();
      action = "contribution";
    }
    if (selected_submode == "wordcloud") {
      var parameters = parameter_wc;
      formatDate = "year";
    } else {
      var parameters = parameter_bubble;
      formatDate = "full";
    }
  }

  count_flag_compare = c_flag;

  $(
    func +
      " #compare_table_1, " +
      func +
      "  #compare_table_2, " +
      func +
      " #compare_table_3, " +
      func +
      " #compare_table_4"
  ).hide();

  conf = getTableConfiguration(action, null);

  columns_conf = conf["columns_conf"];
  action_conf = conf["action"];
  sort_name = conf["sort_name"]; //First time

  switch (num) {
    case 2:
      $(
        func + " #compare_table_1, " + func + " #compare_table_2"
      ).bootstrapTable("removeAll");
      $(
        func + " #compare_table_1, " + func + " #compare_table_2"
      ).bootstrapTable({
        formatLoadingMessage: function() {
          return "<br><br> Loading, please wait ... <br>";
        }
      });

      $(
        func +
          " #compare_table_1, " +
          func +
          " #toolbar_compare_1 .selections, " +
          func +
          " #compare_table_2, " +
          func +
          " #toolbar_compare_2 .selections"
      ).show();
      break;

    case 3:
      $(
        func +
          " #compare_table_1, " +
          func +
          " #compare_table_2, " +
          func +
          " #compare_table_3"
      ).bootstrapTable("removeAll");
      $(
        func +
          " #compare_table_1, " +
          func +
          " #compare_table_2, " +
          func +
          " #compare_table_3"
      ).bootstrapTable({
        formatLoadingMessage: function() {
          return "<br><br> Loading, please wait ... <br>";
        }
      });
      $(
        func +
          " #compare_table_1, " +
          func +
          " #toolbar_compare_1 .selections, " +
          func +
          " #compare_table_2, " +
          func +
          " #toolbar_compare_2 .selections, " +
          func +
          " #compare_table_3, " +
          func +
          " #toolbar_compare_3 .selections"
      ).show();
      break;

    case 4:
      $(
        func +
          " #compare_table_1, " +
          func +
          " #compare_table_2, " +
          func +
          " #compare_table_3, " +
          func +
          " #compare_table_4"
      ).bootstrapTable("removeAll");
      $(
        func +
          " #compare_table_1, " +
          func +
          " #compare_table_2, " +
          func +
          " #compare_table_3, " +
          func +
          " #compare_table_4"
      ).bootstrapTable({
        formatLoadingMessage: function() {
          return "<br><br> Loading, please wait ... <br>";
        }
      });
      $(
        func +
          " #compare_table_1, " +
          func +
          " #toolbar_compare_1 .selections, " +
          func +
          " #compare_table_2, " +
          func +
          " #toolbar_compare_2 .selections, " +
          func +
          " #compare_table_3, " +
          func +
          " #toolbar_compare_3 .selections, " +
          func +
          " #compare_table_4, " +
          func +
          " #toolbar_compare_4 .selections"
      ).show();
      break;
  }

  $(func + " .loader").css("display", "block");
  $(func + " .cancel-query").css("display", "flex");
  $(func).show();

  $("html, body").animate(
    {
      scrollTop: $(func + " #compare_table_1").offset().top
    },
    500
  );

  $.each(data_points, function(index, value) {
    /*
    var word = value.series.key;
    var docs = value.point.freqRaw;
    var year = value.point.x;
    */
    index = parseInt(index);

    $(func + " #compare_term_" + (index + 1)).html(
      parameters[index]["term"] +
        " <span class='badge badge-light'>" +
        dateFrom +
        " - " +
        dateTo +
        " </span>"
    );

    $(func + " #compare_table_" + (index + 1))
      .bootstrapTable("destroy")
      .bootstrapTable({
        columns: columns_conf,
        sortName: sort_name, //First time
        formatShowingRows: function(pageFrom, pageTo, totalRows) {
          return (
            "Showing " +
            pageFrom +
            " to " +
            pageTo +
            " of " +
            totalRows +
            " contributions"
          );
        },
        formatRecordsPerPage: function(pageNumber) {
          return pageNumber + " contributions per page";
        },
        formatLoadingMessage: function() {
          return "Loading, please wait ...";
        },
        ajaxOptions: {
          beforeSend: function(jqXHR) {
            $.xhrPool.push(jqXHR);
          },
          complete: function(jqXHR) {
            var index = $.inArray(jqXHR, $.xhrPool);

            if (index > -1) {
              $.xhrPool.splice(index, 1);
            }
          }
        },
        queryParams: function(p) {
          return {
            limit: p.limit,
            offset: p.offset,
            sort: p.sort,
            order: p.order,
            parameters: parameters[index],
            action: action_conf,
            dateFrom: dateFrom,
            dateTo: dateTo,
            house: selected_house,
            context: context,
            count: count_of_documents_compare[index],
            formatDate: formatDate
          };
        },
        url: "src/php/search_functions.php",
        method: "get",

        onLoadSuccess: function(data) {
          if ((data != null) & isJson('"' + data + '"')) {
            $(
              func +
                " #compare_table_" +
                (index + 1) +
                ' th[data-field="member"]'
            ).tooltip({
              delay: { show: 3000, hide: 500 },
              placement: "top",
              html: true,
              title:
                "Click on a member’s name to find more information about them."
            });

            $(
              func +
                " #compare_table_" +
                (index + 1) +
                ' th[data-field="contribution"]'
            ).tooltip({
              delay: { show: 3000, hide: 500 },
              placement: "top",
              html: true,
              title:
                "This display shows the search term in the context of a single contribution from the current speaker. There may be more than one hit in the contribution and the additional number of hits is noted after the extract shown. If you want to see the whole contribution, you can click anywhere on the text."
            });

            $(
              func + " #compare_table_" + (index + 1) + " .keep-open.btn-group"
            ).attr(
              "data-original-title",
              "Use this to exclude date, contribution, Member and/or House from the display."
            );
            $(
              func + " #compare_table_" + (index + 1) + " .keep-open.btn-group"
            ).tooltip({
              delay: { show: 3000, hide: 500 },
              placement: "left",
              html: true
            });

            if (action.indexOf("kwic") != -1) {
              $(
                func +
                  " #compare_table_" +
                  (index + 1) +
                  ' th[data-field="#document"]'
              ).tooltip({
                delay: { show: 3000, hide: 500 },
                placement: "top",
                html: true,
                title:
                  "Hits are numbered to correspond to the number of the contribution that they occur in, which is why there is often more than one identical number in this column."
              });
            }

            if ($(".tooltip-config").not(":checked").length == 1) {
              $(
                "[data-toggle='tooltip'], .help, th, .keep-open.btn-group"
              ).tooltip("disable");
            }

            if (data.total == 0) {
              $(func + " #compare_table_" + (index + 1))
                .bootstrapTable("destroy")
                .bootstrapTable({
                  formatNoMatches: function() {
                    return "Sorry, there are no results that match your search.";
                  }
                });
            }

            if (!count_flag_compare[index]) {
              if ($(".search .convert-kwic-doc").is(":checked")) {
                flag_kwic = true;
              } else {
                flag_kwic = false;
              }
              getTotalDocuments(
                func + " #compare_table_" + (index + 1),
                action_conf,
                flag_kwic
              );
              count_flag_compare[index] = true;
              $(func + " #compare_table_" + (index + 1) + " th div").prop(
                "disabled",
                true
              );
              $(func + " #compare_table_" + (index + 1) + " th div").attr(
                "data-disabled",
                true
              );

              if (action.indexOf("kwic") != -1) {
                getTotalHits(true, index);
              }
            }

            if (data.total != 0) {
              if (data.total != "total") {
                if (count_of_documents_compare[index] == 0) {
                  $(func + " #compare_docs_" + (index + 1)).html(
                    data.total + " contributions"
                  );
                  count_of_documents_compare[index] = data.total;
                }
                $(func + " #compare_table_" + (index + 1) + " th div").prop(
                  "disabled",
                  false
                );
                $(func + " #compare_table_" + (index + 1) + " th div").attr(
                  "data-disabled",
                  false
                );
              } else {
                $(func + " #compare_docs_" + (index + 1)).html(
                  "Loading number of contributions"
                );
              }

              $(".dropdown-toggle").click(function() {
                $(".tooltip").tooltip("hide");
              });

              if ($("." + selected_mode + " .convert-title").prop("checked")) {
                $(func + " #compare_table_" + (index + 1)).bootstrapTable(
                  "showColumn",
                  "description"
                );
              } else {
                $(func + " #compare_table_" + (index + 1)).bootstrapTable(
                  "hideColumn",
                  "description"
                );
              }
            } else {
              $(func + " #compare_docs_" + (index + 1)).html("0 contributions");
            }
          } else {
            $(".error-code").html("<b>Error code:</b> 3 - basic contribution");
            $("#error").modal("show");
          }
        },
        onLoadError: function(status) {
          console.log(status);

          $(func + " #compare_table_" + (index + 1))
            .bootstrapTable("destroy")
            .bootstrapTable({
              formatNoMatches: function() {
                return 'Unexpected error, please contact us <a target="_blank" href="index.php?show=feedback">here</a>.';
              }
            });

          $(".error-code").html("<b>Error code:</b> 4 - basic contribution");
          $("#error").modal("show");
        },
        onClickCell: function(field, value, row, $element) {
          $("td").removeClass("text-info font-weight-bold");
          $element.addClass("text-info font-weight-bold");

          identif = row.document_id;
          date = row.date;
          row_house = row.house.replace(/<(?:.|\n)*?>/gm, "").toLowerCase();

          member_span = row.member;
          member = $(member_span).text();
          url_member = $(member_span).data("url");

          switch (field) {
            case "member":
              window.open(url_member, "_blank");
              break;

            case "contribution":
              showContribution(
                date,
                member,
                identif,
                row_house,
                parameters[index],
                "." + selected_mode + " .contribution"
              );
              break;

            case "left_context":
              showContribution(
                date,
                member,
                identif,
                row_house,
                parameters[index],
                "." + selected_mode + " .contribution"
              );
              break;

            case "right_context":
              showContribution(
                date,
                member,
                identif,
                row_house,
                parameters[index],
                "." + selected_mode + " .contribution"
              );
              break;

            case "hit":
              showContribution(
                date,
                member,
                identif,
                row_house,
                parameters[index],
                "." + selected_mode + " .contribution"
              );
              break;

            case "date":
              searchContributionDate(
                identif,
                date,
                member,
                $element,
                row_house
              );
              break;
          }
        }
      });
  });

  $(func + " .loader").css("display", "none");
  $(func + " .cancel-query").css("display", "none");
  $("html, body").animate(
    {
      scrollTop: $(func + " #compare_table_1").offset().top
    },
    500
  );
}

function saveOriginalContribution() {
  content = $("." + selected_mode + " #contribution_original").html();

  if (content == "") {
    original = $("." + selected_mode + " #contribution_card").html();
    $("." + selected_mode + " #contribution_original").html(original);
  }
}

function resetContribution() {
  $("." + selected_mode + " #contribution_card").html(
    $("." + selected_mode + " #contribution_original").html()
  );
  $("button.analysis").removeClass("active");
}

function resetComparison() {
  range_of_dates_distrib = [];
  $(".nv-point").removeClass("selected");
  $(
    ".search .distribution .timeline-one, .search .distribution .timeline-two"
  ).html("");
}

//Reset all except dates
function resetAllSearch() {
  resetInputsSearch();
  resetVariablesSearch();
  hideResultsSearch();
  resetBadgesAndButtons();
  resetLists();
  abortAjax();
}

function resetFromDistribution() {
  $(".search .results").hide();
  $(".search .compare-results").hide();
  $(".search .members").hide();
  $(".search .contribution").hide();
  $(".search .descriptions").hide();
}

function abortAjax() {
  if (distribution_ajax != null) {
    distribution_ajax.abort();
  }

  if (wc_distribution_ajax != null) {
    wc_distribution_ajax.abort();
  }

  if (hits_ajax != null) {
    hits_ajax.abort();
  }

  $.each(hits_ajax_compare, function(key, value) {
    if (value != null) {
      value.abort();
    }
  });
}

function resetRelatedTerms() {
  $(".related-terms.basic-search").hide();

  $("button.related-search.basic-search").html(
    "<i class='fas fa-search-plus'></i> Related terms"
  );
  $("button.related-search.basic-search").removeClass(
    "btn-loading-warning btn-warning"
  );
  $("button.related-search.basic-search").addClass("btn-outline-info");
}

function resetBadgesAndButtons() {
  $(".search input").removeClass("is-invalid");

  $(".search span.badge:not(.badge-danger)").html("");
  $("button.analysis").removeClass("active");
  $(".nv-point").removeClass("selected");

  if ($(".advanced-search .submit").html() == "Update") {
    $(".advanced-search .submit").html("Search");
    $(".advanced-search .submit").removeClass("update");
  }

  if ($(".basic-search .submit").html() == "Update") {
    $(".basic-search .submit").html("Search");
    $(".basic-search .submit").removeClass("update");
  }

  $("." + selected_mode + " .advanced-search .semantic-tags-list > div").html(
    ""
  );
  $("." + selected_mode + " .advanced-search .semantic-tags-list").hide();

  $("." + selected_mode + " .convert-title").attr("checked", false);
}

function resetInputsSearch() {
  $(".search input:text.basic-search.input-query").val("");

  $(".search input:text.advanced-search.input-query").val("");

  $(".search input:text.advanced-search.input-description").val("");
  $(".search input:text.advanced-search.typeahead").val("");
}

function resetLists() {
  $(".basic-search .related-terms > div").html("");
  $(".basic-search .related-terms").hide();

  $("button.related-search.basic-search").html(
    "<i class='fas fa-search-plus'></i> Related terms"
  );
  $("button.related-search.basic-search").removeClass(
    "btn-loading-warning btn-warning"
  );
  $("button.related-search.basic-search").addClass("btn-outline-info");

  $(".terms-list > div").html("");
  $(".terms-list").hide();

  $(".advanced-search .tags-list > div").html("");
  $(".advanced-search .tags-list").hide();

  $(
    ".search .distribution .timeline-one, .search .distribution .timeline-two"
  ).html("");
}

function resetVariablesSearch() {
  num_queries = 0;
  colours_queries = [
    ["#FF355E", false],
    ["#66FF66", false],
    ["#50BFE6", false],
    ["#FF9933", false]
  ];

  distribution_ajax_complete = true;
  contribution_ajax_complete = true;

  hits_ajax_complete = true;
  hits_ajax = null;
  hits_compare_ajax_complete = [true, true, true, true];
  hits_ajax_compare = [null, null, null, null];

  /*
  dateFrom = "";
  dateTo = "";
  */

  range_of_dates_distrib = [];

  freq_line_data = null;

  count_flag = false;
  count_of_documents = 0;

  count_of_documents_compare = [0, 0, 0, 0];
  count_flag_compare = [false, false, false, false];

  description = "";
  member = "";
  selected_semantic_tags = [];

  parameter_query = "";
  parameter_member = "";
  parameter_description = "";

  parameter_advanced = {};
  parameter_basic = {};
}

function hideResultsSearch() {
  $(".search .distribution").hide();
  $(".search .results").hide();
  $(".search .compare-results").hide();
  $(".search .members").hide();
  $(".search .contribution").hide();
  $(".search .descriptions").hide();
}

function cancelSQLQuery(query_container) {
  $.ajax({
    url: "src/php/search_functions.php",
    type: "post",
    data: { action: "killPID" },

    beforeSend: function() {},

    complete: function() {
      updateSearchButtonOff();
      if (query_container.indexOf(".distribution") != -1) {
        $("html, body").animate(
          {
            scrollTop: $(query_container + " .line-chart").offset().top
          },
          500
        );
      } else if (query_container.indexOf(".compare-results") != -1) {
        $("html, body").animate(
          {
            scrollTop: $(query_container + " #compare_table_1").offset().top
          },
          500
        );
      } else if (query_container.indexOf(".results") != -1) {
        $("html, body").animate(
          {
            scrollTop: $(query_container + " #results_table").offset().top
          },
          500
        );
      } else if (query_container.indexOf(".contribution") != -1) {
        $("html, body").animate(
          {
            scrollTop: $(query_container + " #contribution_card").offset().top
          },
          500
        );
      } else if (query_container.indexOf(".word_cloud") != -1) {
        $("html, body").animate(
          {
            scrollTop: $(query_container + " #word_cloud").offset().top
          },
          500
        );
      } else if (query_container.indexOf(".bubble") != -1) {
        $("html, body").animate(
          {
            scrollTop: $(query_container + " #bubble").offset().top
          },
          500
        );
      }
    },

    success: function(data, status) {
      if (query_container.indexOf(".distribution") != -1) {
        $(query_container + " .line-chart").html(
          "<div style='text-align:center'><text class='nvd3 nv-noData' style='text-anchor: middle;'>The query has been cancelled.</text></div>"
        );

        if (distribution_ajax != null) {
          if (selected_submode == "basic") {
            distribution_ajax.abort();
          }
        }

        if (wc_distribution_ajax != null) {
          wc_distribution_ajax.abort();
        }
        $(query_container + " .loader").css("display", "none");
        $(query_container + " .cancel-query").css("display", "none");
      } else {
        $(query_container + " .loader").css("display", "none");
        $(query_container + " .cancel-query").css("display", "none");

        if (query_container.indexOf(".compare-results") != -1) {
          for (i = 0; i < 4; i++) {
            $(query_container + " #compare_table_" + (i + 1))
              .bootstrapTable("destroy")
              .bootstrapTable({
                formatNoMatches: function() {
                  return "The query has been cancelled.";
                }
              });
          }

          $.xhrPool.abortAll();
        } else if (query_container.indexOf(".results") != -1) {
          $(query_container + " #results_table")
            .bootstrapTable("destroy")
            .bootstrapTable({
              formatNoMatches: function() {
                return "The query has been cancelled.";
              }
            });

          $.xhrPool.abortAll();
        } else if (query_container.indexOf(".contribution") != -1) {
          $(query_container + " #contribution_card").html(
            "<div style='text-align:center'><text class='nvd3 nv-noData' style='text-anchor: middle;'>The query has been cancelled.</text></div>"
          );
          contribution_ajax.abort();
        } else if (query_container.indexOf(".word_cloud") != -1) {
          $(query_container + " #word_cloud").html(
            "<div style='text-align:center'><text class='nvd3 nv-noData' style='text-anchor: middle;'>The query has been cancelled.</text></div>"
          );
          wc_ajax.abort();
        } else if (query_container.indexOf(".bubble") != -1) {
          $(query_container + " #bubble").html(
            "<div style='text-align:center'><text class='nvd3 nv-noData' style='text-anchor: middle;'>The query has been cancelled.</text></div>"
          );
          bubble_ajax.abort();
        }
      }
    },
    error: function(xhr, desc, err) {
      if (err != "abort") {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
        $(".error-code").html("<b>Error code:</b> 1 - cancel query");
        $("#error").modal("show");
      }
    }
  });
}
