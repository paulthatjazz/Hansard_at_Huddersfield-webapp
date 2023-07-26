
var wc_ajax = null;
var bubble_ajax = null;
var wc_filter = new Object();
var data_j = [];

var min_1500 = window.matchMedia("(min-width: 1500px)");
var min_1200 = window.matchMedia("(min-width: 1200px)");
var min_992 = window.matchMedia("(min-width: 992px)");
var min_768 = window.matchMedia("(min-width: 768px)");
var min_576 = window.matchMedia("(min-width: 576px)");
var max_768 = window.matchMedia("(max-width: 768px)");

var parameter_bubble = new Object();

var parameter_dis_kw = new Object();
var num_queries_dis_kw = 0;

var parameter_dis_wc = new Object();
var num_queries_dis_wc = 0;

var selection_list;

var admin_focus = false;
var admin_target = false;

var tag_wc = []

const stopwords_list = [
    "_NUM_",
    "§",
    "#",
    "|",
    "hon",
    "mr",
    "sect",
    "x2014",
    "government",
    "right",
    "house",
    "member",
    "gentleman",
    "bill",
    "friend",
    "minister",
    "members",
    "question",
    "secretary",
    "committee",
    "x00a3",
    "0",
    "sir",
    "amendment",
    "lord",
    "clause",
    "prime",
    "parliament",
    "noble",
    "office",
    "speaker",
    "proposed",
    "learned",
    "chancellor",
    "motion",
    "beg",
    "majesty",
    "exchequer",
    "000l",
    "chief",
    "gentlemen",
    "ministry",
    "commissioners",
    "baronet",
    "honourable",
    "ministers",
    "department",
    "colonel",
    "constituency",
    "gent",
    "amendments",
    "lords",
    "attorney",
    "paper",
    "lieutenant",
    "x0021",
    "lieut",
    "mrs",
    "bishops",
    "duke",
    "bills",
    "bishop",
    "commons",
    "marquis",
    "x2013",
    "x00e9",
    "buonapart",
    "clarke",
    "moved",
    "wellesley",
    "highness",
    "melville",
    "castlereagh",
    "oliver",
    "wellington",
    "rose",
    "lordships",
    "earl",
    "act",
    "baroness",
    "debate",
    "viscount",
    "marquess",
    "lady",
    "peers",
    "royal",
    "king",
    "queen",
    "pergami",
    "bergami",
    "brougham",
    "gordon",
    "reverend",
    "governor",
    "russell",
    "lordship",
    "chamber",
    "kimberley",
    "baron",
    "acts",
    "edmunds",
    "normanby",
    "canning",
    "moore",
    "john",
    "eldon",
    "grenville",
    "hawkesbury",
    "gambier",
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
    "hon:",
    "mr:",
    "sect:",
    "hon",
    "mr",
    "sect",
    "hon.",
    "mr.",
    "sect.",
    "x2014",
    "government",
    "right",
    "house",
    "member",
    "gentleman",
    "bill",
    "friend",
    "minister",
    "members",
    "question",
    "secretary",
    "committee",
    "sir",
    "amendment",
    "lord",
    "clause",
    "prime",
    "parliament",
    "noble",
    "office",
    "speaker",
    "proposed",
    "learned",
    "chancellor",
    "motion",
    "beg",
    "majesty",
    "exchequer",
    "chief",
    "gentlemen",
    "ministry",
    "commissioners",
    "baronet",
    "honourable",
    "ministers",
    "department",
    "colonel",
    "constituency",
    "gent",
    "amendments",
    "lords",
    "attorney",
    "paper",
    "lieutenant",
    "lieut",
    "mrs",
    "bishops",
    "duke",
    "bills",
    "bishop",
    "commons",
    "marquis",
    "x2013",
    "x00e9",
    "buonapart",
    "clarke",
    "moved",
    "wellesley",
    "highness",
    "melville",
    "castlereagh",
    "oliver",
    "wellington",
    "rose",
    "lordships",
    "earl",
    "act",
    "baroness",
    "debate",
    "viscount",
    "marquess",
    "lady",
    "peers",
    "royal",
    "king",
    "queen",
    "pergami",
    "bergami",
    "brougham",
    "gordon",
    "reverend",
    "governor",
    "russell",
    "lordship",
    "chamber",
    "kimberley",
    "baron",
    "acts",
    "edmunds",
    "normanby",
    "canning",
    "moore",
    "john",
    "eldon",
    "grenville",
    "hawkesbury",
    "gambier",
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
    "hon:",
    "mr:",
    "sect:",
    "hon",
    "mr",
    "sect",
    "hon.",
    "mr.",
    "sect.",
    "x2014",
    "government",
    "right",
    "house",
    "member",
    "gentleman",
    "bill",
    "friend",
    "minister",
    "members",
    "question",
    "secretary",
    "committee",
    "sir",
    "amendment",
    "lord",
    "clause",
    "prime",
    "parliament",
    "noble",
    "office",
    "speaker",
    "proposed",
    "learned",
    "chancellor",
    "motion",
    "beg",
    "majesty",
    "exchequer",
    "chief",
    "gentlemen",
    "ministry",
    "commissioners",
    "baronet",
    "honourable",
    "ministers",
    "department",
    "colonel",
    "constituency",
    "gent",
    "amendments",
    "lords",
    "attorney",
    "paper",
    "lieutenant",
    "lieut",
    "mrs",
    "bishops",
    "duke",
    "bills",
    "bishop",
    "commons",
    "marquis",
    "x2013",
    "x00e9",
    "buonapart",
    "clarke",
    "moved",
    "wellesley",
    "highness",
    "melville",
    "castlereagh",
    "oliver",
    "wellington",
    "rose",
    "lordships",
    "earl",
    "act",
    "baroness",
    "debate",
    "viscount",
    "marquess",
    "lady",
    "peers",
    "royal",
    "king",
    "queen",
    "pergami",
    "bergami",
    "brougham",
    "gordon",
    "reverend",
    "governor",
    "russell",
    "lordship",
    "chamber",
    "kimberley",
    "baron",
    "acts",
    "edmunds",
    "normanby",
    "canning",
    "moore",
    "john",
    "eldon",
    "grenville",
    "hawkesbury",
    "gambier",
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "rt",
    "ought",
    "should",
    "would",
    "could",
    "may",
    "might",
    "shall",
    "will"
  ];


