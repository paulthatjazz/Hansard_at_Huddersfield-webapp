
var advanced_mode = false;

var preMinDate = '2000-01-01';
var preMaxDate = '2022-01-01';

var minDate;
var maxDate;

var dateFrom;
var dateTo;

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

var range_of_dates_distrib = [];

$('#advancedOptionCheck').click(() => {
    advanced_mode = !advanced_mode;

    $('.adv-date').toggleClass('active');
    $('.basic-date').toggleClass('active');

    updateDates();

    $('.advanced-options').toggle(200);
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

init();

function init(){
    set_max_min_dates();
    update_autofill();
    updateDates();
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
                    maxDate = JSON.parse(data)[0]["upperdate"];
                    
                    maxDateAsDate = new Date(maxDate);

                    maxDateY = maxDateAsDate.getFullYear();

                    //TO DO - ERROR MSG

                    //TO DO - UPDATE MSG
                }
            },
            complete: (status)=>{

                maxDate = typeof(maxDate) == "undefined" ? "2021-02-25" : maxDate;

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
    dateTo = advanced_mode ? $("#adv-dp-to").val() : $("#basic-dp-to").val();
}

function generateId(length){
    let id = "";
    let characters = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789";
  
    for ( var i = 0; i < (length-1); i++ ) id += characters.charAt(Math.floor(Math.random() * characters.length));
  
    return id;
}

function accordion_control(target){
    //opens accordion section (shows if hidden)
    $(target).show();
    $(target + " .accordion-button").trigger("click");
}

function get_house(){
    let commons = ($('input[name="commons-check"]:checked').val() == STATE_ON);
    let lords = ($('input[name="lords-check"]:checked').val() == STATE_ON);

    return (commons == true) && (lords == true) ? HOUSE_BOTH : (commons == true ? HOUSE_COMMONS : HOUSE_LORDS);
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

    let paras = prepare_parameters();

    update_para_tabs(paras)

    let action = advanced_mode ? "distribution-advanced" : "distribution";

    let flag_monthly_based = (dateTo.substring(0, 4) - dateFrom.substring(0, 4) <= 5);

    let flag_normalised = true; // if terms are blank

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

                load_distribution_graph(data_json);

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

                get_contribution(range_of_dates_distrib);


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

function get_contribution(dates){

    accordion_control(".contribution");

    
    $('.contribution-loader').show();

}

function update_timeline(dates){

    let txt = "Selected Timeline : " + dates[0] + " - " + (dates.length > 1 ? dates[1] : " ") ;

    $('#timeline-selected').html(txt);

}

function update_para_tabs(paras){

    $("#tabs-terms").html("");

    for (let x = 0; x < num_queries; x++) {

        let txt = "<div class='tab-term' style='background-color:" + paras[x].colour + "'>"+paras[x].term+"</div>";
        $('#tabs-terms').append(txt)
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

    parameters = {};
    num_queries = 0;
    
    update_para_tabs([]);


    $('.distribution').hide();

    
    $('.distribution .nvd3-svg').remove()

}