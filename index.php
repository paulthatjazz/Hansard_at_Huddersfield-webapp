<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1,
            shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="img/icon.ico">

    <title>Hansard at Huddersfield</title>

    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="lib/bootstrap/bootstrap.4.3.1.min.css">

    <!-- Custom styles for this template -->
    <link href="src/css/index.css" rel="stylesheet">

    <!-- Fonts -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
        integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">

    <!-- Social Buttons for Bootstrap -->
    <link href="vendor/bootstrap-social.5.1.1.min.css" rel="stylesheet">


</head>

<body>

    <nav class="site-header sticky-top py-1">
        <div class="container header d-flex flex-column flex-md-row
                justify-content-between">
            <a class="py-2 d-inline d-md-none text-center" aria-label="Product">
                <img src=".\img\icon.jpg" width="24" height="24">
            </a>
            <a class="py-2 d-none d-md-inline-block" target="_blank" href="index.php?show=feedback" title="Email"><span
                    class="far fa-envelope"></span< /a> <a class="py-2 d-none d-md-inline-block" target="_blank"
                        href="https://twitter.com/HansardHuds" title="Twitter">
                        <span class="fab fa-twitter"></span></a>
                    <a class="py-2 d-none d-md-inline-block" target="_blank"
                        href="https://www.instagram.com/hansardhud/" title="Instagram"><span
                            class="fab fa-instagram"></span></a>
                    <a class="py-2 d-none d-md-inline-block" target="_blank" href="https://facebook.com/hansardhud"
                        title="Facebook"><span class="fab fa-facebook-square"></span></a>
        </div>
    </nav>

    <main role="main">

        <section class="intro">

            <div class="container mt-4">

                <div class="row">
                    <div class="col-md-8 col-12">
                        <div>
                            <h1 class="main-title"><span class="hansard">HANSARD</span>
                                at <span class="huddersfield">HUDDERSFIELD</span></h1>
                            <p class="lead">Welcome to Hansard at Huddersfield! Explore
                                the official, substantially verbatim report of what was
                                said in both
                                houses of Parliament between 1803-<?php
                                    include_once 'src/php/db/query_handler.php';

                                    $sql = "SELECT max(sittingday) as upperdate FROM hansard_commons.commons";

                                    $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

                                    $maxd = str_split(strval( $rows[0]["upperdate"] ), 4)[0];

                                    echo $maxd ;
                                ?> through various
                                search functions and interactive visualisations.</p>
                            <p><a class="btn btn-outline-primary btn-lg application" href="site.php" role="button">Go to
                                    web application
                                    &raquo;</a></p>
                        </div>
                    </div>
                    <div class="d-none d-md-inline-block col-md-4">
                        <a class="twitter-timeline" data-lang="en" data-height="300" data-theme="light"
                            href="https://twitter.com/HansardHuds?ref_src=twsrc%5Etfw">Tweets by HansardHuds</a>
                        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                    </div>
                </div>

            </div>

        </section>


        <hr>
        <section class="album py-3">
            <!-- bg-light -->
            <div class="container">

                <div class="row">

                    <div class="col-md-3">
                        <div class="card mb-4 text-center function" data-function="website">
                            <div class="card-body">
                                <i class="fas fa-laptop-code fa-3x" style="color:
                                        #fff;"></i>
                                <p class="card-text">The Website</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card mb-4 text-center function" data-function="project">
                            <div class="card-body">
                                <i class="fas fa-info fa-3x" style="color:
                                        #fff;"></i>
                                <p class="card-text">The Project</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card mb-4 text-center function" data-function="blog">
                            <div class="card-body">
                                <i class="fas fa-pen fa-3x" style="color:
                                        #fff;"></i>
                                <p class="card-text">Blog</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card mb-4 text-center function" data-function="help">
                            <div class="card-body">
                                <i class="fas fa-question fa-3x" style="color: #fff;"></i>
                                <p class="card-text">Guidance</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card mb-4 text-center function" data-function="illustrations">
                            <div class="card-body">
                                <i class="fas fa-chalkboard-teacher fa-3x" style="color: #fff;"></i>
                                <p class="card-text">Illustrations</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card mb-4 text-center function" data-function="about_us">
                            <div class="card-body">
                                <i class="fas fa-hands-helping fa-3x" style="color: #fff;"></i>
                                <p class="card-text">About us</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card mb-4 text-center function" data-function="acknowledgements">
                            <div class="card-body">
                                <i class="fas fa-address-card fa-3x" style="color: #fff;"></i>
                                <p class="card-text">Acknowledgements</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card mb-4 text-center function" data-function="feedback">
                            <div class="card-body">
                                <i class="far fa-comment fa-3x" style="color: #fff;"></i>
                                <p class="card-text">Feedback</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <section class="sections">

            <div id="website" class="container only-one">

                <hr>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <h2>The Website</h2>
                    </div>
                </div>

                <div class="row mb-3">

                    <div class="col-md-12">
                        <p>
                            The Hansard at Huddersfield site offers user-friendly search functions that make possible
                            the perusal of linguistic, historical and thematic trends in UK Chamber debates between 1803-<?php
                                    echo $maxd;
                                ?>. The search functions present their results using clear visualisations that aid
                            straightforward interpretation. These tools enable the uncomplicated exploration of, for
                            example, the importance of a particular topic in parliamentary debate or the framing of a
                            speaker’s stance towards a debate topic. Exploration of these kinds of patterns benefits
                            research by readily providing empirical evidence for the way UK MPs and Peers engage in
                            parliamentary debate.
                        </p>
                    </div>
                </div>

                <div class="row mb-3 justify-content-center">

                    <div class="card function function-hover2"
                        style="width: 18rem; background-color: white; color: black;" data-function="brochure">
                        <div class="card-body">
                            <i class="fas fa-book-reader fa-5x card-icon" style="background-color: #c95c3b;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Brochure
                            </h5>
                            <p class="card-text">A short, illustrative description of Hansard at Huddersfield’s aims and
                                search functions.</p>
                        </div>
                    </div>

                </div>


            </div>

            <div id="project" class="container only-one">

                <hr>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <h2>The Project</h2>
                    </div>
                </div>


                <div class="row justify-content-between">

                    <div class="col-md-12 mb-3">
                        <p>
                            The Hansard at Huddersfield web application offers ways of exploring Chamber debates from
                            both Houses of Parliament that go beyond searching for individual debates. Its search
                            functions produce visualisations of language patterns in Hansard across time, across
                            speakers and across debate titles that would be too time-consuming to find manually.
                        </p>
                        <p>
                            Created by academics with backgrounds in linguistics and computer science, the web
                            application aims to help policy-makers, researchers and teachers to highlight, visualise and
                            interpret trends of parliamentary debate that they cannot readily find using the official
                            Hansard website. Consultation with likely end-users was held prior to and during the
                            development of the Hansard at Huddersfield web application to ensure that its search tools
                            meet real-world needs. As a result, Hansard at Huddersfield provides search functions that
                            complement those of the official Hansard website.
                        </p>


                    </div>
                </div>

                <div class="row mb-3 justify-content-center">

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="tech">
                        <div class="card-body">
                            <i class="fas fa-wrench fa-5x card-icon" style="background-color: #db8514;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Technologies Used
                            </h5>
                            <p class="card-text">The technological details of the search functions of this site.</p>
                        </div>
                    </div>

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="academic">
                        <div class="card-body">
                            <i class="fas fa-book-open fa-5x card-icon" style="background-color: #db8514;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Outputs
                            </h5>
                            <p class="card-text">Publications about Hansard at Huddersfield for academic audiences.</p>
                        </div>
                    </div>

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="event">
                        <div class="card-body">
                            <i class="fas fa-calendar-alt fa-5x card-icon" style="background-color: #db8514;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Events
                            </h5>
                            <p class="card-text">Details about upcoming and past workshops about using the Hansard at
                                Huddersfield tool.</p>
                        </div>
                    </div>

                </div>

                <div class="container sub-c" id="tech">

                    <hr>

                    <h4 class="d-flex justify-content-between
                            align-items-center mb-3">
                        <span id="technologies" class="text-muted">Technologies
                            used</span>
                    </h4>


                    <div class="row">
                        <div class="col-4">
                            <div class="list-group" id="list-tab" role="tablist">
                                <a class="list-group-item
                                    list-group-item-action active" id="list-prog_lang-list" data-toggle="list"
                                    href="#list-prog_lang" role="tab" aria-controls="prog_lang">Programming
                                    languages</a>
                                <a class="list-group-item
                                    list-group-item-action" id="list-design-list" data-toggle="list"
                                    href="#list-design" role="tab" aria-controls="design">Design</a>
                                <a class="list-group-item
                                    list-group-item-action" id="list-visual-list" data-toggle="list"
                                    href="#list-visual" role="tab" aria-controls="visual">Visualisations</a>
                                <a class="list-group-item
                                    list-group-item-action" id="list-js_plugins-list" data-toggle="list"
                                    href="#list-js_plugins" role="tab" aria-controls="js_plugins">JS
                                    plugins</a>
                            </div>
                        </div>
                        <div class="col-8">
                            <div class="tab-content" id="nav-tabContent">
                                <div class="tab-pane fade show active" id="list-prog_lang" role="tabpanel"
                                    aria-labelledby="list-prog_lang-list">
                                    <ul class="list-group mb-3">

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more" data-url="https://www.postgresql.org">
                                            PostgreSQL 9.6.11
                                            <span class="badge
                                                badge-primary
                                                badge-pill">PostgreSQL
                                                License (Open Source
                                                license)</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more" data-url="https://www.php.net/">
                                            PHP 7.0
                                            <span class="badge
                                                badge-primary
                                                badge-pill">PHP License
                                                v3.01 (Open Source
                                                license)</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more" data-url="https://jquery.org/">
                                            jQuery v3.3.1
                                            <span class="badge
                                                badge-primary
                                                badge-pill">MIT License</span>
                                        </li>

                                    </ul>
                                </div>

                                <div class="tab-pane fade" id="list-design" role="tabpanel"
                                    aria-labelledby="list-design-list">
                                    <ul class="list-group mb-3">
                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more" data-url="https://getbootstrap.com/">
                                            Bootstrap v4.1.2
                                            <span class="badge
                                                badge-primary
                                                badge-pill">MIT License</span>
                                        </li>
                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more" data-url="https://fontawesome.com/">
                                            Font Awesome Free V5
                                            <span class="badge
                                                badge-primary
                                                badge-pill">MIT License</span>
                                        </li>
                                    </ul>
                                </div>

                                <div class="tab-pane fade" id="list-visual" role="tabpanel"
                                    aria-labelledby="list-visual-list">
                                    <ul class="list-group mb-3">

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more" data-url="https://d3js.org/">
                                            D3.js v3
                                            <span class="badge
                                                badge-primary
                                                badge-pill">BSD License</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more" data-url="http://nvd3.org/">
                                            NVD3
                                            <span class="badge
                                                badge-primary
                                                badge-pill">Apache 2.0
                                                License</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more" data-url="https://bl.ocks.org">
                                            Samples from bl.ocks.org
                                            <span class="badge
                                                badge-primary
                                                badge-pill">BSD License</span>
                                        </li>

                                    </ul>
                                </div>

                                <div class="tab-pane fade" id="list-js_plugins" role="tabpanel"
                                    aria-labelledby="list-js_plugins-list">
                                    <ul class="list-group mb-3">
                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more"
                                            data-url="https://bootstrap-table.com/">
                                            Bootstrap Table v1.12.1
                                            <span class="badge
                                                badge-primary
                                                badge-pill">MIT License</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more"
                                            data-url="https://github.com/bassjobsen/Bootstrap-3-Typeahead/">
                                            Bootstrap Typeahead
                                            <span class="badge
                                                badge-primary
                                                badge-pill">MIT License</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more"
                                            data-url="https://gijgo.com/datepicker">
                                            Datepicker by Gijgo.com
                                            <span class="badge
                                                badge-primary
                                                badge-pill">MIT License</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more"
                                            data-url="https://github.com/SheetJS/js-xlsx">
                                            SheetJS js-xlsx
                                            <span class="badge
                                                badge-primary
                                                badge-pill">Apache 2.0
                                                License</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more"
                                            data-url="https://github.com/eligrey/FileSaver.js">
                                            FileSaver.js
                                            <span class="badge
                                                badge-primary
                                                badge-pill">MIT License</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more"
                                            data-url="https://github.com/bjpop/saveSvgAsPng">
                                            saveSvgAsPng
                                            <span class="badge
                                                badge-primary
                                                badge-pill">MIT License</span>
                                        </li>

                                        <li class="tech list-group-item
                                            d-flex
                                            justify-content-between
                                            align-items-center" title="See more"
                                            data-url="https://github.com/leongersen/noUiSlider">
                                            noUiSlider
                                            <span class="badge
                                                badge-primary
                                                badge-pill">MIT License</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container sub-c" id="academic">

                    <hr>

                    <div class="">
                        <h4 class="d-flex justify-content-between
                        align-items-center mb-3">
                            <span id="outputs" class="text-muted">Outputs</span>
                        </h4>

                        <ul class="list-group mb-3 othershan">


                            <h5>Academic Outputs</h5>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub" data-url="pdf/Article Preprint for website.pdf" title="See more">
                                    <h6 class="my-0">Pre-print journal article</h6>
                                    <small class="text-muted">
                                        Lunen, A. von, Sanjurjo González, H., Jeffries, L. & Stradling, F.
                                        (Forthcoming). Hansard at Huddersfield: Adapting Corpus Linguistic Methods for
                                        Non-Specialist Use.
                                    </small>
                                </div>
                            </li>
                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed">
                                <div class="" data-url="" title="See more">
                                    <h6 class="my-0">Book Chapter (Forthcoming)</h6>
                                    <small class="text-muted">
                                        Jeffries, L., Stradling, F., Lunen von, A. & Sanjurjo Gonzalez, H.
                                        (Forthcoming). Hansard at Huddersfield: streamlined corpus methods and
                                        interactive visualisations to pursue research aims beyond corpus linguistics. In
                                        M. Korhonen, H. Kotze & J. Tyrkkö (Eds.), Exploring Language and Society with
                                        Big Data: Parliamentary discourse across time and space (pp. XX-XX). Amsterdam:
                                        John Benjamins.
                                    </small>
                                </div>
                            </li>
                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub" data-url="https://icame40.ch/wp-content/uploads/ICAME40_BoA.pdf"
                                    title="See more">
                                    <h6 class="my-0">Conference Presentation</h6>
                                    <small class="text-muted">Jeffries, L. &
                                        Sanjurjo-González, H. (2019). Making
                                        Hansard accessible
                                        to
                                        non-expert users through data
                                        visualisation. Talk presented at
                                        ICAME40 conference.
                                        Neuchâtel, Switzerland</small>
                                </div>
                            </li>
                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://adeit-estaticos.econgres.es/19_CILC/book_abstracts.pdf"
                                    title="See more">
                                    <h6 class="my-0">Conference Presentation</h6>
                                    <small class="text-muted">Jeffries, L. &
                                        Sanjurjo-González, H. (2019). Making
                                        corpus-based
                                        searching
                                        accessible for non-expert users: the
                                        case of Hansard. Talk presented at
                                        XI International
                                        Conference on
                                        Corpus Linguistics (CILC 2019)
                                        conference. Valencia, Spain</small>
                                </div>
                            </li>


                            <h5>Blogs</h5>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://ahrc-blog.com/2018/05/28/hansard-at-huddersfield-improving-democracy-through-technology/"
                                    title="See more">
                                    <h6 class="my-0">Blog Post</h6>
                                    <small class="text-muted">De Jager, F. (2018, May 28). Hansard at Huddersfield:
                                        Improving Democracy Through Technology. AHRC Blog</small>
                                </div>
                            </li>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://www.democraticaudit.com/2019/03/06/democratising-hansard-continuing-to-improve-the-accessibility-of-parliamentary-records/"
                                    title="See more">
                                    <h6 class="my-0">Blog Post</h6>
                                    <small class="text-muted">Jeffries, L., De Jager, F. (2019, March 6). Democratising
                                        Hansard: continuing to improve the accessibility of parliamentary records.
                                        Democratic Audit.</small>
                                </div>
                            </li>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://blogs.lse.ac.uk/politicsandpolicy/democratising-hansard/"
                                    title="See more">
                                    <h6 class="my-0">Blog Post</h6>
                                    <small class="text-muted">Jeffries, L., De Jager, F. (2019, March 9). Democratising
                                        Hansard: continuing to improve the accessibility of parliamentary records. LSE
                                        Blog</small>
                                </div>
                            </li>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://thehistoryofparliament.wordpress.com/2019/04/01/hansard-at-huddersfield-making-democracy-more-searchable/"
                                    title="See more">
                                    <h6 class="my-0">Blog Post</h6>
                                    <small class="text-muted">Jeffries, L. (2019, April 1). Hansard at Huddersfield:
                                        Making democracy more searchable. History of Parliament Blog.</small>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>

                <div class="container sub-c" id="event">
                    <hr>
                    <div class="row">
                        <div class="col-md-12 mb-3">

                            <h4 class="d-flex justify-content-between
                            align-items-center mb-3">
                                <span id="outputs" class="text-muted">Events</span>
                            </h4>
                            <p>
                                Interested to learn what you may use
                                Hansard at Huddersfield for? Find
                                here upcoming workshops that aim to
                                demonstrate the potential of our
                                site for your research. If you
                                cannot make any of these workshops,
                                please get in touch by emailing <a href="mailto:
                                    hansard@hud.ac.uk">hansard@hud.ac.uk</a>
                                to see if we can arrange to visit
                                you and/or your organisation.
                            </p>
                        </div>
                    </div>

                    <div class="row justify-content-between">

                        <div class="col-md-12 mb-3">
                            <h4 class="d-flex justify-content-between
                                    align-items-center mb-3">
                                <span id="citing" class="text-muted">Upcoming events</span>
                            </h4>
                        </div>

                        <div class="col-md-12">

                            <div class="row mb-3 justify-content-center">
                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #6f42c1;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block text-gray-dark">Virtual Event</strong>
                                        27th January 2021</br>4-6pm</br>
                                        <a target="_blank"
                                            href="https://www.westminster.ac.uk/events/hansard-at-huddersfield-applying-corpus-search-methods-to-the-official-record-of-parliament-lesley">Online
                                            Event
                                        </a> by University of Westminister
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div class="col-md-12 mb-3">
                            <h4 class="d-flex justify-content-between
                                    align-items-center mb-3">
                                <span id="citing" class="text-muted">Past events</span>
                            </h4>
                        </div>

                        <div class="col-md-12">

                            <div class="row mb-3 justify-content-center border-top border-bottom border-gray">


                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #6f42c1;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block text-gray-dark">Workshop People's History Museum</strong>
                                        6th March 2020</br>
                                        Manchester, New Ct St, M3 3ER: People's History Museum
                                    </p>
                                </div>


                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #6f42c1;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block text-gray-dark">Workshop University of Leeds</strong>
                                        11th December 2019</br>
                                        Leeds, Baines Wing SR 1.06: University of Leeds
                                    </p>
                                </div>

                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #6f42c1;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block
				text-gray-dark">Workshop Goldsmiths</strong>
                                        19th November 2019</br>
                                        London, Margaret MacMillan Building, Goldsmiths: University of London
                                    </p>
                                </div>

                            </div>

                            <div class="row mb-3 justify-content-center border-bottom border-gray">

                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #6f42c1;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block
				text-gray-dark">Workshop British Library</strong>
                                        24th September 2019</br>
                                        London, British Library
                                    </p>
                                </div>
                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #33FF71;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block
				text-gray-dark">Launch event</strong>
                                        13th March 2019</br>
                                        Huddersfield, Heritage Quay: University of Huddersfield
                                    </p>
                                </div>
                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #33FF71;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block
				text-gray-dark">Launch event</strong>
                                        6th March 2019</br>
                                        London, House of Lords: Houses of Parliament
                                    </p>
                                </div>


                            </div>

                            <div class="row mb-3 justify-content-center border-bottom border-gray">

                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #FF5733;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block
				text-gray-dark">End-user event</strong>
                                        11th December 2018</br>
                                        Huddersfield, Oastler Building: University of Huddersfield
                                    </p>
                                </div>
                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #FF5733;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block
				text-gray-dark">End-user event</strong>
                                        6th December 2018</br>
                                        London, InTuition House
                                    </p>
                                </div>

                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #FF5733;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block
				text-gray-dark">End-user event</strong>
                                        18th July 2018</br>
                                        London, Friends House
                                    </p>
                                </div>

                            </div>

                            <div class="row mb-3 justify-content-center border-bottom border-gray">
                                <div class="media pt-3 col-4 ">
                                    <span class="mr-2"><i class="fas fa-calendar-check fa-lg"
                                            style="color: #FF5733;"></i></span>
                                    <p class="pr-3 mr-0">
                                        <strong class="d-block text-gray-dark">End-user event</strong>
                                        11th July 2018</br>
                                        Huddersfield, Oastler Building: University of Huddersfield
                                    </p>
                                </div>

                            </div>


                        </div>

                    </div>

                </div>




            </div>

            <div id="help" class="container only-one">

                <hr>

                <div class="row mb-3">
                    <div class="col-md-12">
                        <h2>Guidance</h2>
                    </div>
                </div>

                <div class="row mb-3 justify-content-center">

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="user-guide">
                        <div class="card-body">
                            <i class="fas fa-map-signs fa-5x card-icon" style="background-color: #17954c;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                User Guide
                            </h5>
                            <p class="card-text">A detailed guide to all the functionality of the Hansard at
                                Huddersfield site.</p>
                        </div>
                    </div>

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="brochure-teach">
                        <div class="card-body">
                            <i class="fas fa-book-reader fa-5x card-icon" style="background-color: #17954c;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Brochure for Teachers and Researchers
                            </h5>
                            <p class="card-text">Hansard at Huddersfield’s search functions illustrated for purposes of
                                teaching and researching socio-political topics.</p>
                        </div>
                    </div>

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="6th-form">
                        <div class="card-body">
                            <i class="fab fa-readme fa-5x card-icon" style="background-color: lightgrey;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                6th Form Guide
                                <h6 style="text-align: center;">Coming Soon</h6>
                            </h5>
                            <p class="card-text">A detailed guide to using Hansard and Hansard at Huddersfield as a
                                resource for 6th form research projects.</p>
                        </div>
                    </div>

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="videos">
                        <div class="card-body">
                            <i class="fas fa-film fa-5x card-icon" style="background-color: #17954c;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Videos
                            </h5>
                            <p class="card-text">Video descriptions guiding the user through Hansard at Huddersfield’s
                                search functions.</p>
                        </div>
                    </div>



                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="cite">
                        <div class="card-body">
                            <i class="fas fa-asterisk fa-5x card-icon" style="background-color: #17954c;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Citing Our Website
                            </h5>
                            <p class="card-text">Referencing guidance for citing Hansard at Huddersfield.</p>
                        </div>
                    </div>

                </div>

                <div class="container sub-c" id="videos">

                    <hr>

                    <div class="row">

                        <div class="col-md-12 mb-3">
                            <h4 class="d-flex justify-content-between
                                    align-items-center mb-3">
                                <span class="text-muted">Videos</span>
                            </h4>
                            <p>
                                Coming Soon
                            </p>
                        </div>

                        <div class="col-12 justify-content-center mt-2 mb-5
                        video-player">
                        </div>


                    </div>
                </div>

                <div class="container sub-c" id="cite">

                    <hr>


                    <div class="col-md-12">

                        <h4 class="d-flex justify-content-between
                            align-items-center mb-3">
                            <span id="citing" class="text-muted">Citing our
                                website</span>
                        </h4>

                        <div class="row mb-3">

                            <div class="col-md-12">
                                <p>All works which use or refer to this site
                                    should acknowledge the source by means
                                    of bibliographic
                                    citation.
                                    If you have used it in your work, please
                                    let us have details and (if possible)
                                    copies of any
                                    internal or
                                    published work drawing on the website.
                                    We are also particularly interested in
                                    hearing from you
                                    how you
                                    have used the site and for what purpose.
                                    You can contact us on <a href="mailto: hansard@hud.ac.uk">hansard@hud.ac.uk</a>.
                                </p>
                            </div>
                        </div>

                        <div class="row mb-3 d-flex justify-content-end">
                            <div class="col-md-11">
                                <p> – If you would like to use a <b> figure
                                    </b> or <b>other data</b> that you have
                                    downloaded from
                                    our site, please use the following
                                    citation
                                    format:
                                </p>
                                <div class="d-flex justify-content-center">
                                    <div class="col-md-11">
                                        <p class="text-monospace">
                                            Author (Date). “Search word(s),
                                            years” [Figure]. Publisher.
                                            Available online at: Website
                                            Title.
                                        </p>
                                    </div>
                                </div>

                                <p class="font-weight-normal ml-2">Example:</p>
                                <div class="d-flex justify-content-center">
                                    <div class="col-md-11">
                                        <img src="img/citation-example.png" class="img-fluid" alt="Responsive image">
                                    </div>
                                </div>

                                <div class="d-flex justify-content-center">
                                    <div class="col-md-9 mt-2">
                                        <p class="text-monospace
                                            text-center">Hansard at
                                            Huddersfield (2019). “Charity,
                                            1803-2004”
                                            [Figure]. University of
                                            Huddersfield. Available from: <a
                                                href="https://hansard.hud.ac.uk">https://hansard.hud.ac.uk</a>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mb-3 d-flex justify-content-end">
                            <div class="col-md-11">
                                <p> – When citing the <b>entire website</b>
                                    in-text, please give the whole address
                                    of our site:</p>

                                <p class="font-weight-normal ml-2">Example:</p>
                                <div class="d-flex justify-content-center">
                                    <div class="col-md-9 mt-2">
                                        <p class="text-monospace
                                            text-center">
                                            Hansard at Huddersfield is a
                                            wonderful interactive site to
                                            study the language of
                                            parliament
                                            (<a href="https://hansard.hud.ac.uk">https://hansard.hud.ac.uk</a>).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mb-3 d-flex justify-content-end">
                            <div class="col-md-11">
                                <p> – The citation format for <b>footnotes</b>
                                    or the <b>reference section</b> of
                                    publications is:
                                </p>
                                <div class="d-flex justify-content-center">
                                    <div class="col-md-11">
                                        <p class="text-monospace">
                                            Author, (Date). Title.
                                            Publisher. Available online at:
                                            Website title.
                                        </p>
                                    </div>
                                </div>

                                <p class="font-weight-normal ml-2">Example:</p>
                                <div class="d-flex justify-content-center">
                                    <div class="col-md-9 mt-2">
                                        <p class="text-monospace
                                            text-center">Hansard at
                                            Huddersfield Project (2018).
                                            ‘Hansard at
                                            Huddersfield’. University of
                                            Huddersfield.
                                            Available online at: <a
                                                href="https://hansard.hud.ac.uk">https://hansard.hud.ac.uk</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="illustrations" class="container only-one">
                <hr>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <h2>Illustrations</h2>
                    </div>
                </div>

                <div class="row mb-3 justify-content-center">

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="case-studies">
                        <div class="card-body">
                            <i class="fas fa-chalkboard fa-5x card-icon" style="background-color: #66acb4;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Case Studies
                            </h5>
                            <p class="card-text">Simple sample studies that illustrate how search functions can be
                                combined into a larger study.</p>
                        </div>
                    </div>

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="others">
                        <div class="card-body">
                            <i class="fas fa-university fa-5x card-icon" style="background-color: #66acb4;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Others using Hansard at Huddersfield
                            </h5>
                            <p class="card-text">Representative use of Hansard at Huddersfield tools by policymakers,
                                researchers, and journalists</p>
                        </div>
                    </div>
                </div>


                <div class="container sub-c" id="case-studies">

                    <hr>

                    <div class="row mb-3">

                        <div class="col-md-12">
                            <h4 class="d-flex justify-content-between
                                align-items-center mb-3">
                                <span id="team" class="text-muted">Case Studies</span>
                            </h4>
                            <p>
                                Download here a number of sample case studies that exemplify the different ways this
                                site’s
                                tools may be used and their results interpreted to help answer research questions about
                                the
                                way parliamentarians discuss topics relevant to their governance of the UK.
                            </p>
                            <p>
                                We are working on developing the range of topics covered in these case studies. If you
                                would
                                like to suggest a topic, please get in touch on <a href="mailto:
                                    hansard@hud.ac.uk">hansard@hud.ac.uk</a>.
                            </p>
                        </div>
                    </div>

                    <div class="row mb-3 justify-content-center">

                        <div class="col-md-2">
                            <div class="media pt-3 case_study">
                                <span class="badge badge-pill mr-2 px-2 py-2" data-function="Austerity.pdf"
                                    title="Download Austerity case study"
                                    style="background-color:#007bff; color:white"><i
                                        class="fas fa-file-download fa-lg"></i></span>
                                <p class="media-body pb-3 mb-0 lh-125 ">
                                    Austerity
                                </p>
                            </div>
                        </div>

                        <div class="col-md-2">
                            <div class="media pt-3 case_study">
                                <span class="badge badge-pill mr-2 px-2 py-2" data-function="Peterloo.pdf"
                                    title="Download Peterloo case study"
                                    style="background-color:#e83e8c; color:white"><i
                                        class="fas fa-file-download fa-lg"></i></span>
                                <p class="media-body pb-3 mb-0 lh-125 ">
                                    Peterloo
                                </p>
                            </div>
                        </div>

                        <div class="col-md-2">
                            <div class="media pt-3 case_study">
                                <span class="badge badge-pill mr-2 px-2 py-2" data-function="Slavery.pdf"
                                    title="Download Slavery case study" style="background-color:#6f42c1; color:white"><i
                                        class="fas fa-file-download fa-lg"></i></span>
                                <p class="media-body pb-3 mb-0 lh-125 ">
                                    Slavery
                                </p>
                            </div>
                        </div>


                        <div class="col-md-2">
                            <div class="media pt-3 case_study">
                                <span class="badge badge-pill mr-2 px-2 py-2" data-function="Brexit.pdf"
                                    title="Download Brexit case study" style="background-color:#ffc107; color:white"><i
                                        class="fas fa-file-download fa-lg"></i></span>
                                <p class="media-body pb-3 mb-0 lh-125 ">
                                    Brexit
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="container sub-c" id="others">

                    <hr>
                    <div class="row">
                        <h4 class="d-flex justify-content-between
                        align-items-center mb-3">
                            <span id="outputs" class="text-muted">Others Using Hansard at Huddersfield</span>
                        </h4>


                        <ul class="list-group mb-3 othershan">

                            <h5>Academic Articles and Conference Proceedings</h5>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://www.southampton.ac.uk/~assets/doc/Emergence%20Volume%20X%20-%20Tradition%20vs.%20Innovation.pdf"
                                    title="See more">
                                    <h6 class="my-0">Research Journal</h6>
                                    <small class="text-muted">
                                        Brinkley, L. (2018). Innovation versus Tradition in Historical Research Methods:
                                        The ‘Digital Turn’. Emergence X, 34-48
                                    </small>
                                </div>
                            </li>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://www.tandfonline.com/doi/full/10.1080/13572334.2020.1726635"
                                    title="See more">
                                    <h6 class="my-0">Journal Article</h6>
                                    <small class="text-muted">
                                        McKay, L. (2020). Does constituency focus improve attitudes to MPs? A test for
                                        the UK. The Journal of Legislative Studies 26(1), 1-26, DOI:
                                        10.1080/13572334.2020.1726635
                                    </small>
                                </div>
                            </li>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub" data-url="https://www.aclweb.org/anthology/2020.parlaclarin-1.5.pdf"
                                    title="See more">
                                    <h6 class="my-0">Conference Presentation</h6>
                                    <small class="text-muted">Coole, M., Rayson, P., Mariani, J. (2020). Unfinished
                                        Business: Construction and Maintenance of a Semantically Tagged Historical
                                        Parliamentary Corpus, UK Hansard from 1803 to the present day. Proceedings of
                                        ParlaCLARIN II Workshop, Language Resources and Evaluation Conference (LREC
                                        2020), Marseille, 23-27.</small>
                                </div>
                            </li>


                            <h5>Blogs</h5>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://hansardhud.edublogs.org/2020/07/02/using-hansard-at-huddersfield-for-historical-research-the-spanish-flu-of-1918/"
                                    title="See more">
                                    <h6 class="my-0">Blog Post</h6>
                                    <small class="text-muted">Hart, G. (2020, July 2). Using Hansard at Huddersfield for
                                        Historical Research: The Spanish Flu of 1918. Hansard at Huddersfield.</small>
                                </div>
                            </li>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="http://alsatia.org.uk/site/2019/10/resource-cobbetts-parliamentary-history/"
                                    title="See more">
                                    <h6 class="my-0">Blog Post</h6>
                                    <small class="text-muted">Levin, J. (2019, October 8). Resource: Cobbett’s
                                        Parliamentary History. Alsatia.</small>
                                </div>
                            </li>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://historyofpublicspace.uk/history/definitions-and-typologies-of-public-space/"
                                    title="See more">
                                    <h6 class="my-0">Blog Post</h6>
                                    <small class="text-muted">Navickas, K. (N.D.) Definitions of Public Space. History
                                        of Public Space.</small>
                                </div>
                            </li>

                            <h5>News Outlets</h5>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://bylinetimes.com/2021/02/12/ur-fascism-the-parliamentary-language-that-defines-the-uk/"
                                    title="See more">
                                    <h6 class="my-0">News Article</h6>
                                    <small class="text-muted">Overton, I. (2021, February 12). UR-FASCISM? The
                                        Parliamentary Language that Defines the UK. Byline Times.</small>
                                </div>
                            </li>

                            <h5>Presentations</h5>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub" title="See more">
                                    <h6 class="my-0">Presentation</h6>
                                    <small class="text-muted">Navickas, K. (2019). "'Right of Public Meeting' in
                                        Hansard" [PowerPoint Slide]. Paper presented at "Remembering Peterloo: protest,
                                        satire and reform", London, 11 July 2019</small>
                                </div>
                            </li>

                            <h5>Website Links</h5>

                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub" data-url="https://victoriancommons.wordpress.com/resources/"
                                    title="See more">
                                    <h6 class="my-0">Victorian Commons</h6>
                                </div>
                            </li>
                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub"
                                    data-url="https://archives.parliament.uk/online-resources/parliamentary-debates-hansard/"
                                    title="See more">
                                    <h6 class="my-0">Parliamentary archives</h6>
                                </div>
                            </li>
                            <li class="list-group-item d-flex
                            justify-content-between lh-condensed" style="cursor:pointer;">
                                <div class="pub" data-url="https://www.clarin.ac.uk/hansard-huddersfield#/"
                                    title="See more">
                                    <h6 class="my-0">Clarin UK consortium</h6>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>


            </div>
            </div>

            <div id="about_us" class="container only-one">


                <hr>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <h2>About us</h2>
                    </div>
                </div>
                <div class="row mb-3">

                    <div class="col-md-12">
                        <p>
                            With joint expertise in linguistics, computer science and history, our team has worked since
                            March
                            2018 to produce an accessible site with search tools that aid the straightforward
                            exploration
                            and
                            interpretation of overarching trends and patterns in Hansard. We adapted expert software to
                            study
                            language patterns in large databases of text by combining some of its most common tools with
                            interactive visualisations, aiming to help non-linguists mine the data’s potential without
                            needing
                            to master complex software packages
                        </p>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <!-- between -->


                    <div class="col-md-3 mb-4">
                        <h4 class="d-flex  mb-3">
                            <span id="team" class="text-muted">The Team</span>
                        </h4>
                        <ul class="list-group mb-3">
                            <li id="lesley" title="See more" class="list-group-item d-flex
                                    justify-content-between lh-condensed">
                                <div>
                                    <h6 class="my-0">Lesley Jeffries</h6>
                                    <small class="text-muted">Principal
                                        Investigator</small>
                                </div>
                            </li>
                            <li id="marc" title="See more" class="list-group-item d-flex
                                    justify-content-between lh-condensed">
                                <div>
                                    <h6 class="my-0">Marc Alexander</h6>
                                    <small class="text-muted">Co-investigator
                                        (SAMUELS)</small>
                                </div>
                            </li>
                            <li id="alex" title="See more" class="list-group-item d-flex
                                    justify-content-between lh-condensed">
                                <div>
                                    <h6 class="my-0">Alex von Lunen</h6>
                                    <small class="text-muted">Co-Investigator
                                        (Technical lead)</small>
                                </div>
                            </li>
                            <li id="hugo" title="See more" class="list-group-item d-flex
                                    justify-content-between lh-condensed">
                                <div>
                                    <h6 class="my-0">Hugo
                                        Sanjurjo-González</h6>
                                    <small class="text-muted">Research
                                        Fellow (Programmer) <br>(2018-2020)</small>
                                </div>
                            </li>
                            <li id="fransina" title="See more" class="list-group-item d-flex
                                    justify-content-between lh-condensed">
                                <div>
                                    <h6 class="my-0">Fransina Stradling</h6>
                                    <small class="text-muted">Research
                                        Assistant</small>
                                </div>
                            </li>
                            <li id="paul" title="See more" class="list-group-item d-flex
                                    justify-content-between lh-condensed">
                                <div>
                                    <h6 class="my-0">Paul Crossley</h6>
                                    <small class="text-muted">Programmer <br>(2021-Present)</small>
                                </div>
                            </li>
                        </ul>

                    </div>
                    <!--

                    <div class="col-md-6">
                        <h4 class="d-flex justify-content-between
                                align-items-center mb-3">
                            <span id="acknowledgements" class="text-muted">Acknowledgements</span>
                        </h4>
                        <div class="row">


                            <div class="col-md-6">

                                <ul class="list-group mb-3">
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                        data-url="https://gtr.ukri.org/projects?ref=AH%2FR007136%2F1">
                                        <div>
                                            <h6 class="my-0">Arts and
                                                Humanities Research
                                                Council (AHRC)</h6>
                                            <small class="text-muted">Funder</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                        data-url="https://gtr.ukri.org/projects?ref=AH%2FL010062%2F1">
                                        <div>
                                            <h6 class="my-0">SAMUELS</h6>
                                            <small class="text-muted">Predecessor</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://hansard.parliament.uk/">
                                        <div>
                                            <h6 class="my-0">Hansard</h6>
                                            <small class="text-muted">Provided
                                                Hansard data</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                        data-url="https://www.wikidata.org/wiki/Wikidata:WikiProject_British_Politicians">
                                        <div>
                                            <h6 class="my-0">Wikidata
                                                British Politicians</h6>
                                            <small class="text-muted">Provided
                                                MP data</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                        data-url="https://www.wikidata.org/wiki/Wikidata:Main_Page">
                                        <div>
                                            <h6 class="my-0">Andrew Gray
                                                (Wikidata)</h6>
                                            <small class="text-muted">Provided
                                                MP data</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://pure.hud.ac.uk/en/persons/andy-mycock">
                                        <div>
                                            <h6 class="my-0">Dr Andy
                                                Mycock</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://cnduk.org/">
                                        <div>
                                            <h6 class="my-0">Campaign
                                                for Nuclear Disarmament</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://disability-studies.leeds.ac.uk/">
                                        <div>
                                            <h6 class="my-0">Centre for
                                                Disability Studies</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="http://www.democraticaudit.com/">
                                        <div>
                                            <h6 class="my-0">Democratic
                                                Audit</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.equalityhumanrights.com/en">
                                        <div>
                                            <h6 class="my-0">Equality
                                                and Human Rights
                                                Commission</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://twitter.com/gavinhart10">
                                        <div>
                                            <h6 class="my-0">Dr Gavin
                                                Hart</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="http://heritagequay.org/">
                                        <div>
                                            <h6 class="my-0">Heritage
                                                Quay</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="http://www.historyofparliamentonline.org/">
                                        <div>
                                            <h6 class="my-0">History of
                                                Parliament</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                </ul>


                            </div>

                            <div class="col-md-6">

                                <ul class="list-group mb-3">

                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://commonslibrary.parliament.uk/">
                                        <div>
                                            <h6 class="my-0">House of
                                                Commons Library</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.instituteforgovernment.org.uk/">
                                        <div>
                                            <h6 class="my-0">Institute
                                                for Government</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="http://www.democracycommission.org.uk/">
                                        <div>
                                            <h6 class="my-0">Kirklees
                                                Democracy Commission</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.lkmco.org/">
                                        <div>
                                            <h6 class="my-0">LKMco</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.migrationyorkshire.org.uk/">
                                        <div>
                                            <h6 class="my-0">Migration
                                                Yorkshire</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                        data-url="https://www.parliament.uk/mps-lords-and-offices/offices/bicameral/parliamentary-digital-service/">
                                        <div>
                                            <h6 class="my-0">Parliamentary
                                                Digital Service</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.parliament.uk/post">
                                        <div>
                                            <h6 class="my-0">Parliamentary
                                                Office of Science and
                                                Technology</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://phm.org.uk/">
                                        <div>
                                            <h6 class="my-0">People’s
                                                History Museum</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.greenparty.org.uk/?q">
                                        <div>
                                            <h6 class="my-0">The Green
                                                Party</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.theosthinktank.co.uk/">
                                        <div>
                                            <h6 class="my-0">Theos</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.theyworkforyou.com/">
                                        <div>
                                            <h6 class="my-0">TheyWorkForYou</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://youngfoundation.org/">
                                        <div>
                                            <h6 class="my-0">The Young
                                                Foundation</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>
                                    <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                        data-url="https://pure.hud.ac.uk/en/persons/thomas-loughran">
                                        <div>
                                            <h6 class="my-0">Dr Thomas
                                                Loughran</h6>
                                            <small class="text-muted">End-user</small>
                                        </div>
                                    </li>

                                </ul>

                            </div>


                        </div>
                    </div>
                                -->
                    <div class="col-md-3">
                        <h4 class="d-flex justify-content-between
                                align-items-center mb-3">
                            <span id="address" class="text-muted">Contact details</span>
                        </h4>
                        <div class="row">
                            <div class="col-12">
                                <address>
                                    <strong>Hansard at Huddersfield</strong><br>
                                    Linguistics and Modern Languages<br>
                                    School of Music, Humanities and Media<br>
                                    Oastler Building, OA4/15<br>
                                    Queensgate<br>
                                    Huddersfield<br>
                                    HD1 3DH <br>
                                </address>

                                <address>
                                    <span><i class="fas fa-phone"></i></i>
                                        +44 1484472910 </span><br>
                                    <span><i class="fas fa-envelope-square"></i>
                                        <a href="mailto: hansard@hud.ac.uk">hansard@hud.ac.uk</a></span>
                                </address>
                            </div>
                        </div>
                        <div class="row">
                            <div id="map-container-google-1" class="z-depth-1-half map-container">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2365.181817525435!2d-1.7809774840597228!3d53.64373016009519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bdc7316c83381%3A0x622f032b6c8b151f!2sUniversity+of+Huddersfield!5e0!3m2!1sen!2suk!4v1554723144103!5m2!1sen!2suk"
                                    frameborder="0" style="border:0" allowfullscreen></iframe>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <div id="acknowledgements" class="container only-one">


                <hr>
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <h2>Acknowledgements</h2>
                    </div>
                </div>

                <div class="row">
                    The Hansard at Huddersfield project team has also worked closely with likely end-users from a
                    diverse group of organisations which share a professional interest in the deliberations of UK
                    parliament. We would like to thank all of our end-users for their helpful suggestions and feedback.
                    Their contributions have meant the site responds as well as possible to real-world needs.
                </div>
                <br>

                <div class="row mb-3 justify-content-center">

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="partners">
                        <div class="card-body">
                            <i class="fas fa-address-card fa-5x card-icon" style="background-color: #2f88f0"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Partners
                            </h5>
                            <p class="card-text">Significant contributors without whom various aspects of our project
                                would not have succeeded.</p>
                        </div>
                    </div>

                    <div class="card function function-hover2 card2"
                        style="width: 18rem; background-color: white; color: black;" data-function="ack2">
                        <div class="card-body">
                            <i class="far fa-smile fa-5x card-icon" style="background-color: #2f88f0;"></i>
                            <h5 class="card-title" style="
                                text-align: center;
                                padding-top: 10px;">
                                Acknowledgements
                            </h5>
                            <p class="card-text">Our thanks go out to those who have contributed data or feedback to the
                                development of our website.</p>
                        </div>
                    </div>
                </div>


                <div class="container sub-c" id="partners">

                    <hr>

                    <div class="row">
                        <h4 class="d-flex justify-content-between
                                align-items-center mb-3">
                            <span id="team" class="text-muted">Partners</span>
                        </h4>
                        Various aspects of the Hansard at Huddersfield project would not have succeeded without the
                        enthusiastic contributions of our three main partner organisations.
                    </div>
                    <br>
                    <div class="row justify-content-center">
                        <div class="row">
                            <div class="col-lg-4 text-center">
                                <div style="min-height:175px;"><img src="./img/OCR-logo.png" height="60"
                                        background="#777" color="#777" />
                                    <div class="my-3">
                                        <h4>Hellenic OCR Team</h4>
                                    </div>
                                </div>
                                <p>We are working with the <a href="https://hellenicocrteam.gr/"
                                        target="_blank">Hellenic
                                        OCR Team</a>, which is a crowd-sourced project aimed at digitising proceedings
                                    in
                                    the Greek parliament. Our Principal Investigator, Lesley Jeffries, and Hellenic OCR
                                    Team
                                    Co-Founders George Mikros and Fotis Fitsilis have agreed on the exchange of knowhow,
                                    methods and code to jointly tackle common challenges that are related not only to
                                    data
                                    openness but also to increased visibility and understanding of parliamentary data
                                    sources. Future plans resulting from this partnership may include joint conference
                                    announcements and scientific publications in the area of computational linguistics.
                                </p>
                            </div>
                            <div class="col-lg-4 text-center">
                                <div style="min-height:175px;">
                                    <img src="./img/UK_parliament-logo.png" height="60" background="#777"
                                        color="#777" />
                                    <div class="my-3">
                                        <h4>John Vice (Editor Hansard Lords) and Jack Homer (Editor Hansard Commons)
                                        </h4>
                                    </div>
                                </div>
                                <p>We have been working in partnership with Hansard in Westminster from the outset. We
                                    have
                                    had the support and cooperation of the editors and their staff in accessing the
                                    Hansard
                                    data and in developing the functionality of our site. We are also in discussion with
                                    Hansard about the future of our site.</p>
                            </div>
                            <div class="col-lg-4 text-center">

                                <div style="min-height:175px;">
                                    <img src="./img/hop-logo.png" height="60" background="#777" color="#777" />
                                    <div class="my-3">
                                        <h4>The History of Parliament Trust</h4>
                                    </div>
                                </div>
                                <p><a href="https://www.historyofparliamentonline.org/" target="_blank">The History of
                                        Parliament Trust</a> has been one of our key supporters and has communicated
                                    with
                                    its networks about the website. They have attended end-user meetings, given us
                                    feedback
                                    about the site and co-organised a workshop to introduce new end-users to the site.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="container sub-c" id="ack2">

                    <hr>

                    <h4 class="d-flex justify-content-between
                                align-items-center mb-3">
                        <span id="team" class="text-muted">Acknowledgements</span>
                    </h4>
                    <div class="row">
                        <div class="col-md-6">

                            <ul class="list-group mb-3">
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                    data-url="https://gtr.ukri.org/projects?ref=AH%2FR007136%2F1">
                                    <div>
                                        <h6 class="my-0">Arts and
                                            Humanities Research
                                            Council (AHRC)</h6>
                                        <small class="text-muted">Funder</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                    data-url="https://gtr.ukri.org/projects?ref=AH%2FL010062%2F1">
                                    <div>
                                        <h6 class="my-0">SAMUELS</h6>
                                        <small class="text-muted">Predecessor</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://hansard.parliament.uk/">
                                    <div>
                                        <h6 class="my-0">Hansard</h6>
                                        <small class="text-muted">Provided
                                            Hansard data</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                    data-url="https://www.wikidata.org/wiki/Wikidata:WikiProject_British_Politicians">
                                    <div>
                                        <h6 class="my-0">Wikidata
                                            British Politicians</h6>
                                        <small class="text-muted">Provided
                                            MP data</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                    data-url="https://www.wikidata.org/wiki/Wikidata:Main_Page">
                                    <div>
                                        <h6 class="my-0">Andrew Gray
                                            (Wikidata)</h6>
                                        <small class="text-muted">Provided
                                            MP data</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://pure.hud.ac.uk/en/persons/andy-mycock">
                                    <div>
                                        <h6 class="my-0">Dr Andy
                                            Mycock</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://cnduk.org/">
                                    <div>
                                        <h6 class="my-0">Campaign
                                            for Nuclear Disarmament</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://disability-studies.leeds.ac.uk/">
                                    <div>
                                        <h6 class="my-0">Centre for
                                            Disability Studies</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="http://www.democraticaudit.com/">
                                    <div>
                                        <h6 class="my-0">Democratic
                                            Audit</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.equalityhumanrights.com/en">
                                    <div>
                                        <h6 class="my-0">Equality
                                            and Human Rights
                                            Commission</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://twitter.com/gavinhart10">
                                    <div>
                                        <h6 class="my-0">Dr Gavin
                                            Hart</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="http://heritagequay.org/">
                                    <div>
                                        <h6 class="my-0">Heritage
                                            Quay</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="http://www.historyofparliamentonline.org/">
                                    <div>
                                        <h6 class="my-0">History of
                                            Parliament</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                            </ul>


                        </div>

                        <div class="col-md-6">

                            <ul class="list-group mb-3">

                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://commonslibrary.parliament.uk/">
                                    <div>
                                        <h6 class="my-0">House of
                                            Commons Library</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.instituteforgovernment.org.uk/">
                                    <div>
                                        <h6 class="my-0">Institute
                                            for Government</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="http://www.democracycommission.org.uk/">
                                    <div>
                                        <h6 class="my-0">Kirklees
                                            Democracy Commission</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.lkmco.org/">
                                    <div>
                                        <h6 class="my-0">LKMco</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.migrationyorkshire.org.uk/">
                                    <div>
                                        <h6 class="my-0">Migration
                                            Yorkshire</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                    data-url="https://www.parliament.uk/mps-lords-and-offices/offices/bicameral/parliamentary-digital-service/">
                                    <div>
                                        <h6 class="my-0">Parliamentary
                                            Digital Service</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.parliament.uk/post">
                                    <div>
                                        <h6 class="my-0">Parliamentary
                                            Office of Science and
                                            Technology</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://phm.org.uk/">
                                    <div>
                                        <h6 class="my-0">People’s
                                            History Museum</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.greenparty.org.uk/?q">
                                    <div>
                                        <h6 class="my-0">The Green
                                            Party</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.theosthinktank.co.uk/">
                                    <div>
                                        <h6 class="my-0">Theos</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://www.theyworkforyou.com/">
                                    <div>
                                        <h6 class="my-0">TheyWorkForYou</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack" data-url="https://youngfoundation.org/">
                                    <div>
                                        <h6 class="my-0">The Young
                                            Foundation</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>
                                <li title="See more" class="list-group-item d-flex
                                            justify-content-between
                                            lh-condensed ack"
                                    data-url="https://pure.hud.ac.uk/en/persons/thomas-loughran">
                                    <div>
                                        <h6 class="my-0">Dr Thomas
                                            Loughran</h6>
                                        <small class="text-muted">End-user</small>
                                    </div>
                                </li>

                            </ul>

                        </div>


                    </div>
                </div>


            </div>

            <div id="feedback" class="container only-one">

                <hr>

                <div class="row mb-3">
                    <div class="col-md-12">
                        <h2>Feedback</h2>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <p>Have you found any bugs or have you got any
                            other feedback on the website? We are hoping
                            to increase its
                            functionality in due course, but there are
                            some restrictions on what is possible.</p>
                        <p>You can contact us by either emailing us at
                            <a href="mailto: hansard@hud.ac.uk">hansard@hud.ac.uk</a>
                            or by
                            using the form below. We will do our best to
                            look into your feedback as soon as we can.
                        </p>
                        <p>We are particularly interested in hearing
                            from you how you have used the site and for
                            what purpose. If you
                            use it in your work, please let us have
                            details and (if possible) copies of any
                            internal or published work
                            drawing on the website.</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <textarea id="txtMsg" name="txtMsg" class="form-control" placeholder="Your message *"
                                style="width: 100%; height: 150px;"></textarea>
                            <div class="invalid-feedback">
                                Please insert a valid message.
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <input id="txtName" type="text" name="txtName" class="form-control"
                                placeholder="Your Name *" value="" />
                            <div class="invalid-feedback">
                                Please insert a valid name.
                            </div>
                        </div>
                        <div class="form-group">
                            <input id="txtEmail" type="email" name="txtEmail" class="form-control"
                                placeholder="Your Email *" value="" />
                            <div class="invalid-feedback">
                                Please insert a valid email.
                            </div>
                        </div>

                        <div class="form-group d-none">
                            <input id="txtEmail2" type="email" name="txtEmail2" class="form-control"
                                placeholder="Your Email *" value="" />
                            <div class="invalid-feedback">
                                Please insert a valid email.
                            </div>
                        </div>

                        <div class="form-group">
                            <button id="sendMessage" type="button" class="btn btn-primary">Send message</button>
                        </div>
                    </div>

                </div>


            </div>

        </section>
    </main>


    <footer class="container py-3 text-center text-muted">
        <p class="mb-1">&copy; <?php echo date("Y");?> Hansard at Huddersfield </p>
    </footer>


    <!-- Error modal: IE support -->
    <div class="modal fade" id="IE-message" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-danger">Error
                        message</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="text-danger">Please use Google
                        Chrome, Mozilla Firefox or Microsoft
                        Edge. Internet Explorer 11 and
                        earlier versions are not currently
                        supported.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn
                            btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Error modal: Work in progress -->
    <div class="modal fade" id="work-in-progress" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-danger">Coming
                        soon!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="text-danger">This feature will be
                        available soon. Apologies for the
                        inconvenience.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn
                            btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Ok modal -->
    <div class="modal fade" id="feedback-ok" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label=""><span>×</span></button>
                </div>

                <div class="modal-body">

                    <div class="thank-you-pop">
                        <span><i class="fas fa-check-square
                                    fa-9x" style="color: #51cf66;"></i></span>
                        <h1>Thank You!</h1>
                        <p>Your feedback is received and we will
                            contact you soon.</p>
                    </div>

                </div>

            </div>
        </div>
    </div>


    <!-- Error modal: Feedback already send -->
    <div class="modal fade" id="feedback-already-send" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-danger"> You
                        have already submitted a feedback </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="text-danger">You have submitted a
                        feedback recently. Please refresh your
                        web browser to send a new
                        one.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn
                            btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>



    <!-- JQuery core -->
    <script src="lib/jquery/jquery.3.3.1.min.js"></script>
    <!--<script>window.jQuery || document.write('<script src="assets/jquery-slim.min.js"><\/script>')</script> -->
    <!-- Bootstrap dependency -->
    <script src="assets/popper.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="lib/bootstrap/bootstrap.4.1.2.min.js"></script>

    <!-- JS for this site -->
    <script src="src/js/index.js"></script>

    <!-- Global site tag (gtag.js) - Google Analytics 
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-136155846-1"></script>

    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'UA-136155846-1');
    </script>
    -->

</body>

</html>