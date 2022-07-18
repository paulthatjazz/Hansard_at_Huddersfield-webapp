<?php

session_start();

include_once './db/query_handler.php';
include_once './db/search.php';
include_once './db/analytics.php';
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

    $rows = search::contribution($dateFrom, $dateTo, $_GET['parameters'], $house, $_GET['action'], $_GET['count'], $_GET['offset'], $sort, $_GET['order'], $_GET['limit'], $_GET['context']);

    $var2 = json_encode($rows);

    echo $var2;

  } else if ($_GET['action'] == "contribution-advanced") {

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

    $rows = search::contribution($dateFrom, $dateTo, $_GET['parameters'], $house, $_GET['kwic'], $_GET['count'], $_GET['offset'], $sort, $_GET['order'], $_GET['limit'], $_GET['context'], TRUE);
    
    $var2 = json_encode($rows);

    error_log(serialize($rows));


    echo $var2;
  }
} else if ($_POST['action'] == "contribution-expand") {

  $sql = "SELECT id, sittingday, contributiontext, member, href as url FROM hansard_" . $_POST['row_house'] . "." . $_POST['row_house'] . " WHERE id='" . $_POST['id'] . "'";

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
  
  if ($house == "both") {

    $sql_extra =
      "SELECT sum(total) as total, year " .
      "FROM " .
      "( " .
      "select total, year from hansard_precomp.hansard_commons_total_word_year where year BETWEEN '" . $_POST['dateFrom'] . "' AND '" . $_POST['dateTo'] . "' " .
      "UNION ALL " .
      "select total, year from hansard_precomp.hansard_lords_total_word_year where year BETWEEN '" . $_POST['dateFrom'] . "' AND '" . $_POST['dateTo'] . "' " .
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

  $dateFrom = $_POST['dateFrom'];
  $dateTo = $_POST['dateTo'];

  if($_POST['flag_monthly_based'] == "true"){
    $monthly = TRUE;
  }else{
    $monthly = FALSE;
  }

  $rows = search::distribution($_POST['parameters'], $house, $dateFrom, $dateTo, TRUE, $monthly);

  if($_POST['flag_normalised'] == "true"){
    $norm_flag = TRUE;
  }else{
    $norm_flag = FALSE;
  }

  if ($monthly == TRUE) {
    $var = convert_data::gen_json_line_advanced_month($rows, $_POST['parameters'], $norm_flag, $dateFrom, $dateTo);
  } else {
    $var = convert_data::gen_json_line_advanced($rows, $_POST['parameters'], $norm_flag, substr($dateFrom, 0, 4), substr($dateTo, 0, 4));
  }

  $var2 = json_encode($var);

  echo $var2;
  
} else if ($_POST['action'] == "hits") {

    $value = $_POST['parameters'];

    if (strlen($_POST['dateFrom']) > 4) {
      $dateFrom = $_POST['dateFrom'];
      $dateTo = $_POST['dateTo'];
      $monthly = TRUE;
    } else {
      $dateFrom = $_POST['dateFrom'] . "-01-01";
      $dateTo = $_POST['dateTo'] . "-12-31";
      $monthly = FALSE;
    }

    $total = search::hits($value, $dateFrom, $dateTo, $house, $_POST['type'], $monthly);
    
    $var2 = json_encode($total);
    echo $var2;
  
} else if ($_POST['action'] == "save_documents") {

  $q = str_replace("#345", "'", $_POST['query']);

  $sql = search::getDocumentsById($house, $q);

  $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

  $var = convert_data::format_saveDocuments($rows, $_POST['offset']);
  
  echo $var;
} else if ($_POST['action'] == "killPID") {
  $var = query_handler::killingPID("dbname=hansard", $_SESSION["previous_PID"]);
  echo $var;
} else if ($_POST['action'] == "maxDate"){

  $sql = "SELECT max(sittingday) as upperdate FROM hansard_commons.commons";

  $rows = query_handler::query_no_parameters($sql, "dbname=hansard");
  
  echo json_encode($rows);
} else if ($_POST['action'] == 'sharedLink'){

  $id = $_POST['id'];
  
  $searchData = analytics::getQueryData($id);
  
  echo json_encode($searchData);
}