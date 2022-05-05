
var advanced_mode = false;

var preMinDate = '2000-01-01';
var preMaxDate = '2022-01-01';

var minDate;
var maxDate;

var dateFrom;
var dateTo;

var freq_line_data;
var flag_normalised;

const ERROR_MODAL = $('#ErrorModal');
const ERROR_MODAL_DESC = ERROR_MODAL.find("#error-desc");
const ERROR_MODAL_CODE = ERROR_MODAL.find("#error-code");

const HOUSE_LORDS = "lords";
const HOUSE_COMMONS = "commons";
const HOUSE_BOTH = "both";
const STATE_ON = "on";

var parameters = {};

var shared = false;
var searchId = checkParas();
var sessionId = generateId(18);

var num_queries = 0;
var colours_queries = [
    ["#FF355E", false],
    ["#66FF66", false],
    ["#50BFE6", false],
    ["#FF9933", false]
];

const func_ = [
  "#compare_table_1",
  "#compare_table_2",
  "#compare_table_3",
  "#compare_table_4"
]

var selected_table = 0;

var range_of_dates_distrib = [];

var kwic_toggle = false;
var search_rank = false;
var selected_house = HOUSE_COMMONS;
var context = 10;
var count_of_documents = 0;
var count_flag = false;
var keys = {};


var contribution_ajax_complete = true;

$.xhrPool = [];

$.xhrPool.abortAll = function() {
  $(this).each(function(i, jqXHR) {
    jqXHR.abort();
    $.xhrPool.splice(i, 1);
  });
};

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


function getTotalDocuments(table, action, f_kwic) {
    $(table).bootstrapTable("refresh", {
      query: { count: 1, action: action, kwick: f_kwic }
    });
}

$('#advancedOptionCheck').click(() => {
    advanced_mode = !advanced_mode;

    $('.adv-date').toggleClass('active');
    $('.basic-date').toggleClass('active');

    updateDates();

    $('.advanced-options').toggle(200);
})

$(".export-png").click(()=>{
  saveSvgAsPng($("#distribution-body svg")[0], "line_chart.png", {
    backgroundColor: "white"
  });
})


$(".export-excel").click(()=> {
  saveLineChartAsExcel();
});

$(".export-csv").click(()=> {
  saveLineChartAsCSV();
});


$(document).keydown(function(e) {
  keys[e.which] = true;

  if (keys[16] && keys[65]) { //shift + A
    console.log("advanced toggle");
    $('#advancedOptionCheck').trigger('click');
  }
});

$(document).keyup(function(e) {
  delete keys[e.which];
});

$('#term').keyup((event)=>{
  if(event.which == 13){
    get_distribution();
  }
})

$('input[name="commons-check"]').change(()=>{
    $('.member').hide();
    let house = get_house();
    $('#'+house+'-member').show();
})
$('input[name="lords-check"]').change(()=>{
    $('.member').hide();
    let house = get_house();
    $('#'+house+'-member').show();
})

$("#search-btn").click(()=>{
    get_distribution();
})

$("#reset-btn").click(()=>{
    reset_parameters();
})

$(".context-word-container").hide();

$(".convert-kwic-doc").click(
    ()=>{
        kwic_toggle = !kwic_toggle;

        $(".convert-kwic-doc").prop('checked', kwic_toggle);

        $(".context-word-container").slideToggle(200);

        contribution(range_of_dates_distrib, true);
    }
);

$(".context-word").change((e)=>{

    $(".context-word").val($(e.target).val());

    context = $(e.target).val()
    
    contribution(range_of_dates_distrib, true);
    
})

$(".term-clickable i").click(()=>{
    console.log("?");
})

$("#close-modal").click(()=>{
  ERROR_MODAL.modal("hide");
})

init();

function error_handler(code, desc){
  ERROR_MODAL_CODE.html(code);
  ERROR_MODAL_DESC.html(desc);

  ERROR_MODAL.modal('show');
}

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
  //$("#downloadFile").modal("show");
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