update_periods();

$('.corpus-col i').click(()=>{
    x = parameter_bubble['comp'];
    y = parameter_bubble['target'];

    parameter_bubble['comp'] = y;
    parameter_bubble['target'] = x;
    
    update_dropdown("focus-dropdown", selection_list, parameter_bubble['comp'], parameter_bubble['target']);

    update_dropdown("target-dropdown", selection_list, parameter_bubble['target'], parameter_bubble['comp']);

    generate_bubble();

})

$('#focus-admin').click(() => {
    admin_focus = !admin_focus;

    $('.focus-dropdown .term-pm').toggle();
    $('.focus-dropdown .session-pm').toggle();
})

$('#target-admin').click(() => {
    admin_target = !admin_target;

    $('.target-dropdown .term-pm').toggle();
    $('.target-dropdown .session-pm').toggle();
})


$("#wc-dp-from").change(()=>{
    update_distribution_dates($("#wc-dp-from").val(), $("#wc-dp-to").val());

    generate_wc();
});

$("#wc-dp-to").change(()=>{
    update_distribution_dates($("#wc-dp-from").val(), $("#wc-dp-to").val());

    
    generate_wc();

});


$('input[name="lords-check-f"]').change(()=>generate_bubble())
$('input[name="lords-check-t"]').change(()=>generate_bubble())
$('input[name="commons-check-f"]').change(()=>generate_bubble())
$('input[name="commons-check-t"]').change(()=>generate_bubble())


$('input[name="commons-check-wc"]').change(()=>updateHouseWC())
$('input[name="lords-check-wc"]').change(()=>updateHouseWC())

$('#dlimage-btn-kw').click(()=>{
    saveSvgAsPng($(".kw-chart svg")[0], "bubble_chart.png", {
        backgroundColor: "white"
    });
});

$('#dlimage-btn-wc').click(()=>{
    saveSvgAsPng($("#wc-full svg")[0], "word_cloud.png", {
        backgroundColor: "white"
    });
});

$('#refresh-wc').click(()=>{
    parameter_dis_wc = new Object();
    num_queries_dis_wc = 0;
    
    update_para_tabs_wc(parameter_dis_wc);

    generate_wc()
});

