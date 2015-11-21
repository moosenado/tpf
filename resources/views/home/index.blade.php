@extends ('layouts.header')

<div class="col-md-12">

	<div class="row">

		<header>
			<h1 class="text-center"> Toronto Park Locator </h1>
		</header>

	</div>

	<div class="row">

		<nav class="park-nav">

			<ul id="parks-find">
				<li id="find-all" class="li-bg">
					<p> Find All Parks Near Me </p>
				</li>
			</ul>

			<h2 class="text-center"> Custom Park Search </h2>
			<h3 class="text-center"> Choose from the list of facilities below </h3>

			<ul id="park-list">

				@foreach( $facilities as $park )

					<li id="{{ $park->park_id }}" class="li-bg" data-parkval="{{ $park->park_val }}" data-parkvaloffish="{{ $park->facility }}" data-selected="0">
						<p> {{ $park->facility }} </p>
						<object class="svg-check" type="image/svg+xml" data="https://upload.wikimedia.org/wikipedia/commons/7/71/Ok_sign_font_awesome.svg"></object>
					</li>

				@endforeach

			</ul>

		</nav>

	</div>

</div>

<div id="park-reset-btn" class="reset-btn"> <i class="fa fa-refresh"></i> </div>
<div class="reset-btn-shadow"></div>
<div id="park-find-btn" class="fire-btn"> GO </div>
<div class="fire-btn-shadow"></div>

@extends('layouts.footer')