function init(){
    set_max_min_dates();
    update_autofill();
    updateDates();
}

function isValidParameters(advanced){

  if(!advanced){
    let l_t = $("#term").val().length;
    if(l_t == 0){
        text_validation = "Search term is required!" 
    }else{
        text_validation = ""
    }
  }else{

    let l_t = $("#term").val().length;
    let dt_t = $("#desc").val().length;
    let m_t = $("#"+selected_house+"-member").val().length;

    if((l_t+dt_t+m_t) == 0){
        text_validation = "Search term, Debate title, or Member is required!" 
    }else{
        text_validation = ""
    }

  }
  
  let commons = ($('input[name="commons-check"]:checked').val() == STATE_ON);
  let lords = ($('input[name="lords-check"]:checked').val() == STATE_ON);


  var house_validation = "";

  if((commons == lords) && lords == false){
    house_validation = "A house must be selected!";
  }else{
    house_validation = "";
  }


  $("#validation-house").html(house_validation);
  if(advanced){
    $(".text-validate").html(text_validation);
  }
  $("#validation-text").html(text_validation);


  return (text_validation.length + house_validation.length + $(".validation-date-from").html().length + $(".validation-date-to").html().length) == 0;

}


function update_autofill(){

    let houses = ["both", "commons", "lords"];

    houses.forEach(h => {

        if (h != "both"){
            let members = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                prefetch: 'config/forms/members_' + h + '.json'
            });

            $('#'+h+'-member').typeahead(
                {
                    highlight: true
                }, 
                {
                name: 'members',
                source: members
            });
        }else{

            let lords = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                prefetch: 'config/forms/members_lords.json'
            });

            let commons = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                prefetch: 'config/forms/members_commons.json'
            });

            $('#both-member').typeahead(
                {
                    highlight:true
                },
                {
                    name: 'lords',
                    source: lords,
                    templates: {
                      header: '<h5 class="members-title-lords">Lords</h5>'
                    }
                },
                {
                    name: 'commons',
                    source: commons,
                    templates: {
                      header: '<h5 class="members-title-commons">Commons</h5>'
                    }
                }
            )
        }
        
        
    });

    
}

function set_max_min_dates(){
    $.ajax(
        {
            url:"src/php/search_functions.php",
            type:"post",
            data: {
              action: "maxDate"
            },
            success: (data)=>{
                if (data != null) {

                    try {
                      maxDate = JSON.parse(data)[0]["upperdate"];
                    } catch (error) {
                      error_handler("database connection error", "Unable to establish a connection to the database. This might be due to a server maintenance or other related issues. <br> <br> Please check our <a href=\"https://twitter.com/HansardHuds\">Twitter Profile</a> for updates:")
                    }
                    
                    
                    maxDateAsDate = new Date(maxDate);

                    maxDateY = maxDateAsDate.getFullYear();

                    //TO DO - ERROR MSG

                    //TO DO - UPDATE MSG
                }
            },
            complete: (status)=>{

                maxDate = typeof(maxDate) == "undefined" ? "2021-02-25" : maxDate;
                minDate = "1803-01-01";

                $("#basic-dp-from").change(()=>{
                    let d = $("#basic-dp-from").val() + "-01-01";
                    $("#adv-dp-from").val(d);
                    updateDates();
                });
                
                $("#basic-dp-to").change(()=>{
                    let d = $("#basic-dp-to").val() + "-12-31";
                    $("#adv-dp-to").val(d);
                    updateDates();
                });
                
                $("#adv-dp-from").change(()=>{
                    let d = $("#adv-dp-from").val().substring(0,4);
                    $("#basic-dp-from").val(d);
                    updateDates();
                });
                
                $("#adv-dp-to").change(()=>{
                    let d = $("#adv-dp-to").val().substring(0,4);
                    $("#basic-dp-to").val(d);
                    updateDates();
                });
                
                $(".datepicker-from").datepicker({
                    format: "yyyy-mm-dd",
                    minDate: minDate,
                    maxDate: maxDate,
                    uiLibrary: "bootstrap4"
                });
                
                $(".datepicker-to").datepicker({
                    format: "yyyy-mm-dd",
                    minDate: minDate,
                    maxDate: maxDate,
                    uiLibrary: "bootstrap4"
                });
                
                preMaxDate = maxDate;

                $(".datepicker-from").val(preMinDate);
                $(".datepicker-to").val(preMaxDate);
                $("#basic-dp-from").val(preMinDate.substring(0,4));
                $("#basic-dp-to").val(preMaxDate.substring(0,4));

                updateDates();
                
            }
        }
    )
}

