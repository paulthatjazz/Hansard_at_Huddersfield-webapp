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

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js"
        integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous">
    </script>
    <script src="lib/jquery/jquery.3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"
        integrity="sha512-T/tUfKSV1bihCnd+MxKD0Hm1uBBroVYBOYSk1knyvQ9VyZJpc/ALb4P0r6ubwVPSGB2GvjeoMAJJImBG12TiaQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css"
        integrity="sha512-mSYUmp1HYZDFaVKK//63EcZq4iFWFjxSL+Z3T/aCt4IO9Cejm03q3NKKYN6pFQzY0SBOr8h+eCIAZHPXcpZaNw=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

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

    <link rel="stylesheet" href="new.css">
</head>

<body>

    <section>

        <div class="container" style="padding-bottom: 2vh;">
            <h1>Hansard@Huddersfield</h1>
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

                                        </div>

                                        <div class="form-group">

                                            <!-- BASIC DATE YYYY -->
                                            <div class="basic-date active mt-2 ">
                                                <div class="col-lg-6 col-md-auto dpf">
                                                    <label>From:</label>
                                                    <input type="number" value=2000 class="form-control"
                                                        id="basic-dp-from" />
                                                </div>
                                                <div class="col-lg-6 col-md-auto">
                                                    <label>To:</label>
                                                    <input type="number" value=2022 class="form-control"
                                                        id="basic-dp-to" />
                                                </div>
                                            </div>

                                            <!-- ADVANCED DATE DD/MM/YYYY -->
                                            <div class="adv-date mt-2 ">
                                                <div class="col-lg-6 col-md-auto dpf">
                                                    <label>From:</label>
                                                    <input id="adv-dp-from"
                                                        class="form-control datepicker datepicker-from" />
                                                </div>
                                                <div class="col-lg-6 col-md-auto">
                                                    <label>To:</label>
                                                    <input id="adv-dp-to"
                                                        class="form-control datepicker datepicker-to" />
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
                                            </div>


                                        </div>



                                        <div class="row">
                                            <div class="form-check adv-check">
                                                <input class="form-check-input" type="checkbox" value=""
                                                    id="advancedOptionCheck">
                                                <label class="form-check-label" for="advancedOptionCheck">
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
                                                    <div class="invalid-feedback">
                                                        Please insert a valid query.
                                                    </div>

                                                </div>
                                                <div class="col-md-6 col-12">
                                                    <label class="mr-3" style="visibility: hidden;">Debate
                                                        title:</label>
                                                    <input id="both-member" type="text" class="member form-control"
                                                        placeholder="Member" />
                                                    <input id="lords-member" type="text" class="member form-control"
                                                        placeholder="Member" />
                                                    <input id="commons-member" type="text" class="member form-control"
                                                        placeholder="Member" />
                                                    <div class="invalid-feedback">
                                                        Please insert a valid query.
                                                    </div>

                                                </div>
                                            </div>


                                        </div>


                                        <div class="row">

                                        </div>

                                        <!-- SEARCH TERMS -->

                                        <div style="padding-top: 2vh;">
                                            <button type="button" class="btn btn-outline-dark btn-lg"
                                                id="search-btn">Search</button>
                                            <button type="button" class="btn btn-outline-dark btn-lg"
                                                id="reset-btn">Reset</button>
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
                                <div id="contribution-body" class="accordion-body">
                                    <div class="contribution-loader loader"></div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>


                <div class="col-2">
                    <!--  -->
                    <div class="preview-window">
                    </div>
                    <div class="preview-window">
                    </div>
                    <div class="preview-window">
                    </div>
                </div>

            </div>
        </div>

    </section>



</body>

<script src="src\js\search_new.js"></script>

</html>