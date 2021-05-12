<?php

session_start();

include_once './db/query_handler.php';
include_once './db/search.php';
include_once 'convert_data.php';

header('Content-Type: text/html;charset=utf-8');

if (!array_key_exists('id', $_REQUEST)) $id = 1;
else $id = $_REQUEST['id'];

array_map('unlink', glob("../../tmp/" . session_id() . "*"));

if (isset($_POST['house'])) {
  $house = strtolower($_POST['house']);
} else if (isset($_GET['house'])) {
  $house = strtolower($_GET['house']);
}

if (!isset($_SESSION['PID'])) {
  $_SESSION["PID"] =  query_handler::gettingPID("dbname=hansard");
} else {
  $_SESSION["previous_PID"] = $_SESSION["PID"];
  $_SESSION["PID"] =  query_handler::gettingPID("dbname=hansard");
}

session_write_close();

if (isset($_GET['action'])) {

  if (($_GET['action'] == "contribution") || ($_GET['action'] == "contribution-kwic" || $_GET['action'] == "contribution_nonRank") || ($_GET['action'] == "contribution-kwic_nonRank")) {

    if ($_GET['sort'] == "date") {
      $sort = "sittingday";
    } else {
      $sort = $_GET['sort'];
    }

    if ($_GET['formatDate'] == "year") {
      $dateFrom = $_GET['dateFrom'] . "-01-01";
      $dateTo = $_GET['dateTo'] . "-12-31";
    } else {
      $dateFrom = $_GET['dateFrom'];
      $dateTo = $_GET['dateTo'];
    }

    $rows = search::contribution($dateFrom, $dateTo, $_GET['parameters']['term'], $house, $_GET['action'], $_GET['count'], $_GET['offset'], $sort, $_GET['order'], $_GET['limit'], $_GET['context']);

    $var2 = json_encode($rows);
    echo $var2;

  } else if ($_GET['action'] == "contribution-advanced") {

    if ($_GET['kwic'] == "true") {
      $flag_kwic = TRUE;
    } else {
      $flag_kwic = FALSE;
    }

    if ($_GET['rank'] == "true") {
      $sql_rank = "ts_rank(idxfti_simple, q1) AS relevance,";
    } else {
      $sql_rank = "";
    }

    if ($_GET['sort'] == "date") {
      $sort = "sittingday";
    } else {
      $sort = $_GET['sort'];
    }

    if (strlen($_GET['dateFrom']) == 7) {
      $dateFrom = $_GET['dateFrom'] . "-01";
    } else {
      $dateFrom = $_GET['dateFrom'] . "-01-01";
    }

    if (strlen($_GET['dateTo']) == 7) {

      $month = substr($_GET['dateTo'], 5, 2);

      if ($month == "02") {
        $dateTo = $_GET['dateTo'] . "-28";
      } else if ($month == "01" || $month == "03" || $month == "05" || $month == "07" || $month == "08" || $month == "10" ||  $month == "12") {
        $dateTo = $_GET['dateTo'] . "-31";
      } else {
        $dateTo = $_GET['dateTo'] . "-30";
      }
    } else {
      $dateTo = $_GET['dateTo'] . "-12-31";
    }

    $value = $_GET['parameters'];

    if (isset($value['description']) && $value['description'] != "" && $value['description'] != " ") {
      $description = $value['description'];

      $cleaned_description = convert_data::clean_query($value['description']);
      $ts_description = convert_data::gen_postgresql_query($cleaned_description);
    } else {
      $description = FALSE;
    }

    if (isset($value['member']) && $value['member'] != "" && $value['member'] != " ") {
      $member = $value['member'];

      $cleaned_member = convert_data::clean_query($value['member']);
      $ts_member = convert_data::gen_postgresql_query($cleaned_member);

      if ($cleaned_member == "Speaker") {
        $cleaned_member = " ilike '%speaker%'";
      } else {
        $cleaned_member = " = '" . $cleaned_member . "'";
      }
    } else {
      $member = FALSE;
    }

    if ($value['term'] != "" && $value['term'] != "" && $value['term'] != " ") {
      $term = $value['term'];

      $cleaned_term = convert_data::clean_query($value['term']);
      $num_terms = sizeof(explode(" ", $cleaned_term));
      $ts_term = convert_data::gen_postgresql_query($cleaned_term);
    } else {
      $term = FALSE;
    }

    if ($flag_kwic) {
      $contributiontext = "ts_headline('simple',contributiontext,q1, 'StartSel=<b>, StopSel=</b>, HighlightAll=TRUE') as contributiontext";
    } else {
      $contributiontext = "contributiontext";
    }


    if ($term && $member && $description) {

      if ($house != "both") {

        if ($_GET['count'] == 0 && $_GET['offset'] == 0) {
          $total[] = array("count" => "total");
        } else if ($_GET['count'] == 0 && $_GET['offset'] != 0) {
          $total[] = array("count" => $_GET['count']);
        } else {

          $sql =
            "SELECT count(*)"
            . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1 "
            . "WHERE "
            . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and idxfti_simple @@ q1 "
            . "and description ilike '%" . $cleaned_description . "%' "
            . "and member " . $cleaned_member . " ";

          $total = query_handler::query_no_parameters($sql, "dbname=hansard");
        }

        $sql =
          "SELECT id, sittingday, " . $contributiontext . ", member, href as url, " . $sql_rank . " description "
          . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1 "
          . "WHERE "
          . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
          . "and idxfti_simple @@ q1 "
          . "and description ilike '%" . $cleaned_description . "%' "
          . "and member " . $cleaned_member . " "
          . "ORDER BY " . $sort . " " . $_GET['order'] . " "
          . "LIMIT " . $_GET['limit'] . " "
          . "OFFSET " . $_GET['offset'];
      } else {
      }

      $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

      if ($flag_kwic) {
        $var = convert_data::gen_json_kwic_desc($rows, $cleaned_term, $cleaned_description, $total, $_GET['offset'], $_GET['context']);
      } else {
        $var = convert_data::gen_json_documents_desc($rows, $cleaned_term, $cleaned_description, $total);
      }
    } else if ($term && $member) {

      if ($house != "both") {
        if ($_GET['count'] == 0 && $_GET['offset'] == 0) {
          $total[] = array("count" => "total");
        } else if ($_GET['count'] == 0 && $_GET['offset'] != 0) {
          $total[] = array("count" => $_GET['count']);
        } else {

          $sql =
            "SELECT count(*)"
            . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1 "
            . "WHERE "
            . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and idxfti_simple @@ q1 "
            . "and member  " . $cleaned_member . " ";

          $total = query_handler::query_no_parameters($sql, "dbname=hansard");
        }

        $sql =
          "SELECT id, sittingday, " . $contributiontext . ", member, href as url, " . $sql_rank . " description "
          . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1 "
          . "WHERE "
          . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
          . "and idxfti_simple @@ q1 "
          . "and member  " . $cleaned_member . " "
          . "ORDER BY " . $sort . " " . $_GET['order'] . " "
          . "LIMIT " . $_GET['limit'] . " "
          . "OFFSET " . $_GET['offset'];
      } else {
      }
      $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

      if ($flag_kwic) {
        $var = convert_data::gen_json_kwic($rows, $cleaned_term, $total, $_GET['offset'], $_GET['context']);
      } else {
        $var = convert_data::gen_json_documents($rows, $cleaned_term, $total);
      }
    } else if ($term && $description) {

      if ($house != "both") {
        if ($_GET['count'] == 0 && $_GET['offset'] == 0) {
          $total[] = array("count" => "total");
        } else if ($_GET['count'] == 0 && $_GET['offset'] != 0) {
          $total[] = array("count" => $_GET['count']);
        } else {

          $sql =
            "SELECT count(*)"
            . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1 "
            . "WHERE "
            . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and idxfti_simple @@ q1 "
            . "and description ilike '%" . $cleaned_description . "%' ";

          $total = query_handler::query_no_parameters($sql, "dbname=hansard");
        }


        $sql =
          "SELECT id, sittingday, " . $contributiontext . ", member, href as url, " . $sql_rank . " description "
          . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1 "
          . "WHERE "
          . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
          . "and idxfti_simple @@ q1 "
          . "and description ilike '%" . $cleaned_description . "%' "
          . "ORDER BY " . $sort . " " . $_GET['order'] . " "
          . "LIMIT " . $_GET['limit'] . " "
          . "OFFSET " . $_GET['offset'];


        $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

        if ($flag_kwic) {
          $var = convert_data::gen_json_kwic_desc($rows, $cleaned_term, $cleaned_description, $total, $_GET['offset'], $_GET['context']);
        } else {
          $var = convert_data::gen_json_documents_desc($rows, $cleaned_term, $cleaned_description, $total);
        }
      } else {
      }

      $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

      if ($_GET['action'] == "contribution-advanced_nonRank") {
        $var = convert_data::gen_json_documents_desc($rows, $cleaned_term, $cleaned_description, $total);
      } else if ($_GET['action'] == "contribution-advanced-kwic_nonRank") {
        $var = convert_data::gen_json_kwic_desc($rows, $cleaned_term, $cleaned_description, $total, $_GET['offset'], $_GET['context']);
      }
    } else if ($member && $description) {

      if ($house != "both") {
        if ($_GET['count'] == 0 && $_GET['offset'] == 0) {
          $total[] = array("count" => "total");
        } else if ($_GET['count'] == 0 && $_GET['offset'] != 0) {
          $total[] = array("count" => $_GET['count']);
        } else {

          $sql =
            "SELECT count(*)"
            . "FROM hansard_" . $house . "." . $house . " "
            . "WHERE "
            . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and description ilike '%" . $cleaned_description . "%' "
            . "and member  " . $cleaned_member . " ";

          $total = query_handler::query_no_parameters($sql, "dbname=hansard");
        }

        $sql =
          "SELECT id, sittingday, contributiontext, member, href as url, description "
          . "FROM hansard_" . $house . "." . $house . " "
          . "WHERE "
          . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
          . "and description ilike '%" . $cleaned_description . "%' "
          . "and member  " . $cleaned_member . " "
          . "ORDER BY " . $sort . " " . $_GET['order'] . " "
          . "LIMIT " . $_GET['limit'] . " "
          . "OFFSET " . $_GET['offset'];

        $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

        $var = convert_data::gen_json_documents_desc_member($rows, $cleaned_description, $total);
      } else {
      }

      $rows = query_handler::query_no_parameters($sql, "dbname=hansard");
      $var = convert_data::gen_json_documents_desc_member($rows, $cleaned_description, $total);
    } else if ($member) {

      if ($house != "both") {
        if ($_GET['count'] == 0 && $_GET['offset'] == 0) {
          $total[] = array("count" => "total");
        } else if ($_GET['count'] == 0 && $_GET['offset'] != 0) {
          $total[] = array("count" => $_GET['count']);
        } else {

          $sql =
            "SELECT COUNT(*) FROM hansard_" . $house . "." . $house . " "
            . "WHERE "
            . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and member " . $cleaned_member . "";

          $total = query_handler::query_no_parameters($sql, "dbname=hansard");
        }

        $sql =
          "SELECT id, sittingday, contributiontext, member, href as url, description "
          . " FROM hansard_" . $house . "." . $house . " "
          . "WHERE "
          . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
          . "and member " . $cleaned_member . " "
          . "ORDER BY " . $sort . " " . $_GET['order'] . " LIMIT " . $_GET['limit'] . " OFFSET " . $_GET['offset'];

        $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

        $var = convert_data::gen_json_concordance_member($rows, $total);
      } else {
      }

      $rows = query_handler::query_no_parameters($sql, "dbname=hansard");
      $var = convert_data::gen_json_concordance_member($rows, $total);
    } else if ($description) {

      if ($house != "both") {

        if ($_GET['count'] == 0 && $_GET['offset'] == 0) {
          $total[] = array("count" => "total");
        } else if ($_GET['count'] == 0 && $_GET['offset'] != 0) {
          $total[] = array("count" => $_GET['count']);
        } else {

          $sql =
            "SELECT count(*)"
            . "FROM hansard_" . $house . "." . $house . " "
            . "WHERE "
            . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE  "
            . "and description ilike '%" . $cleaned_description . "%'";


          $total = query_handler::query_no_parameters($sql, "dbname=hansard");
        }

        $sql =
          "SELECT id, sittingday, description, member, href as url, contributiontext "
          . "FROM hansard_" . $house . "." . $house . " "
          . "WHERE "
          . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
          . "and description  ilike '%" . $cleaned_description . "%' "
          . "ORDER BY " . $sort . " " . $_GET['order'] . " "
          . "LIMIT " . $_GET['limit'] . " OFFSET " . $_GET['offset'];

        $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

        $var = convert_data::gen_json_description($rows, $description, $total, $_GET['offset']);
      } else {
      }

      $rows = query_handler::query_no_parameters($sql, "dbname=hansard");
      $var = convert_data::gen_json_description($rows, $cleaned_description, $total, $_GET['offset']);
    } else if ($term) {

      if ($house != "both") {

        if ($_GET['count'] == 0 && $_GET['offset'] == 0) {
          $total[] = array("count" => "total");
        } else if ($_GET['count'] == 0 && $_GET['offset'] != 0) {
          $total[] = array("count" => $_GET['count']);
        } else {

          $sql =
            "SELECT count(*)"
            . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q "
            . "WHERE "
            . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and idxfti_simple @@ q ";

          $total = query_handler::query_no_parameters($sql, "dbname=hansard");
        }

        $sql =
          "SELECT id, sittingday, " . $contributiontext . ", member, href as url, " . $sql_rank . " description "
          . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1 "
          . "WHERE "
          . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
          . "and idxfti_simple @@ q1 "
          . "ORDER BY " . $sort . " " . $_GET['order'] . " "
          . "LIMIT " . $_GET['limit'] . " "
          . "OFFSET " . $_GET['offset'];
      } else {
      }

      $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

      if ($flag_kwic) {
        $var = convert_data::gen_json_kwic($rows, $cleaned_term, $total, $_GET['offset'], $_GET['context']);
      } else {
        $var = convert_data::gen_json_documents($rows, $cleaned_term, $total);
      }
    }

    $var2 = json_encode($var, JSON_UNESCAPED_UNICODE);
    echo $var2;
  }
} else if ($_POST['action'] == "contribution-expand") {

  if ($house != "both") {
    $sql = "SELECT id, sittingday, contributiontext, member, href as url FROM hansard_" . $house . "." . $house . " WHERE id='" . $_POST['id'] . "'";
  } else {
  }

  $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

  $var = convert_data::format_contributionOne($rows, $_POST['query']);

  $var2 = json_encode($var);

  echo $var2;
} else if ($_POST['action'] == "contribution-KW") {

  $exec = shell_exec("python3 ../python3/kw.py " . session_id() . "");

  if ($exec != null) {
    echo $exec;
  } else {
    echo false;
  }
} else if ($_POST['action'] == "related-terms") {

  $exec = shell_exec("python3 ../python3/syn.py " . $_POST['query'] . "");

  if ($exec != null) {
    echo $exec;
  } else {
    echo false;
  }

  echo null;
} else if ($_POST['action'] == "member_info") {

  $_POST['id'];
  $_POST['date'];
  $_POST['member'];

  $var2 = json_encode(array('id' => $_POST['id'], 'date' => $_POST['date'], 'member' => $_POST['member']));
  echo $var2;
} else if ($_POST['action'] == "distribution") {

  $rows = search::distribution($_POST['parameters'], $house, $_POST['dateFrom'], $_POST['dateTo']);

  /*

  $i = 0;
  foreach ($_POST['parameters'] as &$value) {

    $cleaned_term = strtolower(convert_data::clean_query($value["term"]));
    $num_terms = sizeof(explode(" ", $cleaned_term));

    if ($num_terms == 1 && strpos($cleaned_term, ".") == FALSE) {

      if (strpos($cleaned_term, "*") == FALSE) {

        if ($house != "both") {

          $sql =
            "select frequency, x.myear, total from (" .
            "select sum(hits) as frequency, year as myear  " .
            "from hansard_" . $house . "_single_word_year " .
            "where word like '" . $cleaned_term . "' " .
            "AND year BETWEEN '" . $_POST['dateFrom'] . "' AND '" . $_POST['dateTo'] . "'" .
            "group by year " .
            "order by year ) x " .
            "JOIN (select year as myear, total from hansard_" . $house . "_total_word_year) as y ON y.myear = x.myear " .
            "order by x.myear asc";
        } else {
        }
      } else {

        if ($house != "both") {

          $cleaned_term = str_replace("*", "%", $cleaned_term);

          $sql =
            "select frequency, x.myear, total from (" .
            "select sum(hits) as frequency, year as myear " .
            "from hansard_" . $house . "_single_word_year " .
            "where word like '" . $cleaned_term . "' " .
            "AND year BETWEEN '" . $_POST['dateFrom'] . "' AND '" . $_POST['dateTo'] . "' " .
            "group by year " .
            "order by year ) x " .
            "JOIN (select year as myear, total from hansard_" . $house . "_total_word_year) as y ON y.myear = x.myear " .
            "order by x.myear asc";
        } else {
        }
      }
    } else {

      $minWords = 1;
      $maxWords = $num_terms;

      //Using this method there is no difference between using wildcards or not 
      $ts_term = convert_data::gen_postgresql_query($cleaned_term);

      if ($house != "both") {

        $sql =
          "select frequency, myear, total from " .
          "(select myear, SUM(hits) as frequency FROM " .
          "( " .
          "select subq.myear, ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits " .
          "from ( " .
          "SELECT substring(sittingday::text,0,5) as myear, ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . $maxWords . ", MinWords=" . $minWords . ", ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline " .
          "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q " .
          "WHERE sittingday BETWEEN '" . $_POST['dateFrom'] . "-01-01'::DATE AND '" . $_POST['dateTo'] . "-12-31'::DATE " .
          "and idxfti_simple @@ q " .
          ") as subq " .
          ")  x " .
          "group by myear " .
          ") z " .
          "JOIN (select year, total from hansard_" . $house . "_total_word_year) as y ON y.year = z.myear " .
          "order by myear asc";
      } else {
      }
    }

    $rows[$i] = query_handler::query_no_parameters($sql, "dbname=hansard");
    $i++;
  }
  */

  if ($house == "both") {

    $sql_extra =
      "SELECT sum(total) as total, year " .
      "FROM " .
      "( " .
      "select total, year from hansard_commons_total_word_year where year BETWEEN '" . $_POST['dateFrom'] . "' AND '" . $_POST['dateTo'] . "' " .
      "UNION ALL " .
      "select total, year from hansard_lords_total_word_year where year BETWEEN '" . $_POST['dateFrom'] . "' AND '" . $_POST['dateTo'] . "' " .
      ") " .
      "x " .
      "group by year ORDER BY year";

    $total_both = query_handler::query_no_parameters($sql_extra, "dbname=hansard");
  } else {
    $total_both = "";
  }


  $var = convert_data::gen_json_line($rows, $total_both, $_POST['parameters'], $_POST['dateFrom'], $_POST['dateTo']);

  $var2 = json_encode($var);

  echo $var2;

} else if ($_POST['action'] == "distribution-advanced") {

  $i = 0;
  foreach ($_POST['parameters'] as &$value) {

    $dateFrom = $_POST['dateFrom'];
    $dateTo = $_POST['dateTo'];

    if ($_POST['flag_monthly_based'] == "true") {
      $groupDate = 8;
      $total_word_db = "total_word_month_year";
      $single_word_db = "single_word_month_year";
    } else {
      $groupDate = 5;
      $total_word_db = "total_word_year";
      $single_word_db = "single_word_year";
    }

    if (isset($value['description'])) {
      $description = $value['description'];

      $cleaned_description = convert_data::clean_query($value['description']);
      $ts_description = convert_data::gen_postgresql_query($cleaned_description);
    } else {
      $description = FALSE;
    }

    if (isset($value['member'])) {
      $member = $value['member'];

      $cleaned_member = convert_data::clean_query($value['member']);
      $ts_member = convert_data::gen_postgresql_query($cleaned_member);

      if ($cleaned_member == "Speaker") {
        $cleaned_member = " ilike '%speaker%'";
      } else {
        $cleaned_member = " = '" . $cleaned_member . "'";
      }
    } else {
      $member = FALSE;
    }

    if ($value['term'] != "") {
      $term = $value['term'];
      $cleaned_term = strtolower(convert_data::clean_query($value['term']));
      $num_terms = sizeof(explode(" ", $cleaned_term));
      $ts_term = convert_data::gen_postgresql_query($cleaned_term);
      $cleaned_term_2 = str_replace("*", "%", $cleaned_term);

      if ($num_terms == 1) {
        $minWords = 1;
        $maxWords = 2;
      } else {
        $minWords = 1;
        $maxWords = $num_terms;
      }
    } else {
      $term = FALSE;
    }

    if ($_POST['flag_normalised'] == "true") {

      $norm_flag = TRUE;

      if ($term && $member && $description) {

        if ($house != "both") {
          $sql =
            "select frequency, z.year, total from " .
            "(select year, SUM(hits) as frequency FROM " .
            "( " .
            "select subq.year, ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits " .
            "from ( " .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . ($num_terms + 1) . ", MinWords=1, ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline " .
            "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q " .
            "WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE " .
            "and description ilike '%" . $cleaned_description . "%' " .
            "and member " . $cleaned_member . " " .
            "and idxfti_simple @@ q " .
            ") as subq " .
            ")  x " .
            "group by year " .
            ") z " .
            "JOIN (select year, total from hansard_" . $house . "_" . $total_word_db . ") as y ON y.year = z.year " .
            "order by year asc";
        } else {
        }
      } else if ($term && $member) {
        if ($house != "both") {
          $sql =
            "select frequency, z.year, total from " .
            "(select year, SUM(hits) as frequency FROM " .
            "( " .
            "select subq.year, ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits " .
            "from ( " .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . ($num_terms + 1) . ", MinWords=1, ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline " .
            "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q " .
            "WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE " .
            "and member " . $cleaned_member . " " .
            "and idxfti_simple @@ q " .
            ") as subq " .
            ")  x " .
            "group by year " .
            ") z " .
            "JOIN (select year, total from hansard_" . $house . "_" . $total_word_db . ") as y ON y.year = z.year " .
            "order by year asc";
        } else {
        }
      } else if ($term && $description) {
        if ($house != "both") {

          $sql =
            "select frequency, z.year, total from " .
            "(select year, SUM(hits) as frequency FROM " .
            "( " .
            "select subq.year, ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits " .
            "from ( " .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . ($num_terms + 1) . ", MinWords=1, ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline " .
            "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q " .
            "WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE " .
            "and description ilike '%" . $cleaned_description . "%' " .
            "and idxfti_simple @@ q " .
            ") as subq " .
            ")  x " .
            "group by year " .
            ") z " .
            "JOIN (select year, total from hansard_" . $house . "_" . $total_word_db . ") as y ON y.year = z.year " .
            "order by year asc";
        } else {
        }
      } else if ($term) {

        if ($house != "both") {

          if ($num_terms == 1) {

            $offset_day_from = sprintf('%02d', (int) substr($dateFrom, 8, 10));
            $offset_month_from = sprintf('%02d', (int) substr($dateFrom, 5, 7));
            $offset_year_from = (int) substr($dateFrom, 0, 4);

            $offset_day_to = sprintf('%02d', (int) substr($dateTo, 8, 10));
            $offset_month_to = sprintf('%02d', (int) substr($dateTo, 5, 7));
            $offset_year_to = (int) substr($dateTo, 0, 4);


            if ($_POST['flag_monthly_based'] == "true") {
              $inter_dateFrom = ($offset_year_from + 1) . "-01";
              $inter_dateTo = ($offset_year_to - 1) . "-12";
            } else {
              $inter_dateFrom = ($offset_year_from + 1);
              $inter_dateTo = ($offset_year_to - 1);
            }




            $sql =

              "(" .
              "select frequency, z.year, total from " .
              "(select year, SUM(hits) as frequency FROM " .
              "( " .
              "select subq.year, ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits " .
              "from ( " .
              "SELECT substring(sittingday::text,0," . $groupDate . ") as year, ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . ($num_terms + 1) . ", MinWords=1, ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline " .
              "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q " .
              "WHERE sittingday BETWEEN '" . $offset_year_from . "-" . $offset_month_from . "-" . $offset_day_from . "'::DATE AND '" . $offset_year_from . "-12-31'::DATE " .
              "and idxfti_simple @@ q " .
              ") as subq " .
              ")  x " .
              "group by year " .
              ") z " .
              "JOIN (select year, total from hansard_" . $house . "_" . $total_word_db . ") as y ON y.year = z.year " .
              ") " .
              " UNION " .
              "(" .
              "select frequency, x.year, total from (" .
              "select sum(hits) as frequency, year " .
              "from hansard_" . $house . "_" . $single_word_db . " " .
              "where word like '" . $cleaned_term_2 . "' " .
              "AND year BETWEEN '" . $inter_dateFrom . "' AND '" . $inter_dateTo . "'" .
              "group by year " .
              " ) x " .
              "JOIN (select year, total from hansard_" . $house . "_" . $total_word_db . ") as y ON y.year = x.year" .
              ") " .
              " UNION " .
              "(" .
              "select frequency, z.year, total from " .
              "(select year, SUM(hits) as frequency FROM " .
              "( " .
              "select subq.year, ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits " .
              "from ( " .
              "SELECT substring(sittingday::text,0," . $groupDate . ") as year, ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . ($num_terms + 1) . ", MinWords=1, ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline " .
              "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q " .
              "WHERE sittingday BETWEEN '" . $offset_year_to . "-01-01'::DATE AND '" . $offset_year_to . "-" . $offset_month_to . "-" . $offset_day_to . "'::DATE " .
              "and idxfti_simple @@ q " .
              ") as subq " .
              ")  x " .
              "group by year " .
              ") z " .
              "JOIN (select year, total from hansard_" . $house . "_" . $total_word_db . ") as y ON y.year = z.year " .
              ") " .
              "order by year asc";
          } else {

            $sql =
              "select frequency, z.year, total from " .
              "(select year, SUM(hits) as frequency FROM " .
              "( " .
              "select subq.year, ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits " .
              "from ( " .
              "SELECT substring(sittingday::text,0," . $groupDate . ") as year, ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . ($num_terms + 1) . ", MinWords=1, ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline " .
              "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q " .
              "WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE " .
              "and idxfti_simple @@ q " .
              ") as subq " .
              ")  x " .
              "group by year " .
              ") z " .
              "JOIN (select year, total from hansard_" . $house . "_" . $total_word_db . ") as y ON y.year = z.year " .
              "order by year asc";
          }
        } else {
        }
      }
    } else {

      $norm_flag = FALSE;

      if ($term && $member && $description) {

        if ($house != "both") {


          $sql =
            "select year, sum(total) as total, sum (frequency) as frequency FROM(	" .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, COUNT(*) as frequency, 0 as total " .
            "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1	" .
            "WHERE " .
            "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE	" .
            "and description ilike '%" . $cleaned_description . "%' " .
            "and member " . $cleaned_member . " " .
            "and idxfti_simple @@ q1 " .
            "group by year	" .
            "UNION ALL	" .
            "select year, 0 as frequency, total from hansard_" . $house . "_total_contributions_year WHERE year BETWEEN substring('" . $dateFrom . "'::text,0,5) AND substring('" . $dateTo . "'::text,0,5)	" .
            ") x 	" .
            "group by year	" .
            "order by year";
        } else {
        }
      } else if ($term && $member) {
        if ($house != "both") {
          $sql =
            "select year, sum(total) as total, sum (frequency) as frequency FROM(	" .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, COUNT(*) as frequency, 0 as total " .
            "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1	" .
            "WHERE " .
            "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE	" .
            "and member " . $cleaned_member . " " .
            "and idxfti_simple @@ q1 " .
            "group by year	" .
            "UNION ALL	" .
            "select year, 0 as frequency, total from hansard_" . $house . "_total_contributions_year WHERE year BETWEEN substring('" . $dateFrom . "'::text,0,5) AND substring('" . $dateTo . "'::text,0,5)	" .
            ") x 	" .
            "group by year	" .
            "order by year";
        } else {
        }
      } else if ($term && $description) {
        if ($house != "both") {
          $sql =
            "select year, sum(total) as total, sum (frequency) as frequency FROM(	" .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, COUNT(*) as frequency, 0 as total " .
            "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1	" .
            "WHERE " .
            "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE	" .
            "and description ilike '%" . $cleaned_description . "%' " .
            "and idxfti_simple @@ q1 " .
            "group by year	" .
            "UNION ALL	" .
            "select year, 0 as frequency, total from hansard_" . $house . "_total_contributions_year WHERE year BETWEEN substring('" . $dateFrom . "'::text,0,5) AND substring('" . $dateTo . "'::text,0,5)	" .
            ") x 	" .
            "group by year	" .
            "order by year";
        } else {
        }
      } else if ($member && $description) {
        if ($house != "both") {
          $sql =
            "select year, sum(total) as total, sum (frequency) as frequency FROM(	" .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, COUNT(*) as frequency, 0 as total FROM hansard_" . $house . "." . $house . "	" .
            "WHERE " .
            "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE	" .
            "and member " . $cleaned_member . "	" .
            "group by year, description, member	" .
            "UNION ALL	" .
            "select year, 0 as frequency, total from hansard_" . $house . "_total_contributions_year WHERE year BETWEEN substring('" . $dateFrom . "'::text,0,5) AND substring('" . $dateTo . "'::text,0,5)	" .
            ") x 	" .
            "group by year	" .
            "order by year";
        } else {
        }
      } else if ($member) {

        if ($house != "both") {

          $sql =
            "select year, sum(total) as total, sum (frequency) as frequency FROM(	" .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, COUNT(*) as frequency, 0 as total FROM hansard_" . $house . "." . $house . "	" .
            "WHERE " .
            "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE	" .
            "and member " . $cleaned_member . "	" .
            "and description ilike '%" . $cleaned_description . "%' " .
            "group by year, member	" .
            "UNION ALL	" .
            "select year, 0 as frequency, total from hansard_" . $house . "_total_contributions_year WHERE year BETWEEN substring('" . $dateFrom . "'::text,0,5) AND substring('" . $dateTo . "'::text,0,5)	" .
            ") x 	" .
            "group by year	" .
            "order by year";
        } else {
        }
      } else if ($description) {

        if ($house != "both") {

          $sql =
            "select year, sum(total) as total, sum (frequency) as frequency FROM(	" .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, COUNT(*) as frequency, 0 as total FROM hansard_" . $house . "." . $house . "	" .
            "WHERE " .
            "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE	" .
            "and description ilike '%" . $cleaned_description . "%' " .
            "group by year, description	" .
            "UNION ALL	" .
            "select year, 0 as frequency, total from hansard_" . $house . "_total_contributions_year WHERE year BETWEEN substring('" . $dateFrom . "'::text,0,5) AND substring('" . $dateTo . "'::text,0,5)	" .
            ") x 	" .
            "group by year	" .
            "order by year";
        } else {
        }
      } else if ($term) {
        if ($house != "both") {

          $sql =
            "select year, sum(total) as total, sum (frequency) as frequency FROM(	" .
            "SELECT substring(sittingday::text,0," . $groupDate . ") as year, COUNT(*) as frequency, 0 as total " .
            "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q1	" .
            "WHERE " .
            "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE	" .
            "and idxfti_simple @@ q1 " .
            "group by year	" .
            "UNION ALL	" .
            "select year, 0 as frequency, total from hansard_" . $house . "_total_contributions_year WHERE year BETWEEN substring('" . $dateFrom . "'::text,0,5) AND substring('" . $dateTo . "'::text,0,5)	" .
            ") x 	" .
            "group by year	" .
            "order by year";
        } else {
        }
      }
    }


    $rows[$i] = query_handler::query_no_parameters($sql, "dbname=hansard");
    $i++;
  }

  $total_both = "";

  if ($_POST['flag_monthly_based'] == "true") {
    $var = convert_data::gen_json_line_advanced_month($rows, $_POST['parameters'], $norm_flag, $dateFrom, $dateTo);
  } else {
    $var = convert_data::gen_json_line_advanced($rows, $_POST['parameters'], $norm_flag, substr($dateFrom, 0, 4), substr($dateTo, 0, 4));
  }

  $var2 = json_encode($var);

  echo $var2;
} else if ($_POST['action'] == "hits") {

  if ($_POST['type'] == "basic") {

    $value = $_POST['parameters'];

    $dateFrom = $_POST['dateFrom'] . "-01-01";
    $dateTo = $_POST['dateTo'] . "-12-31";

    $cleaned_term = strtolower(convert_data::clean_query($value['term']));
    $num_terms = sizeof(explode(" ", $cleaned_term));
    $ts_term = convert_data::gen_postgresql_query($cleaned_term);


    if ($num_terms == 1) {

      $minWords = 1;
      $maxWords = 2;

      if (substr($cleaned_term, -1) == ".") {
        $cleaned_term = substr($cleaned_term, 0, strlen($cleaned_term) - 1);
      }

      if ($house != "both") {

        if (strpos($cleaned_term, "*") == FALSE) {

          $sql =
            "SELECT nentry as count "
            . "FROM ts_stat('select idxfti_simple from hansard_" . $house . "." . $house . " WHERE sittingday BETWEEN ''" . $dateFrom . "''::DATE AND ''" . $dateTo . "''::DATE "
            . "and idxfti_simple @@ to_tsquery(''simple'',''" . $ts_term . "'')') "
            . "where word = (ts_lexize('english_stem', '" . $cleaned_term . "'))[1] ";


          $total = query_handler::query_no_parameters($sql, "dbname=hansard");

          if ($total == 0) {

            $sql =
              "SELECT nentry as count "
              . "FROM ts_stat('select idxfti_simple from hansard_" . $house . "." . $house . " WHERE sittingday BETWEEN ''" . $dateFrom . "''::DATE AND ''" . $dateTo . "''::DATE "
              . "and idxfti_simple @@ to_tsquery(''simple'',''" . $ts_term . "'')') "
              . "where word = '" . $cleaned_term . "' ";



            $total = query_handler::query_no_parameters($sql, "dbname=hansard");
          }
        } else {

          $cleaned_term = str_replace("*", "%", $cleaned_term);

          $sql =
            "SELECT sum(nentry) as count "
            . "FROM ts_stat('select idxfti_simple from hansard_" . $house . "." . $house . " WHERE sittingday BETWEEN ''" . $dateFrom . "''::DATE AND ''" . $dateTo . "''::DATE  "
            . "and idxfti_simple @@ to_tsquery(''simple'',''" . $ts_term . "'')') "
            . "where word like '" . $cleaned_term . "'";

          $total = query_handler::query_no_parameters($sql, "dbname=hansard");
        }
      } else {
      }
    } else {

      $minWords = 1;
      $maxWords = $num_terms;

      if ($house != "both") {

        $sql =
          "SELECT SUM(hits) as count "
          . " FROM ( "
          . "select ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits "
          . "from ( "
          . "SELECT ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . $maxWords . ", MinWords=" . $minWords . ", ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline "
          . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q "
          . "WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
          . "and idxfti_simple @@ q "
          . ") as subq "
          . ") as x ";
      } else {
      }


      $total = query_handler::query_no_parameters($sql, "dbname=hansard");
    }

    $var2 = json_encode($total);
    echo $var2;
  } else if ($_POST['type'] == "advanced") {

    if (strlen($_POST['dateFrom']) > 4) {
      $dateFrom = $_POST['dateFrom'];
      $dateTo = $_POST['dateTo'];
    } else {
      $dateFrom = $_POST['dateFrom'] . "-01-01";
      $dateTo = $_POST['dateTo'] . "-12-31";
    }

    $value = $_POST['parameters'];

    if (isset($value['description']) && $value['description'] != "" && $value['description'] != " ") {
      $description = $value['description'];

      $cleaned_description = convert_data::clean_query($value['description']);
      $ts_description = convert_data::gen_postgresql_query($cleaned_description);
    } else {
      $description = FALSE;
    }

    if (isset($value['member']) && $value['member'] != "" && $value['member'] != " ") {
      $member = $value['member'];

      $cleaned_member = convert_data::clean_query($value['member']);
      $ts_member = convert_data::gen_postgresql_query($cleaned_member);

      if ($cleaned_member == "Speaker") {
        $cleaned_member = " ilike ''%speaker%''";
      } else {
        $cleaned_member = " = ''" . $cleaned_member . "''";
      }
    } else {
      $member = FALSE;
    }

    $cleaned_term = convert_data::clean_query($value['term']);
    $num_terms = sizeof(explode(" ", $cleaned_term));
    $ts_term = convert_data::gen_postgresql_query($cleaned_term);


    if ($num_terms == 1) {

      $minWords = 1;
      $maxWords = 2;

      if (substr($cleaned_term, -1) == ".") {
        $cleaned_term = substr($cleaned_term, 0, strlen($cleaned_term) - 1);
      }


      if ($member && $description) {

        if ($house != "both") {

          if (strpos($cleaned_term, "*") == TRUE) {
            $cleaned_term = str_replace("*", "%", $cleaned_term);
          }

          $sql =
            "SELECT sum(nentry) as count "
            . "FROM ts_stat('"
            . "select idxfti_simple from hansard_" . $house . "." . $house . " WHERE "
            . "sittingday BETWEEN ''" . $dateFrom . "''::DATE AND ''" . $dateTo . "''::DATE  "
            . "and idxfti_simple @@ to_tsquery(''simple'',''" . $ts_term . "'')"
            . "and description ilike ''%" . $cleaned_description . "%'' "
            . "and member " . $cleaned_member . " "
            . "') "
            . "where word ilike '" . $cleaned_term . "'";
        } else {
        }
      } else if ($member) {

        if ($house != "both") {

          if (strpos($cleaned_term, "*") == TRUE) {
            $cleaned_term = str_replace("*", "%", $cleaned_term);
          }

          $sql =
            "SELECT sum(nentry) as count "
            . "FROM ts_stat('"
            . "select idxfti_simple from hansard_" . $house . "." . $house . " WHERE "
            . "sittingday BETWEEN ''" . $dateFrom . "''::DATE AND ''" . $dateTo . "''::DATE  "
            . "and idxfti_simple @@ to_tsquery(''simple'',''" . $ts_term . "'')"
            . "and member " . $cleaned_member . " "
            . "') "
            . "where word ilike '" . $cleaned_term . "'";
        } else {
        }
      } else if ($description) {
        if ($house != "both") {

          if (strpos($cleaned_term, "*") == TRUE) {
            $cleaned_term = str_replace("*", "%", $cleaned_term);
          }

          $sql =
            "SELECT sum(nentry) as count "
            . "FROM ts_stat('"
            . "select idxfti_simple from hansard_" . $house . "." . $house . " WHERE "
            . "sittingday BETWEEN ''" . $dateFrom . "''::DATE AND ''" . $dateTo . "''::DATE  "
            . "and idxfti_simple @@ to_tsquery(''simple'',''" . $ts_term . "'')"
            . "and description ilike ''%" . $cleaned_description . "%'' "
            . "') "
            . "where word ilike '" . $cleaned_term . "'";
        } else {
        }
      } else {
        if ($house != "both") {

          if (strpos($cleaned_term, "*") == TRUE) {
            $cleaned_term = str_replace("*", "%", $cleaned_term);
          }

          $sql =
            "SELECT nentry as count "
            . "FROM ts_stat('select idxfti_simple from hansard_" . $house . "." . $house . " WHERE sittingday BETWEEN ''" . $dateFrom . "''::DATE AND ''" . $dateTo . "''::DATE "
            . "and idxfti_simple @@ to_tsquery(''simple'',''" . $ts_term . "'')') "
            . "where word ilike '" . $cleaned_term . "' ";
        } else {
        }
      }
    } else {

      $minWords = 1;
      $maxWords = $num_terms;

      if ($house != "both") {

        if ($member && $description) {

          $sql =
            "SELECT SUM(hits) as count "
            . " FROM ( "
            . "select ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits "
            . "from ( "
            . "SELECT ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . $maxWords . ", MinWords=" . $minWords . ", ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"'
                ) as headline "
            . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q "
            . "WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and idxfti_simple @@ q "
            . "and description ilike '%" . $cleaned_description . "%' "
            . "and member " . $cleaned_member . " "
            . ") as subq "
            . ") as x ";
        } else if ($member) {

          $sql =
            "SELECT SUM(hits) as count "
            . " FROM ( "
            . "select ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits "
            . "from ( "
            . "SELECT ts_headline('simple', contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . $maxWords . ", MinWords=" . $minWords . ", ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline "
            . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q "
            . "WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and idxfti_simple @@ q "
            . "and member " . $cleaned_member . " "
            . ") as subq "
            . ") as x ";
        } else if ($description) {
          $sql =
            "SELECT SUM(hits) as count "
            . " FROM ( "
            . "select ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits "
            . "from ( "
            . "SELECT ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . $maxWords . ", MinWords=" . $minWords . ", ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline "
            . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q "
            . "WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and idxfti_simple @@ q "
            . "and description ilike '%" . $cleaned_description . "%' "
            . ") as subq "
            . ") as x ";
        } else {

          $sql =
            "SELECT SUM(hits) as count "
            . " FROM ( "
            . "select ((cardinality(string_to_array(subq.headline,'<b>'))-1)/" . $num_terms . ") as hits "
            . "from ( "
            . "SELECT ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>,MaxWords=" . $maxWords . ", MinWords=" . $minWords . ", ShortWord=1, HighlightAll=FALSE, MaxFragments=9999, FragmentDelimiter=\" ... \"') as headline "
            . "FROM hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $ts_term . "') as q "
            . "WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
            . "and idxfti_simple @@ q "
            . ") as subq "
            . ") as x ";
        }
      } else {
      }
    }

    $total = query_handler::query_no_parameters($sql, "dbname=hansard");


    $var2 = json_encode($total);
    echo $var2;
  }
} else if ($_POST['action'] == "save_documents") {


  if ($house != "both") {

    $sql = "SELECT sittingday, contributiontext, member, description FROM hansard_" . $house . "." . $house . " WHERE id in (" . $_POST['query'] . ")";
  } else {
  }

  $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

  $var = convert_data::format_saveDocuments($rows, $_POST['offset']);
  echo $var;
} else if ($_POST['action'] == "killPID") {
  $var = query_handler::killingPID("dbname=hansard", $_SESSION["previous_PID"]);
  echo $var;
}