function checkParas(){
    let q = window.location.search;
    let p = new URLSearchParams(q);
    let id = p.get("q");
  
    if(id){
      $.ajax({
        url:"src/php/search_functions.php",
        type:"post",
        data: {
          action: "sharedLink",
          id: id
        },
        success: (data, status)=>{
          sharedQueryData = JSON.parse(data)[0];
  
          if(sharedQueryData){
            shared = true;
          }else{
            shared = false;
          }
  
        }
      })
    }
    //
  
    return generateId(10);
  }

function updateDates(){

    dateFrom = advanced_mode ? $("#adv-dp-from").val() : $("#basic-dp-from").val();

    let x = advanced_mode ? 10 : 4;

    if(dateFrom < minDate || dateFrom > maxDate){
      $(".validation-date-from").html("Please enter a date between " + minDate.substring(0,x) + " and " + maxDate.substring(0,x) + ".");
    }else{
      $(".validation-date-from").html("")
    }

    dateTo = advanced_mode ? $("#adv-dp-to").val() : $("#basic-dp-to").val();

    if(dateTo < minDate || dateTo > maxDate){
      $(".validation-date-to").html("Please enter a date between " + minDate.substring(0,x) + " and " + maxDate.substring(0,x) + ".");
    }else{
      $(".validation-date-to").html("")
    }
}

function generateId(length){
    let id = "";
    let characters = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789";
  
    for ( var i = 0; i < (length-1); i++ ) id += characters.charAt(Math.floor(Math.random() * characters.length));
  
    return id;
}

function accordion_control(target, refresh){
    //opens accordion section (shows if hidden)
    $(target).show();

    if(!refresh){
      $(target + " .accordion-button").trigger("click");
    }
    
}

function get_house(){
    let commons = ($('input[name="commons-check"]:checked').val() == STATE_ON);
    let lords = ($('input[name="lords-check"]:checked').val() == STATE_ON);

    selected_house = (commons == true) && (lords == true) ? HOUSE_BOTH : (commons == true ? HOUSE_COMMONS : HOUSE_LORDS);

    return selected_house;
}

function get_search_paras(){

    let house = get_house();

    return {
        term : $("#term").val(),
        searchId: searchId,
        sessionId: sessionId,
        colour: colours_queries[num_queries][0],
        description : advanced_mode ? $("#desc").val() : null,
        member : advanced_mode ? $("#"+house+"-member").val() : null
    };
}

function prepare_parameters(){

    parameters[num_queries] = get_search_paras();
    num_queries += 1;

    return parameters;

}

