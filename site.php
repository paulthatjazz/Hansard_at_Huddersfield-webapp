<?php

header('Content-Type: text/html;charset=utf-8');

//for dev purposes, change to version in live env.

$v = time(); 
//$v = 1.0;

session_start();

?>

<!doctype html>

<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="img/icon.ico">
    <title>Hansard at Huddersfield</title>

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="lib/bootstrap/bootstrap.4.3.1.min.css">


    <!-- Bootstrap Plugins CSS -->
    <link href="vendor/gijgo/gijgo.1.9.10.min.css" rel="stylesheet" />
    <link href="vendor/bootstrap-table/bootstrap-table.1.12.1.min.css" rel="stylesheet">
    <link href="vendor/bootstrap4-typeahead.js/typeaheadjs.css" rel="stylesheet" />
    <link href="vendor/tableexport/tableexport.5.0.0.min.css" rel="stylesheet" />


    <!-- CSS styles for this site -->
    <link href="src/css/site.css?<?php echo $v; ?>" rel="stylesheet">

    <!-- d3.js Plugins CSS -->
    <link href="vendor/nvd3/nv.d3.css" rel="stylesheet" type="text/css">

    <!-- JS Plugins CSS -->
    <link href="vendor/noUiSlider-12.1.0/distribute/nouislider.min.css" rel="stylesheet" type="text/css">

    <!-- Fonts -->
    <link href="vendor/fontawesome.5.11.2.min.css" rel="stylesheet">

    <!-- Social Buttons for Bootstrap -->
    <link href="vendor/bootstrap-social.5.1.1.min.css" rel="stylesheet">

</head>

<body>

    <?php include(__DIR__ . '/include/header.html'); ?>

    <div class="container-fluid">

        <div class="row">

            <nav class="col-2 d-lg-block sidebar index d-none d-lg-flex">

                <div class="sidebar-sticky text-align-center">
                    <!-- < ? php include (__DIR__ .'/include/header.html'); ? > -->
                    <div class="left-menu border-right">
                        <?php include(__DIR__ . '/include/function.html'); ?>
                        <?php include(__DIR__ . '/include/schema.html'); ?>
                    </div>
                </div>
            </nav>

            <main role="main" class="col-12 col-lg-10 ml-sm-auto px-4">

                <div class="row">

                    <div class="col-12 title content">
                        <?php include(__DIR__ . '/include/title.html'); ?>

                        <section class="search">
                            <?php include(__DIR__ . '/include/search/search_box-row.html'); ?>
                            <?php include(__DIR__ . '/include/search/distribution-row.html'); ?>
                            <?php include(__DIR__ . '/include/search/descriptions-row.html'); ?>
                            <?php include(__DIR__ . '/include/search/members-row.html'); ?>
                            <?php include(__DIR__ . '/include/search/results-row.html'); ?>
                            <?php include(__DIR__ . '/include/search/compare-results-row.html'); ?>
                            <?php include(__DIR__ . '/include/search/contribution-row.html'); ?>
                        </section>

                        <section class="explore">
                            <?php include(__DIR__ . '/include/explore/type-row.html'); ?>
                            <?php include(__DIR__ . '/include/explore/word_cloud-row.html'); ?>
                            <?php include(__DIR__ . '/include/explore/keywords-row.html'); ?>
                            <?php include(__DIR__ . '/include/explore/bubble-row.html'); ?>
                            <?php include(__DIR__ . '/include/explore/distribution-row.html'); ?>
                            <?php include(__DIR__ . '/include/explore/results-row.html'); ?>
                            <?php include(__DIR__ . '/include/explore/compare-results-row.html'); ?>
                            <?php include(__DIR__ . '/include/explore/contribution-row.html'); ?>
                        </section>

                    </div>

                </div>

            </main>

        </div>

    </div>

    </div>

    <?php include(__DIR__ . '/include/modals.html'); ?>

    <!-- JQuery core -->
    <script src="lib/jquery/jquery.3.3.1.min.js"></script>
    <!--<script>window.jQuery || document.write('<script src="assets/jquery-slim.min.js"><\/script>')</script> -->

    <!-- Bootstrap Core JavaScript dependency -->
    <script src="assets/popper.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="lib/bootstrap/bootstrap.4.1.2.min.js"></script>

    <!-- Plugins Bootstrap -->
    <script src="vendor/bootstrap-table/bootstrap-table.1.12.1.js"></script>
    <script src="vendor/gijgo/gijgo.1.9.10.min.js"></script>
    <!--datepicker -->
    <script src="vendor/bootstrap3-typeahead.4.0.2.min.js"></script>

    <!-- Plugins JS -->
    <script src="vendor/tableexport/js-xlsx/dist/xlsx.core.min.js"></script>
    <script src="vendor/tableexport/FileSaver.js/FileSaver.min.js"></script>
    <script src="vendor/tableexport/tableexport.5.0.0.min.js"></script>
    <script src="vendor/saveSvgAsPng/src/saveSvgAsPng.js"></script>
    <script src="vendor/noUiSlider-12.1.0/distribute/nouislider.min.js"></script>

    <!-- d3.js core -->
    <script src="lib/d3/d3.v4.min.js"></script>
    <script>
    d3version4 = d3
    window.d3 = null
    </script>
    <script src="lib/d3/d3.v3.min.js"></script>

    <!-- Plugins d3.js -->
    <script src="vendor/d3-layout/d3.layout.cloud.js"></script>
    <script src="vendor/d3-wordcloud/d3.wordcloud.js"></script>
    <script src="vendor/d3-bubble/d3.bubble.js"></script>
    <script src="vendor/nvd3/nv.d3.1.8.6.min.js"></script>

    <!-- JS for this site -->
    <script src="src/js/site.js?<?php echo $v; ?>"></script>
    <script src="src/js/search.js?<?php echo $v; ?>"></script>
    <script src="src/js/explore.js?<?php echo $v; ?>"></script>
    <script src="src/js/tooltips.js?<?php echo $v; ?>"></script>
    <script src="src/js/table-config.js?<?php echo $v; ?>"></script>
    <!-- Global site tag (gtag.js) - Google Analytics   -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-136155846-1"></script>

    <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'UA-136155846-1');
    </script>

</body>

</html>