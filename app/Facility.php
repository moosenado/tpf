<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'facilities';

    public static function sortFacilitiesByDistance( $facilities, $your_location )
    {
    	$count = count( $facilities );

    	for ( $i = 0; $i < $count; $i++ )
    	{
            $mylat  = floatval( $your_location[ 0 ] );
            $mylng  = floatval( $your_location[ 1 ] );
            $yurlat = floatval( $facilities[ $i ]->latitude );
            $yurlng = floatval( $facilities[ $i ]->longitude );

			$theta = $mylng - $yurlng;
			$dist  = sin( deg2rad( $mylat ) ) * sin( deg2rad( $yurlat ) ) + cos( deg2rad( $mylat ) ) * cos( deg2rad( $yurlat ) ) * cos( deg2rad( $theta ) );
			$dist  = acos( $dist );
			$dist  = rad2deg( $dist );

			$kilometers = $dist * 60 * 1.1515 * 0.621371192;
			$facilities[ $i ]->distance = $kilometers;
		}

		$comparison = array();
        $facilities = $facilities->ToArray();

		foreach ( $facilities as $key => $row )
		{
			$comparison[ $key ] = $row['distance'];
		}

		array_multisort( $comparison, SORT_ASC, $facilities );

		return $facilities;
    }
}