$('#search-btn-kw').click(()=>distributionBubble());

$('#search-btn-wc').click(()=>distributionWc());

function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function deepCopyWordCloud(oldValue) {
    var newValue;
    strValue = JSON.stringify(oldValue);
    return (newValue = JSON.parse(strValue));
  }

function alreadyContains_wc(word){
    for (let x = 0; x < num_queries_dis_wc; x++) {
        if(parameter_dis_wc[x].term == word){
            return x;
        }
    }
    return false;
}

function update_para_tabs_wc(paras){

    $('.wc_paras_tl').html("");

    if(num_queries_dis_wc == 0){
        $('.wc_paras').addClass("hide")
    }else{
        $('.wc_paras').removeClass("hide")
    }


    for (let x = 0; x < num_queries_dis_wc; x++) {

        let txt2 = "<div class='term-clickable' id='"+x+"-term-wc' style='color:" + paras[x].colour + ";'></i>"+paras[x].query+"<i class='fas fa-minus' onclick='remove_term_wc("+ x +")'> </div>";
        $('.wc_paras_tl').append(txt2);

    }
}

function remove_term_wc(ac){

    
    tag_wc[ac].style("fill", "#6699CC")

    delete parameter_dis_wc[ac];

    var i = 0;
    var paras_temp = [];
  
    for (let x = 0; x < num_queries_dis_wc; x++) {
  
      if(parameter_dis_wc[x] == undefined){
        x++;
      }
  
      (x == num_queries_dis_wc) ? null :  paras_temp[i] = parameter_dis_wc[x];
      
      i++;
    }
  
    num_queries_dis_wc--;
  
    parameter_dis_wc = paras_temp;
    
    update_para_tabs_wc(parameter_dis_wc);

}

function add_keyword_para_wc(d, tag){


    let ac = alreadyContains_wc(d.text);

    let ret = true;

    if(ac !== false){  

        tag_wc[ac].style("fill", "#6699CC");


        delete parameter_dis_wc[ac];

        var i = 0;
        var paras_temp = [];
      
        for (let x = 0; x < num_queries_dis_wc; x++) {
      
          if(parameter_dis_wc[x] == undefined){
            x++;
          }
      
          (x == num_queries_dis_wc) ? null :  paras_temp[i] = parameter_dis_wc[x];
          
          i++;
        }
      
        num_queries_dis_wc--;
      
        parameter_dis_wc = paras_temp;

        ret = false;

    }else{
        if(num_queries_dis_wc < 4){
            parameter_dis_wc[num_queries_dis_wc] = {
                term: d.text,
                searchId: searchId,
                sessionId: sessionId,
                query: d.text,
                colour: colours_queries[num_queries_dis_wc][0]
            }
            tag_wc[num_queries_dis_wc] = tag;
            num_queries_dis_wc++;


        }else{

            ret = false;
            //TO DO ERROR MESSAGE
            alert("4 WC SELECTED");


        }
    }

    update_para_tabs_wc(parameter_dis_wc);

    return ret;
   
}

function get_house_wc(){
    let commons = ($('input[name="commons-check-wc"]:checked').val() == STATE_ON);
    let lords = ($('input[name="lords-check-wc"]:checked').val() == STATE_ON);

    selected_house = (commons == true) && (lords == true) ? HOUSE_BOTH : (commons == true ? HOUSE_COMMONS : HOUSE_LORDS);

    return selected_house;
}

function update_distribution_house(){
    switch (selected_house) {
        case "commons":
            $('input[name="commons-check"]').prop('checked', true)
            $('input[name="lords-check"]').prop('checked', false)
            break;
        case "lords":
            $('input[name="commons-check"]').prop('checked', false)
            $('input[name="lords-check"]').prop('checked', true)
            break;
        case "both":
            $('input[name="commons-check"]').prop('checked', true)
            $('input[name="lords-check"]').prop('checked', true)
            break;
        default:
            break;
    }
}

