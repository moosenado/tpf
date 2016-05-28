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

    	for($i=0; $i<count($facility_names); $i++)
    	{
    		$facility_names[$i]->park_id = ($i);
    		$facility_names[$i]->park_val = preg_replace( '/[^a-z]/', "", strtolower( $facility_names[$i]->facility ));
    	}

    	asort( $facility_names );

    	return $facility_names;
    }

    public static function getParksFromSelectedFacilities( $facility_array = array(), $lnglat_array = array() )
    {
        return $lnglat_array;
    }
}