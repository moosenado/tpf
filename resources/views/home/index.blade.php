@extends ('layouts.header')

<div class="col-md-12">

	<div class="row">

		<header>
			<h1 class="text-center">Toronto Park Locator</h1>
		</header>

	</div>

	<div class="row">

		<nav class="park-nav">

			<ul id="park-list">
				<li id="park-0" class="li-bg" data-parkval="allparks"> <p> All Parks </p> </li>

				<?php

				$counter = 1;

				asort( $facility_names );

				foreach ( $facility_names as $park ):

					$park_val = preg_replace( '/[^a-z]/', "", strtolower( $park->facility ) ); ?>

					<li id="park-<?php echo $counter++ ?>" class="li-bg" data-parkval="<?php echo $park_val ?>"> <p> <?php echo $park->facility ?> </p> </li>

				<?php endforeach; ?>
			</ul>

		</nav>

	</div>

</div>

@extends('layouts.footer')