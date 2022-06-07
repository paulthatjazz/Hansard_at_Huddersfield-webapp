<?php

header('Content-Type: text/html;charset=utf-8');

session_start();

?>

<!doctype html>

<html lang="en">

<head>
    <title>Hansard at Huddersfield</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="img/icon.ico">


    <script src="lib/jquery/jquery.3.3.1.min.js"></script>
    <script src="vendor/tableexport/js-xlsx/dist/xlsx.core.min.js"></script>
    <script src="vendor/tableexport/FileSaver.js/FileSaver.min.js"></script>
    <script src="vendor/tableexport/tableexport.5.0.0.min.js"></script>
    <script src="vendor/saveSvgAsPng/src/saveSvgAsPng.js"></script>
    <script src="vendor/noUiSlider-12.1.0/distribute/nouislider.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"
        integrity="sha512-T/tUfKSV1bihCnd+MxKD0Hm1uBBroVYBOYSk1knyvQ9VyZJpc/ALb4P0r6ubwVPSGB2GvjeoMAJJImBG12TiaQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css"
        integrity="sha512-mSYUmp1HYZDFaVKK//63EcZq4iFWFjxSL+Z3T/aCt4IO9Cejm03q3NKKYN6pFQzY0SBOr8h+eCIAZHPXcpZaNw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js"
        integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous">
    </script>

    <script src="vendor\typeahead.bundle.js"></script>

    <link href="vendor/nvd3/nv.d3.css" rel="stylesheet" type="text/css">
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
    <script src="vendor/bootstrap-table/bootstrap-table.1.12.1.js"></script>


    <!-- Fonts -->
    <link href="vendor/fontawesome.5.11.2.min.css" rel="stylesheet">

    <!--link rel="stylesheet" href="lib/bootstrap/bootstrap.4.3.1.min.css" -->
    <link href="vendor/gijgo/gijgo.1.9.10.min.css" rel="stylesheet" />
    <link href="vendor/bootstrap-table/bootstrap-table.1.12.1.min.css" rel="stylesheet">
    <link href="vendor/bootstrap4-typeahead.js/typeaheadjs.css" rel="stylesheet" />
    <link href="vendor/tableexport/tableexport.5.0.0.min.css" rel="stylesheet" />

    <!-- JS Plugins CSS -->
    <link href="vendor/noUiSlider-12.1.0/distribute/nouislider.min.css" rel="stylesheet" type="text/css">

    <link rel="stylesheet" href="new.css">

</head>