function get_distribution(){

    if(!isValidParameters(advanced_mode)){
      return;
    }

    let paras = prepare_parameters();

    update_para_tabs(paras)

    let action = advanced_mode ? "distribution-advanced" : "distribution";

    let flag_monthly_based = (dateTo.substring(0, 4) - dateFrom.substring(0, 4) <= 5);

    flag_normalised = true; 

    $.each(paras, (index, value)=> {
      //if a term is blank (member, debate title)
      if (value["term"] == "") {
        flag_normalised = false;
      }
    });

    console.log({
      action: action,
      dateTo: dateTo,
      dateFrom: dateFrom,
      house: get_house(),
      parameters: paras,
      flag_normalised: flag_normalised,
      flag_monthly_based: flag_monthly_based
  });

    distribution_ajax = $.ajax({
        url: "src/php/search_functions.php",
        type: "post",
        data: {
            action: action,
            dateTo: dateTo,
            dateFrom: dateFrom,
            house: get_house(),
            parameters: paras,
            flag_normalised: flag_normalised,
            flag_monthly_based: flag_monthly_based
        },
        beforeSend: () =>{

            $('.distribution .nvd3-svg').remove()

            accordion_control(".distribution");

            $('.distribution-loader').show();


        },
        complete: (data) =>{
            clear_forms();
        },
        success: (data, status) =>{
            if(data != null)
            {
                
                $('.distribution-loader').hide();

                data_json = JSON.parse(data);

                
                freq_line_data = data_json;

                load_distribution_graph(data_json);

            }
            
        },
        error: (xhr, desc, err)=>{

          if(err == "Gateway Time-out"){
            error_handler("Time-out error", "Your request to the server has timed out. Please note that this search tool is experimental and complex queries or larger date ranges might be prone to timeout. ")
          }else{
            error_handler("Distribution", "");
          }

          
        }

    });


}

function load_distribution_graph(d){

    let label_y = "Frequency (hits per million words)";
    let label_x = "Year";

    nv.addGraph(()=>{
        chart = nv.models.lineChart().options({
            transitionDuration: 2000,
            useInteractiveGuideline: true
        });
        chart.xAxis
            .axisLabel(label_x)
            .tickFormat(d3.format("d"))
            .staggerLabels(false);
        chart.yAxis
            .axisLabel(label_y)
            .tickFormat(d3.format(".2f"))
            .staggerLabels(false);
        chart.lines.dispatch.on("elementClick", (e)=>{
            if(range_of_dates_distrib.length == 0){

                range_of_dates_distrib.push(e[0].point.x);

                $("#distribution-body .nv-point.nv-point-" + e[0].pointIndex).addClass(
                    "selected"
                );
                
                update_timeline(range_of_dates_distrib);

            }else if(range_of_dates_distrib.length == 1){

                range_of_dates_distrib.push(e[0].point.x);

                $("#distribution-body .nv-point.nv-point-" + e[0].pointIndex).addClass(
                    "selected"
                );

                update_timeline(range_of_dates_distrib);

                contribution(range_of_dates_distrib, false);


            }else{
                reset_comparasion();

                range_of_dates_distrib.push(e[0].point.x);

                $("#distribution-body .nv-point.nv-point-" + e[0].pointIndex).addClass(
                    "selected"
                );
                
                update_timeline(range_of_dates_distrib);


            }
        });
        d3.select("#distribution-body")
            .append("svg")
            .datum(d)
            .call(chart);
        nv.utils.windowResize(chart.update);
        return chart;
    })

}

function contribution(dates, refresh){

    accordion_control(".contribution", refresh);

    $("#contrib-tabs").html("");
    $('.compare-results').hide();
    $('.results').hide();
    $("#comp-1, #comp-2, #comp-3, #comp-4 ").hide();
    
    $('.contribution-loader').show();

    if(num_queries == 1)
    {
      get_contribution();
    }else
    {

        for (let x = 0; x < num_queries; x++)
        {
            get_contribution_compare(dates, parameters[x], x);

            if(!refresh){

              let active = x == 0 ? " active " : "";

              $('#contrib-tabs').append('<li class="nav-item"><a id="tab'+(x+1)+'" class="nav-link '+active+'" onclick="toggle_text('+x+')">'+parameters[x].term+'  <span style="background-color: '+parameters[x].colour+';" class="dot"></span></a></li>');

            }


        }

        $("#comp-"+(selected_table+1)).show();
    }
}

function toggle_text(n){

  selected_table = n;

  $("#comp-1, #comp-2, #comp-3, #comp-4 ").hide();

  $(".nav-link").removeClass("active");

  $("#tab"+(n+1)).addClass("active");

  $("#comp-"+(n+1)).show();

}

