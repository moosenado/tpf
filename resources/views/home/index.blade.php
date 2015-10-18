@extends ('layouts.header')

<div class="col-md-12">

	<div class="row">

		<header>
			<h1 class="text-center"> Toronto Park Locator </h1>
		</header>

	</div>

	<div class="row">

		<nav class="park-nav">

			<ul id="park-list">
				<li id="park-0" class="li-bg" data-parkval="allparks"> <p> Find All Parks Near Me </p> </li>

				<h2 class="text-center"> Custom Park Search </h2>
				<h3 class="text-center"> Choose from the list of facilities below </h3>


				@foreach($facilities as $park)


					<li id="{{ $park->park_id }}" class="li-bg" data-parkval="{{ $park->$park_val }}" data-parkvaloffish="{{ $park->facility }}" data-selected="0">
						<p> {{ $park->facility }}</p>
					</li>
				

				@endforeach
			</ul>

		</nav>

	</div>

</div>

@extends('layouts.footer')