function update_distribution_dates(from, to){

    dateTo = to;
    dateFrom = from;

    if(from.length == 4){
        if(advanced_mode) $('#advancedOptionCheck').trigger('click');

    }else{
        if(!advanced_mode) $('#advancedOptionCheck').trigger('click');

    }

    $("#adv-dp-from").val(from + "-01-01");
    $("#adv-dp-to").val(to + "-12-31");

    $("#basic-dp-from").val(from.slice(0,4));
    $("#basic-dp-to").val(to.slice(0,4));

    $("#wc-dp-from").val(from.slice(0,4));
    $("#wc-dp-to").val(to.slice(0,4));

}

function updateHouseWC(){
    selected_house = get_house_wc();

    update_distribution_house();

    generate_wc();
}

function generate_wc(){
    if(wc_ajax != null){
        wc_ajax.abort();
    }

    wc_filter = {
        year: [dateFrom.substring(0,4), dateTo.substring(0,4)]
    };

    wc_ajax = $.ajax({
        url: "src/php/explore_functions.php",
        type: "post",
        data: {
            action: "wordcloud",
            house: selected_house,
            params: wc_filter
        },
        beforeSend: ()=>{
            $("#wc-preview").hide();
            $(".wc-loader").show();
        },
        success: (data, status)=>{
            if(data){
                try{
                    words_aux = JSON.parse(data);

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
                    
                    targets = ["#wc-preview", "#wc-full"]

                    targets.forEach(target => {

                        
                        $(target).html("");

                        var cloud = d3
                            .wordcloud(target)
                            .size(sizes)
                            .fill(
                                d3.scale
                                    .ordinal()
                                    .range([
                                        "#6699CC",
                                        "#89CFF0",
                                        "#72A0C1",
                                        "#318CE7"
                                    ])

                            )
                            .onwordclick((d, i, text_tag)=>{
                                if(target == targets[1]){
                                    if(add_keyword_para_wc(d, text_tag)){
                                        text_tag.style("fill", "red");
                                    }else{
                                        text_tag.style("fill", "#6699CC")
                                    }
                                }
                            })
                            .words(
                                deepCopyWordCloud(words_aux).filter( (d, i) =>{
                                    return d;
                                })
                            )
                            .start();

                    
                    });

                        
                    $(".wc-loader").hide();
                    $("#wc-preview").show();

                } catch (e){
                    error_handler("1 - wordcloud", "");
                }

            }
        }
    })
}

function update_dropdown(target, selections, current, other) {
    ht = "";

    for (let x = 0; x < selections.length; x++) {

        if(selections[x]["type"] == "PM_TERM"){
            //disable selected corpus
            (current == selections[x]["id"] || other == selections[x]["id"]) ? c = "  disabled" : c = "";

            let title = selections[x]['name'] + " (" + selections[x]['dateFrom'].slice(2,4) + "-" + selections[x]['dateTo'].slice(2,4) + ")"

            ht += '<li><a onclick="dropdown_change(this, \'' + target + '\' )" c_id="' + selections[x]["id"] + '" class="term-pm ' + selections[x]["desc"] + ' dropdown-item'+ c + '">' + title + '</a></li>';
        }

        
    }

    for (let x = 0; x < selections.length; x++) {

        if(selections[x]["type"] == "PM_SESSION"){
            //disable selected corpus
            (current == selections[x]["id"] || other == selections[x]["id"]) ? c = "  disabled" : c = "";
            
            let title = selections[x]['name'] + " (" + selections[x]['dateFrom'].slice(2,4) + "-" + selections[x]['dateTo'].slice(2,4) + ")"

            ht += '<li><a onclick="dropdown_change(this, \'' + target + '\' )" c_id="' + selections[x]["id"] + '" class="session-pm ' + selections[x]["desc"] + ' dropdown-item'+ c + '">' + title + '</a></li>';
        }
    }

    $("."+target).html(ht);

    $(".btn-"+target).html(selections[current]['name']);

}

function dropdown_change(dropdown, target){

    id = $(dropdown).attr("c_id")

    if(target == "focus-dropdown"){
        parameter_bubble['comp'] = parseInt(id);
    }else{
        parameter_bubble['target'] = parseInt(id);
    }

    update_dropdown("focus-dropdown", selection_list, parameter_bubble['comp'], parameter_bubble['target']);

    update_dropdown("target-dropdown", selection_list, parameter_bubble['target'], parameter_bubble['comp']);

    generate_bubble();

}