function get_contribution_compare(dates, parameter, num){

    
    let action = advanced_mode ? "contribution-advanced" : "contribution";

    if(kwic_toggle){action+="-kwic";}

    let formatDate = advanced_mode ? "year" : "year";

    let func = func_[num];

    conf = getTableConfiguration(action, null);

    columns_conf = conf["columns_conf"];
    action_conf = conf["action"];
    sort_name = conf["sort_name"];

    $(func).bootstrapTable("removeAll");

    $(func)
      .bootstrapTable("destroy")
      .bootstrapTable({
        columns: columns_conf,
        formatLoadingMessage: ()=>{
          return "Loading, please wait ...";
        },
        sortName: sort_name,
        formatShowingRows: function(pageFrom, pageTo, totalRows){
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
          beforeSend: (jqXHR)=>{
              $.xhrPool.push(jqXHR);
          },
          complete: (jqXHR)=>{
              var index = $.inArray(jqXHR, $.xhrPool);

              if( index > -1){
                  $.xhrPool.splice(index, 1);
              }
          }
      },
      queryParams: (p)=>{
          return{
              limit: p.limit,
              offset: p.offset,
              sort: p.sort,
              order: p.order,
              parameters: parameter,
              action: action_conf,
              dateFrom:  dates[0],
              dateTo:  dates[1],
              house: selected_house,
              context: context,
              count: count_of_documents,
              formatDate: formatDate
          };
      },
      url: "src/php/search_functions.php",
      method: "get",
      onLoadSuccess: (data)=>{
        
        $('.contribution-loader').hide();

        
        $('.compare-results').show();

      },
      onLoadError: (xhr, desc, err)=>{
        error_handler("contribution-compare 1", "");
      },
      onClickCell: function(field, value, row, $element) {
        $("td").removeClass("text-info font-weight-bold");

        if(field != "date") $element.addClass("text-info font-weight-bold");

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
              parameter,
              ".text"
            );
            break;

          case "left_context":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameter,
              ".text"
            );
            break;

          case "right_context":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameter,
              ".text"
            );
            break;

          case "hit":
            showContribution(
              date,
              member,
              identif,
              row_house,
              parameter,
              ".text"
            );
            break;

          case "date":
            searchContributionDate(identif, date, member, $element);
            break;
        }
      }
    })

}

function update_tables(n, data){
    

}

function update_timeline(dates){

    let txt = "Selected Timeline : " + dates[0] + " - " + (dates.length > 1 ? dates[1] : " ") ;

    $('#timeline-selected').html(txt);

}

function update_para_tabs(paras){

    $("#tabs-terms").html("");
    $('.terms-list').html("");

    if(paras.length > 0){
        $('.terms-listed').addClass("hide")
    }else{
        
        $('.terms-listed').removeClass("hide")
    }


    for (let x = 0; x < num_queries; x++) {

        let txt = "<div class='tab-term' style='background-color:" + paras[x].colour + "'>"+paras[x].term+"</div>";
        $('#tabs-terms').append(txt);


        let txt2 = "<div class='term-clickable' id='"+x+"-term' style='color:" + paras[x].colour + ";'>"+paras[x].term+"  <i class='fas fa-minus'></i></div>";
        $('.terms-list').append(txt2);

    }
}

function reset_comparasion(){
    range_of_dates_distrib = [];
    $(".nv-point").removeClass("selected");
    $(
      "#distribution-body .timeline-one, #distribution-body .timeline-two"
    ).html("");
}

function clear_forms(){

    $('#term').val('')
    $('.member').val('')
    $('#desc').val('')

}

function reset_parameters(){

    clear_forms();

    set_max_min_dates();

    selected_table = 0;
    parameters = {};
    num_queries = 0;
    
    update_para_tabs([]);


    $('.distribution').hide();
    $('.contribution').hide();

    $('#contrib-tabs').html("");

    
    $('.distribution .nvd3-svg').remove()

}