<body>
    <nav class="site-header sticky-top ">
        <div class="header-container">
            <div class="container header-1 d-flex flex-md-row
      justify-content-between py-1">
                <a class="py-2 d-inline-block" target="_blank" href="index.php?show=feedback" title="Email"><span
                        class="far fa-envelope"></span></a>
                <a class="py-2 d-inline-block" target="_blank" href="https://twitter.com/HansardHuds" title="Twitter">
                    <span class="fab fa-twitter"></span></a>
                <a class="py-2 d-inline-block" target="_blank" href="https://facebook.com/hansardhud"
                    title="Facebook"><span class="fab fa-facebook-square"></span></a>
            </div>
        </div>
    </nav>

    <section>

        <div class="container title-header" style="padding-bottom: 2vh;">

            <h1 class="logo-1">
                <span class="hansard">HANSARD</span> at
                <span class="huddersfield">HUDDERSFIELD</span>
            </h1>
            </a>
        </div>

        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="accordion" id="accordionExample">

                        <!--  Search Box  -->
                        <div class="accordion-item">
                            <h2 class="accordion-header">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    <div class="col-6">Search Box</div>
                                    <div id="tabs-terms"></div>
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                                data-bs-parent="#accordionExample">
                                <div class="accordion-body search-box">
                                    <form>
                                        <div class="form-group">
                                            <input autocomplete="off" id="term" class="form-control form-control-lg"
                                                type="text" placeholder="Search term...">
                                            <div id="validation-text" class="validation">
                                            </div>

                                        </div>

                                        <div class="form-group">

                                            <!-- BASIC DATE YYYY -->
                                            <div class="basic-date active mt-2 ">
                                                <div class="col-lg-6 col-md-auto dpf">
                                                    <label>From:</label>
                                                    <input type="number" value=2000 class="form-control"
                                                        id="basic-dp-from" />
                                                    <div class="validation validation-date-from">
                                                    </div>
                                                </div>


                                                <div class="col-lg-6 col-md-auto">
                                                    <label>To:</label>
                                                    <input type="number" value=2022 class="form-control"
                                                        id="basic-dp-to" />
                                                    <div class="validation validation-date-to">
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- ADVANCED DATE DD/MM/YYYY -->
                                            <div class="adv-date mt-2 ">
                                                <div class="col-lg-6 col-md-auto dpf">
                                                    <label>From:</label>
                                                    <input id="adv-dp-from"
                                                        class="form-control datepicker datepicker-from" />

                                                    <div class="validation validation-date-from">
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 col-md-auto">
                                                    <label>To:</label>
                                                    <input id="adv-dp-to"
                                                        class="form-control datepicker datepicker-to" />

                                                    <div class="validation validation-date-to">
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="col-lg-4 col-md-auto house-selection">
                                                <input class="form-check-input" type="checkbox" name="commons-check"
                                                    id="commons-ch" checked>
                                                <label class="form-check-label" for="commons-ch">
                                                    Commons
                                                </label>
                                                <input class="form-check-input" type="checkbox" name="lords-check"
                                                    id="lords-ch">
                                                <label class="form-check-label" for="lords-ch">
                                                    Lords
                                                </label>
                                                <div id="validation-house" class="validation"></div>
                                            </div>


                                        </div>



                                        <div class="row">
                                            <div class="form-check adv-check custom-control custom-switch">
                                                <input class="form-check-input custom-control-input" type="checkbox"
                                                    value="" id="advancedOptionCheck">
                                                <label class="form-check-label custom-control-label"
                                                    for="advancedOptionCheck">
                                                    Advanced Options
                                                </label>
                                            </div>

                                        </div>



                                        <div class="advanced-options">

                                            <div class="row">
                                                <div class="col-md-6 col-12">
                                                    <label class="mr-3" style="visibility: hidden;">Debate
                                                        title:</label>
                                                    <input id="desc" type="text" class="form-control"
                                                        placeholder="Debate title" />
                                                    <div class="text-validate validation">
                                                    </div>

                                                </div>
                                                <div class="col-md-6 col-12">
                                                    <label class="mr-3" style="visibility: hidden;">Debate
                                                        title:</label>
                                                    <input id="both-member" type="text"
                                                        class="member form-control inactive-member-search"
                                                        placeholder="Member" />
                                                    <input id="lords-member" type="text"
                                                        class="member form-control inactive-member-search"
                                                        placeholder="Member" />
                                                    <input id="commons-member" type="text"
                                                        class="member form-control active-member-search"
                                                        placeholder="Member" />
                                                    <div class="text-validate validation">
                                                    </div>

                                                </div>
                                            </div>




                                        </div>

                                        <div class="row">
                                            <div class="form-check adv-check custom-control custom-switch">
                                                <input class="form-check-input custom-control-input" type="checkbox"
                                                    value="" id="searchTipsCheck">
                                                <label class="form-check-label custom-control-label"
                                                    for="searchTipsCheck">
                                                    Search Tips
                                                </label>
                                            </div>
                                        </div>

                                        <div id="search-tips" class="search-tips">
                                            Search for individual words by typing in the search box and setting relevant
                                            parameters.
                                            <ul>
                                                <li>You can compare up to four terms (for the same period and house) by
                                                    submitting individual search terms.</li>
                                                <li>Use + to find contributions that include ALL of the search terms
                                                    specified.</li>
                                                <li>Use | to find contributions that include EITHER one or another of
                                                    the search terms specified.</li>
                                                <li>Use – to eliminate from search results those contributions that
                                                    contain the specified search term.</li>
                                                <li>Use * (wildcard) to allow for different forms of the search term
                                                    (e.g. ‘war*’ finds contributions that use ‘war’/’wars’/’warring’)
                                                </li>
                                                <li>Enclose exact phrases between quotation marks (“) to search only for
                                                    mentions of the entire phrase</li>
                                            </ul>
                                            <strong>Please be aware that combining the above search features may lead to
                                                a time out.</strong>
                                        </div>

                                        <div class="row terms-listed hide">
                                            <div class="col">
                                                Selected Terms:
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col terms-list">
                                            </div>
                                        </div>

                                        <!-- SEARCH TERMS -->

                                        <div style="padding-top: 2vh;">
                                            <button type="button" class="btn btn-success btn-lg"
                                                id="search-btn">Search</button>
                                            <button type="button" class="btn btn-warning btn-lg"
                                                id="reset-btn">Reset</button>

                                            <span class="records-desc">
                                                Hansard records until ...
                                            </span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!--  Distribution Box  -->
                        <div class="accordion-item distribution">
                            <h2 class="accordion-header" id="headingTwo">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    <div class="col-6">Distribution</div>

                                    <div id="timeline-selected"></div>
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                                data-bs-parent="#accordionExample">
                                <div class="row justify-content-between">
                                    <div class="col-md-4 col-12">

                                    </div>

                                    <div class="col-md-4 col-12 d-flex justify-content-end">
                                        <div class="btn-group" role="group" aria-label="Basic example">
                                            <button id="tooltip_6_3" type="button"
                                                class="btn btn-light btn-sm share-socials distribution help"
                                                data-visual="compare-linechart" hidden>
                                                Share
                                            </button>
                                            <button id="tooltip_6_3" type="button"
                                                class="btn btn-light btn-sm export-png distribution help"
                                                data-visual="compare-linechart">
                                                Image
                                            </button>
                                            <button id="tooltip_6_4" type="button"
                                                class="btn btn-light btn-sm export-excel distribution help"
                                                data-visual="compare-linechart">
                                                Excel
                                            </button>
                                            <button id="tooltip_6_5" type="button"
                                                class="btn btn-light btn-sm export-csv distribution help"
                                                data-visual="compare-linechart">
                                                CSV
                                            </button>
                                        </div>
                                    </div>

                                </div>

                                <div id="distribution-body" class="accordion-body">
                                    <div class="distribution-loader loader"></div>
                                </div>


                            </div>
                        </div>

                        <div class="accordion-item contribution">
                            <h2 class="accordion-header" id="headingThree">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    <div class="col-6">Texts</div>
                                </button>
                            </h2>
                            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree"
                                data-bs-parent="#accordionExample">

                                <?php include(__DIR__ . '/include/search/table-toolbar.html'); ?>


                                <ul class="nav nav-tabs nav-justified" id="contrib-tabs">
                                </ul>


                                <div id="contribution-body" class="accordion-body">
                                    <div class="contribution-loader loader"></div>

                                    <?php include(__DIR__ . '/include/search/results-row_new.html'); ?>
                                    <?php include(__DIR__ . '/include/search/compare-results-row_new.html'); ?>

                                </div>
                            </div>
                        </div>

                        <div class="accordion-item text">
                            <h2 class="accordion-header" id="headingFour">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                    <div class="col-6">Contribution</div>
                                </button>
                            </h2>
                            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingThree"
                                data-bs-parent="#accordionExample">
                                <div id="contribution-body" class="accordion-body">

                                    <div class="text-loader loader"></div>


                                    <div id="contribution_original"></div>

                                </div>
                            </div>
                        </div>


                    </div>

                </div>

                <div class="col-1">
                    <!--  -->
                    <div class="preview-window active-mode" id="line-graph">
                        <h2>Distribution</h2>


                        <span class="preview-message"></span>
                    </div>
                    <div class="preview-window" id="word-cloud">
                        <h2>Word Cloud</h2>

                        <span class="preview-message">Under construction</span>
                    </div>
                    <div class="preview-window" id="keywords">
                        <h2>Keywords</h2>

                        <span class="preview-message">Under construction</span>
                    </div>
                    <div class="preview-window" id="collocation">
                        <h2>Collocation</h2>

                        <span class="preview-message">Under construction</span>
                    </div>
                </div>

                <?php include(__DIR__ . '/include/modals_new.html'); ?>




            </div>
        </div>

    </section>

    <footer class="mt-5 mb-3 text-muted text-center text-small">
        <p>© 2022 Hansard at Huddersfield</p>
    </footer>



</body>

<script src="src\js\search_new.js"></script>
<script src="src\js\table-config.js?"></script>

</html>