function update_periods(){
    $.ajax({
        url: "src/php/explore_functions.php",
        type: "get",
        data: {
            action: "periods",
            house: "commons"
        },
        success: (data)=>{
            let r = JSON.parse(data);

            if(r === null){
                console.log("KEYWORDS UNAVAILABLE")
                $('#keywords').hide();
                return;
            }
            //update drop downs with periods

            //set parameters to first 2 periods
            parameter_bubble['comp'] = r[0].id;
            
            parameter_bubble['target'] = r[1].id;

            selection_list = r;

            
            update_dropdown("focus-dropdown", r, 0, 1);

            update_dropdown("target-dropdown", r, 1, 0);

            if(admin_focus){
                $('.focus-dropdown .term-pm').hide();
                $('.focus-dropdown .session-pm').show();
            }else{
                $('.focus-dropdown .term-pm').show();
                $('.focus-dropdown .session-pm').hide();
            }
        
            if(admin_target){
                $('.target-dropdown .term-pm').hide();
                $('.target-dropdown .session-pm').show();
            }else{
                $('.target-dropdown .term-pm').show();
                $('.target-dropdown .session-pm').hide();
            }


            //run bubble for preview
            generate_bubble();
        }
    })
}

function distributionWc(){
    
    parameters = parameter_dis_wc;
    num_queries = num_queries_dis_wc;

    move_to_distribution($("#wc-dp-from").val(), $("#wc-dp-to").val())


}

function move_to_distribution(from, to){

    update_distribution_dates(from, to);

    get_distribution(true);

    console.log("Moving to Distribution")

    $('#lg-preview').trigger('click');

    $('#headingTwo button').removeClass('collapsed');

    setTimeout(() => $('.sb-accordion h2 button').trigger('click'), 450);
}

function distributionBubble(){

    parameters = parameter_dis_kw;
    num_queries = num_queries_dis_kw;

    selection_list.forEach(element => {
        if(element['id'] == parameter_bubble['target']){

            selected_house = parameter_bubble['target_house']

            update_distribution_house();

            move_to_distribution(element['dateFrom'].slice(0,4), element['dateTo'].slice(0,4));
        }
    });

    

}

function alreadyContains(word){
    for (let x = 0; x < num_queries_dis_kw; x++) {
        if(parameter_dis_kw[x].term == word){
            return x;
        }
    }
    return false;
}

function update_para_tabs_kw(paras){

    $('.kw_paras_tl').html("");

    if(num_queries_dis_kw == 0){
        $('.kw_paras').addClass("hide")
    }else{
        $('.kw_paras').removeClass("hide")
    }


    for (let x = 0; x < num_queries_dis_kw; x++) {

        let txt2 = "<div class='term-clickable' id='"+x+"-term-kw' style='color:" + paras[x].colour + ";'></i>"+paras[x].query+" <i class='fas fa-minus' onclick='remove_term_kw("+ x +")'></div>";
        $('.kw_paras_tl').append(txt2);

    }
}

function remove_term_kw(ac){
    
    delete parameter_dis_kw[ac];

    var i = 0;
    var paras_temp = [];
  
    for (let x = 0; x < num_queries_dis_kw; x++) {
  
      if(parameter_dis_kw[x] == undefined){
        x++;
      }
  
      (x == num_queries_dis_kw) ? null :  paras_temp[i] = parameter_dis_kw[x];
      
      i++;
    }
  
    num_queries_dis_kw--;
  

    parameter_dis_kw = paras_temp;
    
    update_para_tabs_kw(parameter_dis_kw);
}

function add_keyword_para(d, colour){

    let ac = alreadyContains(d.word);

    if(ac !== false){  

        delete parameter_dis_kw[ac];

        var i = 0;
        var paras_temp = [];
      
        for (let x = 0; x < num_queries_dis_kw; x++) {
      
          if(parameter_dis_kw[x] == undefined){
            x++;
          }
      
          (x == num_queries_dis_kw) ? null :  paras_temp[i] = parameter_dis_kw[x];
          
          i++;
        }
      
        num_queries_dis_kw--;
      
        parameter_dis_kw = paras_temp;

    }else{
        if(num_queries_dis_kw < 4){
            parameter_dis_kw[num_queries_dis_kw] = {
                term: d.word,
                searchId: searchId,
                sessionId: sessionId,
                query: d.word,
                colour: colour
            }
            num_queries_dis_kw++;


        }else{
            //TO DO ERROR MESSAGE
            alert("4 KW SELECTED");
        }
    }

    update_para_tabs_kw(parameter_dis_kw);
   
}

