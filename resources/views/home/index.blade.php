@include ('layouts.header')

<div id="home-page">

	<div class="col-md-12">

		<div class="row">

			<header>
				<h1 class="text-center title"> TORONTO PARK LOCATOR </h1>
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

				<h2 class="text-center sub-title"> CUSTOM PARK SEARCH </h2>
				<h3 class="text-center description"> Choose a combination of facilities you are looking for at a park near you. Then hit GO when you're ready. </h3>

				<div class="park-list-container">

					<ul id="park-list">

						@foreach( $facilities as $park )

							<li id="{{ $park->park_id }}" class="li-bg" data-parkval="{{ $park->park_val }}" data-parkvaloffish="{{ $park->facility }}" data-selected="0">
								<div class="li-gradient-overlay"></div>
								<div class="li-overlay-white"></div>
								<div class="li-overlay"></div>
								<p> {{ $park->facility }} </p>
								<object class="svg-check" type="image/svg+xml" data="https://upload.wikimedia.org/wikipedia/commons/7/71/Ok_sign_font_awesome.svg"></object>
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

</div>

<div id="find-parks-page">

	<div id="google-map" class="gmap"></div>

	<div class="park-distance-ul">
		<ul></ul>
	</div>

	<div class="park-images-ul">
		<ul></ul>
	</div>

	<ul class="park-info-cont">
		<li id="park-info-name"></li>
		<li id="park-info-address"></li>
		<li id="park-info-phonenumber"></li>
		<li id="park-info-postalcode"></li>
	</ul>

</div>

@include('layouts.footer')