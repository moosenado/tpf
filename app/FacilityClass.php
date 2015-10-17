<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class FacilityClass extends Model
{
    public static function getFacilities( $facility, $yourlocation ){
    	// $yourlocation will be an array with [0] being lat and [1] being lng

    	$facilities = DB::table( 'parksdata' )->where( 'facility', $facility )->get();

    	$count = count ( $facilities );

    	for ( $i = 0; $i < $count; $i++ )
    	{
			$theta = $yourlocation[ 1 ] - $facilities[ $i ][ 'lng' ];
			$dist = sin( deg2rad( $yourlocation[ 0 ] ) ) * sin( deg2rad( $facilities[ $i ][ 'lat' ]) ) + cos( deg2rad( $yourlocation[ 0 ] ) ) * cos( deg2rad( $facilities[ $i ][ 'lat' ]) ) * cos( deg2rad( $theta ) );
			$dist = acos( $dist );
			$dist = rad2deg( $dist );
			$kilometers = $dist * 60 * 1.1515 * 0.621371192;
			$facilities[ $i ][ 'Distance' ] = $kilometers;
		}

		$comparison = array();

		foreach ( $facilities as $key => $row )
		{
			$comparison[ $key ] = $row[ 'Distance' ];
		}

		array_multisort( $comparison, SORT_ASC, $facilities );

		//Here we can decide to either slice the array, ie return 10 closest or take ones within x distance??
		//I'll wait to chat about it before adding either or.

		return $facilities;

    }

    public static function getFacilityNames()
    {
    	$facility_names = DB::table( 'parksdata' )
    						->select( 'facility' )
    						->distinct()
    						->get();

    	return $facility_names;
    }

    // Next steps for final view. think it can all be done in js, but not sure... may need another method here.
}