
var wc_ajax = null;
var wc_filter = new Object();

var min_1500 = window.matchMedia("(min-width: 1500px)");
var min_1200 = window.matchMedia("(min-width: 1200px)");
var min_992 = window.matchMedia("(min-width: 992px)");
var min_768 = window.matchMedia("(min-width: 768px)");
var min_576 = window.matchMedia("(min-width: 576px)");
var max_768 = window.matchMedia("(max-width: 768px)");

function preview_wc(){

}


function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function deepCopyWordCloud(oldValue) {
    var newValue;
    strValue = JSON.stringify(oldValue);
    return (newValue = JSON.parse(strValue));
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