function get_contribution(){

    //count_flag = c_flag;

    let action = advanced_mode ? "contribution-advanced" : "contribution";

    let formatDate = advanced_mode ? "year" : "year";

    if(kwic_toggle){action+="-kwic";}

    $("html, body").animate(
        {
          scrollTop: $("#results_table").offset().top
        },
        500
    );

    
    $("#results_table").bootstrapTable("removeAll");
    
    conf = getTableConfiguration(action, null);

    columns_conf = conf["columns_conf"];
    action_conf = conf["action"];
    sort_name = conf["sort_name"];

    $("#results_table")
        .bootstrapTable("destroy")
        .bootstrapTable({
            columns: columns_conf,
            formatLoadingMessage: ()=>{
                return "Loading, please wait ... ";
            },
            sortName: sort_name,
            formatShowingRows: function(pageFrom, pageTo, totalRows){
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
                beforeSend: (jqXHR)=>{
                    $.xhrPool.push(jqXHR);
                },
                complete: (jqXHR)=>{
                    var index = $.inArray(jqXHR, $.xhrPool);

                    if( index > -1){
                        $.xhrPool.splice(index, 1);
                    }
                }
            },
            queryParams: (p)=>{
                return{
                    limit: p.limit,
                    offset: p.offset,
                    sort: p.sort,
                    order: p.order,
                    parameters: parameters[0],
                    action: action_conf,
                    dateFrom:  range_of_dates_distrib[0],
                    dateTo:  range_of_dates_distrib[1],
                    house: selected_house,
                    context: context,
                    count: count_of_documents,
                    formatDate: formatDate
                };
            },
            url: "src/php/search_functions.php",
            method: "get",

            onLoadSuccess: (data)=>{
                func = "";

                $('.contribution-loader').hide();

                if ((data != null) & isJson('"' + data + '"')) {
        
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
                    error_handler("1 - contribution", "")
                }
                
                $('.results').show();
              },
              onLoadError: function(status) {
                $("#results_table")
                  .bootstrapTable("destroy")
                  .bootstrapTable({
                    formatNoMatches: function() {
                      return 'Unexpected error, please contact us <a target="_blank" href="index.php?show=feedback">here</a>.';
                    }
                  });

                  error_handler("2 - contribution", "")
              },
              onClickCell: function(field, value, row, $element) {
                $("td").removeClass("text-info font-weight-bold");
        
                if(field != "date") $element.addClass("text-info font-weight-bold");
        
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
                      ".text"
                    );
                    break;
        
                  case "left_context":
                    showContribution(
                      date,
                      member,
                      identif,
                      row_house,
                      parameters[0],
                      ".text"
                    );
                    break;
        
                  case "right_context":
                    showContribution(
                      date,
                      member,
                      identif,
                      row_house,
                      parameters[0],
                      ".text"
                    );
                    break;
        
                  case "hit":
                    showContribution(
                      date,
                      member,
                      identif,
                      row_house,
                      parameters[0],
                      ".text"
                    );
                    break;
        
                  case "date":
                    searchContributionDate(identif, date, member, $element);
                    break;
                }
              }
              
        })

    

}

function resetContribution() {
    $("#contribution_original").html();
}


function showContribution(
  date_table,
  member_table,
  id_table,
  house_table,
  query_table,
  func
) {
  resetContribution();

  $(" #contribution_original").html("");

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

      accordion_control(".text", false);

      
      $('.text-loader').show();

      contribution_ajax_complete = false;

      $(func).show();
    },

    complete: function() {
      contribution_ajax_complete = true;

      $('.text-loader').hide();

      $('#contribution_original').show();
    },

    success: function(data, status) {

      if ((data != null) & isJson(data)) {
        data_json = JSON.parse(data);
        $("#contribution_original").html(data_json.contributiontext);
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