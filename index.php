<!doctype html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width, initial-scale=1,
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
<link rel="stylesheet"
	href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
	integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU"
	crossorigin="anonymous">

<!-- Social Buttons for Bootstrap -->
<link href="vendor/bootstrap-social.5.1.1.min.css" rel="stylesheet">


</head>

<body>

	<nav class="site-header sticky-top py-1">
		<div
			class="container header d-flex flex-column flex-md-row
                justify-content-between">
			<a class="py-2 d-inline d-md-none text-center" aria-label="Product">
				<img src=".\img\icon.jpg" width="24" height="24">
			</a> <a class="py-2 d-none d-md-inline-block" target="_blank"
				href="index.php?show=feedback" title="Email"><span
				class="far fa-envelope"></span></a> <a
				class="py-2 d-none d-md-inline-block" target="_blank"
				href="https://twitter.com/HansardHuds" title="Twitter"> <span
				class="fab fa-twitter"></span></a> <a
				class="py-2 d-none d-md-inline-block" target="_blank"
				href="https://www.instagram.com/hansardhud/" title="Instagram"><span
				class="fab fa-instagram"></span></a> <a
				class="py-2 d-none d-md-inline-block" target="_blank"
				href="https://facebook.com/hansardhud" title="Facebook"><span
				class="fab fa-facebook-square"></span></a>
		</div>
	</nav>

	<main role="main">

		<section class="intro">

			<div class="container mt-4">

				<div class="row">
					<div class="col-md-8 col-12">
						<div>
							<h1 class="main-title">
								<span class="hansard">HANSARD</span> at <span
									class="huddersfield">HUDDERSFIELD</span>
							</h1>
							<p class="lead">Welcome to Hansard at Huddersfield! Explore
                                the official, substantially verbatim report of what was
                                said in both
                                houses of Parliament between 1803-
                                <?php
                                include_once 'src/php/db/query_handler.php';

                                $sql = "SELECT max(sittingday) as upperdate FROM hansard_commons.commons";

                                $rows = query_handler::query_no_parameters($sql, "dbname=hansard");

                                $maxd = str_split(strval($rows[0]["upperdate"]), 4)[0];

                                echo $maxd;
                                ?>
                                through various
                                search functions and interactive visualisations.</p>
							<p style="color: red;">Please note this search tool is
								experimental, and therefore subject to change.</p>
							<p>
								<a class="btn btn-outline-primary btn-lg application"
									href="site.php" role="button">Go to web application &raquo;</a>
							</p>
						</div>
					</div>
					<div class="d-none d-md-inline-block col-md-4">
						<a class="twitter-timeline" data-lang="en" data-height="300"
							data-theme="light"
							href="https://twitter.com/HansardHuds?ref_src=twsrc%5Etfw">Tweets
							by HansardHuds</a>
						<script async src="https://platform.twitter.com/widgets.js"
							charset="utf-8"></script>
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
						<div class="card mb-4 text-center function"
							data-function="website">
							<div class="card-body">
								<i class="fas fa-laptop-code fa-3x" style="color: #fff;"></i>
								<p class="card-text">The Website</p>
							</div>
						</div>
					</div>

					<div class="col-md-3">
						<div class="card mb-4 text-center function"
							data-function="project">
							<div class="card-body">
								<i class="fas fa-info fa-3x" style="color: #fff;"></i>
								<p class="card-text">The Project</p>
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
						<div class="card mb-4 text-center function"
							data-function="about_us">
							<div class="card-body">
								<i class="fas fa-hands-helping fa-3x" style="color: #fff;"></i>
								<p class="card-text">About us</p>
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
                            speaker's stance towards a debate topic. Exploration of these kinds of patterns benefits
                            research by readily providing empirical evidence for the way UK MPs and Peers engage in
                            parliamentary debate.
                        </p>
					</div>
				</div>

				<div class="row mb-3 justify-content-center">

					<div class="card function function-hover2"
						style="width: 18rem; background-color: white; color: black;"
						data-function="brochure">
						<div class="card-body">
							<i class="fas fa-book-reader fa-5x card-icon"
								style="background-color: #c95c3b;"></i>
							<h5 class="card-title"
								style="text-align: center; padding-top: 10px;">Brochure</h5>
							<p class="card-text">A short, illustrative description of Hansard
								at Huddersfield's aims and search functions.</p>
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
						<p>The Hansard at Huddersfield web application offers ways of
							exploring Chamber debates from both Houses of Parliament that go
							beyond searching for individual debates. Its search functions
							produce visualisations of language patterns in Hansard across
							time, across speakers and across debate titles that would be too
							time-consuming to find manually.</p>
						<p>Created by academics with backgrounds in linguistics, history
							and computer science, the web application aims to help
							policy-makers, researchers and teachers to highlight, visualise
							and interpret trends of parliamentary debate that they cannot
							readily find using the official Hansard website. Consultation
							with likely end-users was held prior to and during the
							development of the Hansard at Huddersfield web application to
							ensure that its search tools meet real-world needs. As a result,
							Hansard at Huddersfield provides search functions that complement
							those of the official Hansard website.</p>
        				<p>The Hansard at Huddersfield project was funded by the Arts and
        					Humanities Research Council (AHRC) between 2018 and 2019; the
        					Parliamentary Data Service then funded the project between 2020 and
        					2022. We would like to thank both organizations for their support.</p>
        				<p>The Hansard at Huddersfield project team has also worked closely
        					with likely end-users from a diverse group of organisations which
        					share a professional interest in the deliberations of UK
        					parliament. We would like to thank all of our end-users for their
        					helpful suggestions and feedback. Their contributions have meant
        					the site responds as well as possible to real-world needs.</p>
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
						style="width: 18rem; background-color: white; color: black;"
						data-function="user-guide">
						<div class="card-body">
							<i class="fas fa-map-signs fa-5x card-icon"
								style="background-color: #17954c;"></i>
							<h5 class="card-title"
								style="text-align: center; padding-top: 10px;">User Guide</h5>
							<p class="card-text">A detailed guide to all the functionality of
								the Hansard at Huddersfield site.</p>
						</div>
					</div>

					<div class="card function function-hover2 card2"
						style="width: 18rem; background-color: white; color: black;"
						data-function="brochure-teach">
						<div class="card-body">
							<i class="fas fa-book-reader fa-5x card-icon"
								style="background-color: #17954c;"></i>
							<h5 class="card-title"
								style="text-align: center; padding-top: 10px;">Brochure for
								Teachers and Researchers</h5>
							<p class="card-text">Hansard at Huddersfield's search functions
								illustrated for purposes of teaching and researching
								socio-political topics.</p>
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
						<p>This site uses historic Hansard data from the <a href="http://hansard.millbanksystems.com">Millbank sytem</a> (under Crown Copyright),
						and data from 2006 onwards is taken from <a href="https://www.theyworkforyou.com/">TheyWorkForYou</a>
						(who take it from <a href="http://data.parliament.uk/membersdataplatform/default.aspx">UK Parliament's data API</a>,
						under <a href="https://www.parliament.uk/site-information/copyright/">Parliamentary Copyright</a>).</p>
						<p>The user interface created by the Hansard at Huddersfield team is released under a
						<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</a>
						license. Credit must be given to the Principal Investigator, Prof. Lesley Jeffries, and the Co-Investigator, Dr. Alexander von Lünen.</p>
					</div>
				</div>

				<div class="row justify-content-center">
					<!-- between -->


					<div class="col-md-3 mb-4">
						<h4 class="d-flex  mb-3">
							<span id="team" class="text-muted">The Team</span>
						</h4>
						<ul class="list-group mb-3">
							<li id="lesley" title="See more"
								class="list-group-item d-flex
                                    justify-content-between lh-condensed">
								<div>
									<h6 class="my-0">Lesley Jeffries</h6>
									<small class="text-muted">Principal Investigator</small>
								</div>
							</li>
							<li id="alex" title="See more"
								class="list-group-item d-flex
                                    justify-content-between lh-condensed">
								<div>
									<h6 class="my-0">Alexander von Lünen</h6>
									<small class="text-muted">Co-Investigator (Technical lead)</small>
								</div>
							</li>
							<li id="hugo" title="See more"
								class="list-group-item d-flex
                                    justify-content-between lh-condensed">
								<div>
									<h6 class="my-0">Hugo Sanjurjo-Gonzàlez</h6>
									<small class="text-muted">Research Fellow (Programmer) <br>(2018-2020)
									</small>
								</div>
							</li>
							<li id="fransina" title="See more"
								class="list-group-item d-flex
                                    justify-content-between lh-condensed">
								<div>
									<h6 class="my-0">Fransina Stradling</h6>
									<small class="text-muted">Research Assistant</small>
								</div>
							</li>
							<li id="paul" title="See more"
								class="list-group-item d-flex
                                    justify-content-between lh-condensed">
								<div>
									<h6 class="my-0">Paul Crossley</h6>
									<small class="text-muted">Programmer <br>(2021-2022)
									</small>
								</div>
							</li>
						</ul>

					</div>
				</div>
			</div>

		</section>
	</main>


	<footer class="container py-3 text-center text-muted">
		<p class="mb-1">&copy; 2022 Hansard at Huddersfield </p>
		<p xmlns:cc="http://creativecommons.org/ns#">
			This work is licensed under <a
				href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
				target="_blank" rel="license noopener noreferrer"
				style="display: inline-block;">CC BY-NC-SA 4.0<img
				style="height: 22px !important; margin-left: 3px; vertical-align: text-bottom;"
				src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img
				style="height: 22px !important; margin-left: 3px; vertical-align: text-bottom;"
				src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img
				style="height: 22px !important; margin-left: 3px; vertical-align: text-bottom;"
				src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img
				style="height: 22px !important; margin-left: 3px; vertical-align: text-bottom;"
				src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a>
		</p>
	</footer>


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