function get_house_kw(target){
    if(target == "comp"){
        let commons = ($('input[name="commons-check-f"]:checked').val() == STATE_ON);
        let lords = ($('input[name="lords-check-f"]:checked').val() == STATE_ON);
    
        selected_house = (commons == true) && (lords == true) ? HOUSE_BOTH : (commons == true ? HOUSE_COMMONS : HOUSE_LORDS);
    
        return selected_house;
    }else{
        let commons = ($('input[name="commons-check-t"]:checked').val() == STATE_ON);
        let lords = ($('input[name="lords-check-t"]:checked').val() == STATE_ON);
    
        selected_house = (commons == true) && (lords == true) ? HOUSE_BOTH : (commons == true ? HOUSE_COMMONS : HOUSE_LORDS);
    
        return selected_house;
    }
}

function generate_bubble(){

    parameter_dis_kw = new Object();
    num_queries_dis_kw = 0;

    update_para_tabs_kw(parameter_dis_kw);

    parameter_bubble["comp_house"] = get_house_kw("comp");
    parameter_bubble["target_house"] = get_house_kw("target");


    if(bubble_ajax != null){
        bubble_ajax.abort();
    }

    bubble_ajax = $.ajax({
        url: "src/php/explore_functions.php",
        type: "get",
        data: {
            action: "bubble_new",
            params: parameter_bubble,
            house: "commons"
        },
        success: (data, status)=>{

            targets = [".kw-chart", "#kw-preview"];

            if(data){
                
                data_j = { "children" : remove_stoplist(JSON.parse(data)).slice(0, 40)}

                targets.forEach((target)=>{

                    $(target).html("");
                    offset = convertRemToPixels(6);

                    if(target == targets[1]){
                        
                        sizes = [400, 400];
                    }else{

                        if (min_1500.matches) {
                            sizes = [950 - offset, 500];
                        } else if (min_1200.matches) {
                            sizes = [718 - offset, 500];
                        } else if (min_992.matches) {
                            sizes = [540 - offset, 450];
                        } else if (min_768.matches) {
                            sizes = [718 - offset, 250];
                        } else if (min_576.matches) {
                            sizes = [526 - offset, 250];
                        } else {
                            sizes = [250, 250];
                        }
                    }

           

                    var color = d3version4.scaleOrdinal(d3version4.schemeCategory20);
            
                    var bubble = d3version4.pack(data_j)
                        .size(sizes)
                        .padding(1.5);
            
                    var svg = d3version4.select(target)
                        .append("svg")
                        .attr("width", sizes[0])
                        .attr("height", sizes[1])
                        .attr("class", "bubble")
            
                    var nodes = d3version4.hierarchy(data_j)
                        .sum(function(d) { 
                            return (d.score - .9) * 100; 
                        });
            
                    var node = svg.selectAll(".node")
                        .data(bubble(nodes).descendants())
                        .enter()
                        .filter(function(d){
                            return  !d.children
                        })
                        .append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        })
                        .on("click", (d, i)=>{
                            if(target == ".kw-chart") {
                                add_keyword_para(d.data, color(i));
                            }
                        })
            
                    node.append("title")
                        .text(function(d) {
                            return d.word;
                        });
            
                    node.append("circle")
                        .attr("r", function(d) {
                            return d.r;
                        })
                        .style("fill", function(d,i) {
                            return color(i);
                        });
            
                    node.append("text")
                        .attr("dy", ".2em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return d.data.word.substring(0, d.r / 3);
                        })
                        .attr("font-family", "sans-serif")
                        .attr("font-size", function(d){
                            return d.r/3;
                        })
                        .attr("fill", "white");
            
                    d3version4.select(self.frameElement)
                        .style("height", sizes[0] + "px");

                });
        

                

                

            }

        }
    })


}

function remove_stoplist(data){

    data.forEach((e, index, object)=>{
        stopwords_list.includes(e) ? object.splice(index, 1) : null ;
    })

    return data;

}