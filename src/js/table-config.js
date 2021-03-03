function getTableConfiguration(action_var, parameters) {
  var action = action_var;

  if (action_var == "contribution" || action_var == "contribution-kwic") {
    if (search_rank) {
      if (action == "contribution") {
        if (selected_house == "both") {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "relevance",
              title: "Relevance",
              width: "8%",
              sortable: true
            },
            {
              field: "date",
              title: "Date",
              width: "10%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "15%",
              sortable: true
            },
            {
              field: "contribution",
              title: "Contribution",
              width: "40%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "15%",
              align: "center"
            },
            {
              field: "house",
              title: "House",
              width: "7%",
              align: "center"
            }
          ];
        } else {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "relevance",
              title: "Relevance",
              width: "8%",
              sortable: true
            },
            {
              field: "date",
              title: "Date",
              width: "10%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "15%",
              sortable: true
            },
            {
              field: "contribution",
              title: "Contribution",
              width: "52%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "15%",
              align: "center"
            }
          ];
        }
      } else if (action == "contribution-kwic") {
        if (selected_house == "both") {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "#document",
              title: "#",
              width: "4%",
              sortable: true
            },
            {
              field: "relevance",
              title: "Relevance",
              width: "8%",
              sortable: true
            },
            {
              field: "date",
              title: "Date",
              width: "7%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "12%",
              sortable: true
            },
            {
              field: "left_context",
              title: "Left Context",
              width: "20%",
              align: "center"
            },
            {
              field: "hit",
              title: "Hit",
              width: "8%",
              align: "center"
            },
            {
              field: "right_context",
              title: "Right Context",
              width: "20%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "14%",
              align: "center"
            },
            {
              field: "house",
              title: "House",
              width: "7%",
              align: "center"
            }
          ];
        } else {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "#document",
              title: "#",
              width: "4%",
              sortable: true
            },
            {
              field: "relevance",
              title: "Relevance",
              width: "8%",
              sortable: true
            },
            {
              field: "date",
              title: "Date",
              width: "7%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "12%",
              sortable: true
            },
            {
              field: "left_context",
              title: "Left Context",
              width: "21%",
              align: "center"
            },
            {
              field: "hit",
              title: "Hit",
              width: "13%",
              align: "center"
            },
            {
              field: "right_context",
              title: "Right Context",
              width: "21%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "14%",
              align: "center"
            }
          ];
        }
      }
      sort_name = "relevance";
    } else {
      if (action == "contribution") {
        if (selected_house == "both") {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "relevance",
              visible: false,
              switchable: false
            },
            {
              field: "date",
              title: "Date",
              width: "11%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "19%",
              sortable: true
            },
            {
              field: "contribution",
              title: "Contribution",
              width: "49%",
              align: "center"
            },
            {
              field: "description",
              title: "description",
              width: "14%",
              align: "center"
            },
            {
              field: "house",
              title: "House",
              width: "7%",
              align: "center"
            }
          ];
        } else {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "relevance",
              visible: false,
              switchable: false
            },
            {
              field: "date",
              title: "Date",
              width: "12%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "19%",
              sortable: true
            },
            {
              field: "contribution",
              title: "Contribution",
              width: "62%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "20%",
              align: "center"
            }
          ];
        }
      } else if (action == "contribution-kwic") {
        if (selected_house == "both") {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "#document",
              title: "#",
              width: "4%",
              sortable: true
            },
            {
              field: "relevance",
              visible: false,
              switchable: false
            },
            {
              field: "date",
              title: "Date",
              width: "7%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "11%",
              sortable: true
            },
            {
              field: "left_context",
              title: "Left Context",
              width: "20%",
              align: "center"
            },
            {
              field: "hit",
              title: "Hit",
              width: "9%",
              align: "center"
            },
            {
              field: "right_context",
              title: "Right Context",
              width: "20%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "14%",
              align: "center"
            },
            {
              field: "house",
              title: "House",
              width: "7%",
              align: "center"
            }
          ];
        } else {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "#document",
              title: "#",
              width: "4%",
              sortable: true
            },
            {
              field: "relevance",
              visible: false,
              switchable: false
            },
            {
              field: "date",
              title: "Date",
              width: "7%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "11%",
              sortable: true
            },
            {
              field: "left_context",
              title: "Left Context",
              width: "22%",
              align: "center"
            },
            {
              field: "hit",
              title: "Hit",
              width: "12%",
              align: "center"
            },
            {
              field: "right_context",
              title: "Right Context",
              width: "22%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "14%",
              align: "center"
            }
          ];
        }
      }
      sort_name = "date";
      action += "_nonRank";
    }

    object = new Array();
    object["sort_name"] = sort_name;
    object["action"] = action;
    object["columns_conf"] = columns_conf;
  } else if (action_var == "contribution-member") {
    if (selected_house == "both") {
      columns_conf = [
        {
          field: "state",
          checkbox: "true",
          align: "center"
        },
        {
          field: "document_id",
          visible: false,
          switchable: false
        },
        {
          field: "date",
          title: "Date",
          width: "10%",
          sortable: true
        },
        {
          field: "contribution",
          title: "Contribution",
          width: "65%",
          align: "center"
        },
        {
          field: "description",
          title: "Debate title",
          width: "15%",
          align: "center"
        },
        {
          field: "house",
          title: "House",
          width: "10%",
          align: "center"
        }
      ];
    } else {
      columns_conf = [
        {
          field: "state",
          checkbox: "true",
          align: "center"
        },
        {
          field: "document_id",
          visible: false,
          switchable: false
        },
        {
          field: "date",
          title: "Date",
          width: "10%",
          sortable: true
        },
        {
          field: "contribution",
          title: "Contribution",
          width: "75%",
          align: "center"
        },
        {
          field: "description",
          title: "Debate title",
          width: "15%",
          align: "center"
        }
      ];
    }

    object = new Array();
    object["sort_name"] = null;
    object["action"] = action;
    object["columns_conf"] = columns_conf;
  } else if (action == "description") {
    if (selected_house == "both") {
      columns_conf = [
        {
          field: "document_id",
          visible: false,
          switchable: false
        },
        {
          field: "date",
          title: "Date",
          width: "7%",
          sortable: true
        },
        {
          field: "member",
          title: "Member",
          width: "15%",
          sortable: true
        },
        {
          field: "description",
          title: "Debate title",
          width: "37%",
          align: "center"
        },
        {
          field: "contribution",
          title: "Contribution",
          width: "34%",
          align: "center"
        },
        {
          field: "house",
          title: "House",
          width: "7%",
          align: "center"
        }
      ];
    } else {
      columns_conf = [
        {
          field: "document_id",
          visible: false,
          switchable: false
        },
        {
          field: "date",
          title: "Date",
          width: "7%",
          sortable: true
        },
        {
          field: "member",
          title: "Member",
          width: "15%",
          sortable: true
        },
        {
          field: "description",
          title: "Debate title",
          width: "40%",
          align: "center"
        },
        {
          field: "contribution",
          title: "Contribution",
          width: "38%",
          align: "center"
        }
      ];
    }

    object = new Array();
    object["sort_name"] = "date";
    object["action"] = action;
    object["columns_conf"] = columns_conf;
  } else if (
    action_var == "contribution-advanced" ||
    action_var == "contribution-advanced-kwic"
  ) {
    sub_action = "";

    $.each(parameters, function(i, v) {
      if (v[0]) {
        if (sub_action == "") {
          sub_action += v[1];
        } else {
          sub_action += "-" + v[1];
        }
      }
    });

    if (search_rank) {
      if (action_var == "contribution-advanced") {
        if (selected_house == "both") {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "relevance",
              title: "Relevance",
              width: "8%",
              sortable: true
            },
            {
              field: "date",
              title: "Date",
              width: "11%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "11%",
              sortable: true
            },
            {
              field: "contribution",
              title: "Contribution",
              width: "43%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "20%",
              align: "center"
            },
            {
              field: "house",
              title: "House",
              width: "7%",
              align: "center"
            }
          ];
        } else {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "relevance",
              title: "Relevance",
              width: "8%",
              sortable: true
            },
            {
              field: "date",
              title: "Date",
              width: "11%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "11%",
              sortable: true
            },
            {
              field: "contribution",
              title: "Contribution",
              width: "46%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "24%",
              align: "center"
            }
          ];
        }
      } else if (action_var == "contribution-advanced-kwic") {
        if (selected_house == "both") {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "#document",
              title: "#",
              width: "4%",
              sortable: true
            },
            {
              field: "relevance",
              title: "Relevance",
              width: "8%",
              sortable: true
            },
            {
              field: "date",
              title: "Date",
              width: "11%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "11%",
              sortable: true
            },
            {
              field: "left_context",
              title: "Left Context",
              width: "17%",
              align: "center"
            },
            {
              field: "hit",
              title: "Hit",
              width: "9%",
              align: "center"
            },
            {
              field: "right_context",
              title: "Right Context",
              width: "17%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "16%",
              align: "center"
            },
            {
              field: "house",
              title: "House",
              width: "7%",
              align: "center"
            }
          ];
        } else {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "#document",
              title: "#",
              width: "4%",
              sortable: true
            },
            {
              field: "relevance",
              title: "Relevance",
              width: "8%",
              sortable: true
            },
            {
              field: "date",
              title: "Date",
              width: "11%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "12%",
              sortable: true
            },
            {
              field: "left_context",
              title: "Left Context",
              width: "19%",
              align: "center"
            },
            {
              field: "hit",
              title: "Hit",
              width: "9%",
              align: "center"
            },
            {
              field: "right_context",
              title: "Right Context",
              width: "19%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "18%",
              align: "center"
            }
          ];
        }
      }

      sort_name = "relevance";
    } else {
      if (action_var == "contribution-advanced") {
        if (selected_house == "both") {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "relevance",
              visible: false,
              switchable: false
            },
            {
              field: "date",
              title: "Date",
              width: "11%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "16%",
              sortable: true
            },
            {
              field: "contribution",
              title: "Contribution",
              width: "45%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "21%",
              align: "center"
            },
            {
              field: "house",
              title: "House",
              width: "7%",
              align: "center"
            }
          ];
        } else {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "relevance",
              visible: false,
              switchable: false
            },
            {
              field: "date",
              title: "Date",
              width: "11%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "16%",
              sortable: true
            },
            {
              field: "contribution",
              title: "Contribution",
              width: "49%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "24%",
              align: "center"
            }
          ];
        }
      } else if (action_var == "contribution-advanced-kwic") {
        if (selected_house == "both") {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "#document",
              title: "#",
              width: "4%",
              sortable: true
            },
            {
              field: "relevance",
              visible: false,
              switchable: false
            },
            {
              field: "date",
              title: "Date",
              width: "11%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "14%",
              sortable: true
            },
            {
              field: "left_context",
              title: "Left Context",
              width: "19%",
              align: "center"
            },
            {
              field: "hit",
              title: "Hit",
              width: "9%",
              align: "center"
            },
            {
              field: "right_context",
              title: "Right Context",
              width: "19%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "17%",
              align: "center"
            },
            {
              field: "house",
              title: "House",
              width: "7%",
              align: "center"
            }
          ];
        } else {
          columns_conf = [
            {
              field: "state",
              checkbox: "true",
              align: "center"
            },
            {
              field: "document_id",
              visible: false,
              switchable: false
            },
            {
              field: "relevance",
              visible: false,
              switchable: false
            },
            {
              field: "#document",
              title: "#",
              width: "4%",
              sortable: true
            },
            {
              field: "date",
              title: "Date",
              width: "11%",
              sortable: true
            },
            {
              field: "member",
              title: "Member",
              width: "16%",
              sortable: true
            },
            {
              field: "left_context",
              title: "Left Context",
              width: "19%",
              align: "center"
            },
            {
              field: "hit",
              title: "Hit",
              width: "9%",
              align: "center"
            },
            {
              field: "right_context",
              title: "Right Context",
              width: "19%",
              align: "center"
            },
            {
              field: "description",
              title: "Debate title",
              width: "22%",
              align: "center"
            }
          ];
        }
      }

      sort_name = "date";
      action += "_nonRank";
    }

    object = new Array();
    object["sort_name"] = sort_name;
    object["action"] = action;
    object["columns_conf"] = columns_conf;
  }

  return object;
}
