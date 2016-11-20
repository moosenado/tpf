@include ('layouts.header')

<main id="home-page">

	<div class="col-md-12">

		<div class="row">

			<header>
				<div class="header-cont">
					<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
						 width="281.875px" height="286.25px" viewBox="0 0 281.875 286.25" enable-background="new 0 0 281.875 286.25"
						 xml:space="preserve">
						<g>
							<path class="top-leaf-slow" d="M160,81.154c49.744-60.37,117.512-77.933,117.512-77.933S190.994,6.409,141.25,66.779
								c-28.671,34.796-14.388,74.776-14.388,74.776S131.329,115.95,160,81.154z"/>
							<path class="bottom-leaf-slow" d="M169.352,97.243c-15.939,24.421-22.234,43.886-24.697,54.599l-0.002,0c0,0-0.008,0.038-0.023,0.11
								c-0.897,3.924-1.279,6.651-1.43,8.002c-1.761,11.316-1.927,34.234,2.25,47.419c-6.244-4.514-14.422-8.648-19.358-10.4
								c-0.767-0.31-2.335-0.894-4.694-1.548c-0.043-0.012-0.066-0.019-0.066-0.019l-0.001,0.001c-6.442-1.779-18.674-4.039-36.345-2.572
								c-47.399,3.935-79.656,31.707-79.656,31.707s50.655,15.165,79.384,6.026c12.22-3.888,26.558-17.336,34.852-25.86
								c6.089,2.484,15.386,6.916,23.364,13.427c5.125,4.183,11.949,11.861,18.084,19.282c13.387,21.287,27.112,45.081,27.112,45.081
								s-22.688-56.635-27.471-81.635c-3.183-16.634-2.326-33.552-1.16-44.303c18.817-5.336,49.488-15.567,64.667-30.208
								C259.848,91.931,277.512,6.779,277.512,6.779S212.105,31.736,169.352,97.243z"/>
							<path class="top-leaf-slow" d="M120.97,182.916c0,0-17.257-19.197-44.158-13.918c-46.673,9.158-73.387,54.518-73.387,54.518
								s28.984-31.173,75.656-40.332C105.983,177.904,120.97,182.916,120.97,182.916z"/>
						</g>
					</svg>
					<h1 class="title"> TORONTO PARKS NEAR ME </h1>
					<div class="clearfix"></div>
				</div>
				<div class="clearfix"></div>
			</header>

		</div>

		<div class="row">

			<nav class="park-nav">

				<ul id="parks-find">
					<li id="find-all" class="li-bg">
						<div class="li-overlay-white"></div>
						<p> Find All Parks Near Me </p>
					</li>
				</ul>

				<div class="sub-header-cont">
					<h2 class="sub-title"> SEARCH BY FACILITY </h2>
					<h3 class="description"> Choose a combination of facilities you are looking for at a park. Then hit GO when you're ready. </h3>
				</div>

				<div class="park-list-container">

					<ul id="park-list">

						@foreach( $facilities as $facility )

							<li id="{{ $facility['id'] }}" class="li-bg" data-parkval="{{ $facility['file_name'] }}" data-parkvaloffish="{{ $facility['query_name'] }}" data-nicename="{{ $facility['nice_name'] }}" data-selected="0">
								<div class="li-overlay-white"></div>
								<p> {{ $facility['nice_name'] }} </p>
								<object class="svg-check" type="image/svg+xml" data="{{ URL::to('/') }}/images/check.svg"></object>
							</li>

						@endforeach

					</ul>

				</div>

			</nav>

		</div>

	</div>

	<div class="chosen-park-list">
		<ul>
		</ul>
	</div>

	<div id="park-reset-btn" class="reset-btn"> <i class="fa fa-refresh"></i> </div>
	<div class="reset-btn-shadow"></div>
	<div id="park-find-btn" class="fire-btn background-wave-ani"> GO </div>
	<div class="fire-btn-shadow"></div>

	<div class="loading-screen">

		<div class="overlay"></div>

		<div class="contents">

			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				 width="281.875px" height="286.25px" viewBox="0 0 281.875 286.25" enable-background="new 0 0 281.875 286.25"
				 xml:space="preserve">
				<g>
					<path class="top-leaf" d="M160,81.154c49.744-60.37,117.512-77.933,117.512-77.933S190.994,6.409,141.25,66.779
						c-28.671,34.796-14.388,74.776-14.388,74.776S131.329,115.95,160,81.154z"/>
					<path class="bottom-leaf" d="M169.352,97.243c-15.939,24.421-22.234,43.886-24.697,54.599l-0.002,0c0,0-0.008,0.038-0.023,0.11
						c-0.897,3.924-1.279,6.651-1.43,8.002c-1.761,11.316-1.927,34.234,2.25,47.419c-6.244-4.514-14.422-8.648-19.358-10.4
						c-0.767-0.31-2.335-0.894-4.694-1.548c-0.043-0.012-0.066-0.019-0.066-0.019l-0.001,0.001c-6.442-1.779-18.674-4.039-36.345-2.572
						c-47.399,3.935-79.656,31.707-79.656,31.707s50.655,15.165,79.384,6.026c12.22-3.888,26.558-17.336,34.852-25.86
						c6.089,2.484,15.386,6.916,23.364,13.427c5.125,4.183,11.949,11.861,18.084,19.282c13.387,21.287,27.112,45.081,27.112,45.081
						s-22.688-56.635-27.471-81.635c-3.183-16.634-2.326-33.552-1.16-44.303c18.817-5.336,49.488-15.567,64.667-30.208
						C259.848,91.931,277.512,6.779,277.512,6.779S212.105,31.736,169.352,97.243z"/>
					<path class="top-leaf" d="M120.97,182.916c0,0-17.257-19.197-44.158-13.918c-46.673,9.158-73.387,54.518-73.387,54.518
						s28.984-31.173,75.656-40.332C105.983,177.904,120.97,182.916,120.97,182.916z"/>
				</g>
			</svg>
			<div class="text">
				<p class="loading-text"> LOCATING </p>
			</div>

		</div>

	</div>

	<div id="location-fail" class="loading-screen-fail">
		<div class="overlay"></div>
		<p class="loading-text-fail"><strong> Still Waiting? </strong><br/> An unknown error has occured. Please refresh the page and try again. </p>
	</div>

	<div class="clearfix"></div>

