function bubble(path, term) {
  $("#bubble svg").html("");
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

  $("#bubble svg").attr("width", sizes[0]);
  $("#bubble svg").attr("height", sizes[1]);

  var svg = d3version4.select("#bubble svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var format = d3version4.format(",d");

  var color = d3version4.scaleOrdinal(d3version4.schemeCategory20c);
  var stopwords_list = [
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

  var pack = d3version4
    .pack()
    .size([width, height])
    .padding(1.5);
  var counter = 0;

  d3version4.csv(
    path,
    function(d) {
      d.value = +d.value;
      if (counter < 26) {
        if (
          d.value &&
          d.id != term &&
          !stopwords_list.includes(d.id) != "" &&
          d.id.indexOf("<") == -1 &&
          d.id.indexOf(">") == -1 &&
          d.id.indexOf(">") &&
          d.id.replace(/[^0-9]/g, "").length < 5 &&
          d.id.replace(/[^A-Za-z]/g, "").length > 1
        ) {
          d.id = d.id.replace("â", "");
          counter++;
          return d;
        }
      }
    },
    function(error, classes) {
      if (error) throw error;

      var root = d3version4
        .hierarchy({ children: classes })
        .sum(function(d) {
          return d.value;
        })
        .each(function(d) {
          if ((id = d.data.id)) {
            var id,
              i = id.lastIndexOf(".");
            d.id = id;
            d.package = id.slice(0, i);
            d.class = id.slice(i + 1);
          }
        });

      var node = svg
        .selectAll(".node")
        .data(pack(root).leaves())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      node
        .append("circle")
        .attr("id", function(d) {
          return d.id;
        })
        .attr("r", function(d) {
          return d.r;
        })
        .style("fill", function(d) {
          return color(d.package);
        });

      node
        .append("clipPath")
        .attr("id", function(d) {
          return "clip-" + d.id;
        })
        .append("use")
        .attr("xlink:href", function(d) {
          return "#" + d.id;
        });

      node
        .append("text")
        .attr("clip-path", function(d) {
          return "url(#clip-" + d.id + ")";
        })
        .selectAll("tspan")
        .data(function(d) {
          return d.class.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter()
        .append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i, nodes) {
          return 13 + (i - nodes.length / 2 - 0.5) * 10;
        })
        .text(function(d) {
          return d;
        });

      node.append("title").text(function(d) {
        //return d.id + "\n" + format(d.value);
        return d.id;
      });

      node.on("click", function(d) {
        bubleClick($(this), d.id);
      });
    }
  );
}

function bubleClick(elem, word) {
  if (num_queries < 4) {
    var flag_repeated = false;
    var selected_colour;

    for (var i = 0; i < num_queries; i++) {
      if (parameter_bubble[i]["query"] == word) {
        flag_repeated = true;
      }
    }

    if (!flag_repeated) {
      if (num_queries == 0) {
        $(".explore .bubble .terms-list").show();
        $(".explore .bubble .reset-terms").show();
        $(".explore .bubble .submit").show();
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

      elem.attr("fill", "#faed27");
      elem.attr("font-weight", "bold");
      elem
        .children("circle")
        .attr("stroke", "#faed27")
        .attr("stroke-width", "2px");

      bubble_original_objects[num_queries] = {};
      bubble_original_objects[num_queries]["object"] = elem;
      //bubble_original_objects[num_queries]["original_colour"] = text_tag.style(
      //  "fill"
      // );

      parameter_bubble[num_queries] = {};
      parameter_bubble[num_queries]["colour"] = selected_colour;
      parameter_bubble[num_queries]["query"] = word;
      parameter_bubble[num_queries]["term"] = word;

      $(".explore .bubble .terms-list > div").append(
        "<div class='bubble-term'><span class='word' style='color:" +
          selected_colour +
          "' query='" +
          word +
          "'>" +
          word +
          "</span> <span class='badge badge-danger delete-term' title='Delete term'><i class='fas fa-minus'></i></span></div>"
      );
      //text_tag.style("fill", selected_colour);

      num_queries++;
    }
  } else {
    $("#warningModalMaxTerms").modal("show");
  }
}
