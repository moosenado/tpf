<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class FacilityClass extends Model
{
    public static function getFacilities( $facilities_unsorted, $yourlocation, $all_parks ){

        $grab_all_parks = $all_parks === 'true' ? true : false; // make sure value is bool
        $init_count     = count($facilities_unsorted); // for query max count value (need to know number of facilities selected)
        $init_count     = (string)'COUNT(parkname) = ' . $init_count;

        if ( $grab_all_parks )
        {
            $facilities = DB::table( 'parksdata' )
                    ->groupBy( 'parkname' )
                    ->get();
        }
        else
        {
            if ( count( $facilities_unsorted ) > 1 )
            {
                $facilities = DB::table( 'parksdata' )
                        ->whereIn( 'facility', $facilities_unsorted )
                        ->groupBy( 'parkname' )
                        ->havingRaw( $init_count )
                        ->get();
            }
            else
            {
                $facilities = DB::table( 'parksdata' )
                        ->whereIn( 'facility', $facilities_unsorted )
                        ->get();
            }
        }

        //echo '<pre>'; print_r($facilities); echo '</pre>';

    	$count = count( $facilities );

    	for ( $i = 0; $i < $count; $i++ )
    	{
            $mylat  = floatval( $yourlocation[ 0 ] );
            $mylng  = floatval( $yourlocation[ 1 ] );
            $yurlat = floatval( $facilities[ $i ]->lat );
            $yurlng = floatval( $facilities[ $i ]->lng );

			$theta = $mylng - $yurlng;
			$dist  = sin( deg2rad( $mylat ) ) * sin( deg2rad( $yurlat ) ) + cos( deg2rad( $mylat ) ) * cos( deg2rad( $yurlat ) ) * cos( deg2rad( $theta ) );
			$dist  = acos( $dist );
			$dist  = rad2deg( $dist );

			$kilometers = $dist * 60 * 1.1515 * 0.621371192;
			$facilities[ $i ]->distance = $kilometers;
		}

		$comparison = array();

		foreach ( $facilities as $key => $row )
		{
			$comparison[ $key ] = $row->distance;
		}

		array_multisort( $comparison, SORT_ASC, $facilities );

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

    public static function getParksFromSelectedFacilities( $facilities = array(), $lnglat = array(), $all_parks = false )
    {
        $sorted_parks = self::getFacilities( $facilities, $lnglat, $all_parks );

        return $sorted_parks;
    }
}