</main>

<section id="find-parks-page">

	<div id="google-map" class="gmap"></div>

	<div class="park-distance-ul">
		<ul></ul>
	</div>

	<div class="park-facilities-ul">
		<ul></ul>
	</div>

	<div class="park-images-ul">

		<ul></ul>

		<div class="loading-screen-small">

			<div class="overlay"></div>

			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				 width="281.875px" height="286.25px" viewBox="0 0 281.875 286.25" enable-background="new 0 0 281.875 286.25"
				 xml:space="preserve">
				<g>
					<path class="top-leaf" d="M160,81.154c49.744-60.37,117.512-77.933,117.512-77.933S190.994,6.409,141.25,66.779
						c-28.671,34.796-14.388,74.776-14.388,74.776S131.329,115.95,160,81.154z"/>
					<path class="bottom-leaf" d="M169.352,97.243c-15.939,24.421-22.234,43.886-24.697,54.599l-0.002,0c0,0-0.008,0.038-0.023,0.11
						c-0.897,3.924-1.279,6.651-1.43,8.002c-1.761,11.316-1.927,34.234,2.25,47.419c-6.244-4.514-14.422-8.648-19.358-10.4
						c-0.767-0.31-2.335-0.894-4.694-1.548c-0.043-0.012-0.066-0.019-0.066-0.019l-0.001,0.001c-6.442-1.779-18.674-4.039-36.345-2.572
						c-47.399,3.935-79.656,31.707-79.656,31.707s50.655,15.165,79.384,6.026c12.22-3.888,26.558-17.336,34.852-25.86
						c6.089,2.484,15.386,6.916,23.364,13.427c5.125,4.183,11.949,11.861,18.084,19.282c13.387,21.287,27.112,45.081,27.112,45.081
						s-22.688-56.635-27.471-81.635c-3.183-16.634-2.326-33.552-1.16-44.303c18.817-5.336,49.488-15.567,64.667-30.208
						C259.848,91.931,277.512,6.779,277.512,6.779S212.105,31.736,169.352,97.243z"/>
					<path class="top-leaf" d="M120.97,182.916c0,0-17.257-19.197-44.158-13.918c-46.673,9.158-73.387,54.518-73.387,54.518
						s28.984-31.173,75.656-40.332C105.983,177.904,120.97,182.916,120.97,182.916z"/>
				</g>
			</svg>

		</div>

	</div>

	<div class="park-info-cont">
		<h1 id="park-info-name"></h1>
		<ul>
			<li id="park-info-address"></li>
			<li id="park-info-phonenumber"></li>
			<li id="park-info-postalcode"></li>
		</ul>
		<div id="park-info-etc">
			<i class="fa fa-compass fa-styling" aria-hidden="true"></i> <a id="directions" href="" target="_blank"> Get Directions </a>
			<img class="image-bullet-point" src="{{ URL::to('/') }}/images/uber_logo.png"/> <a id="uber" href="" target="_blank"> Get An Uber </a>
		</div>
	</div>

</section>

@include('layouts.footer')