<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Facility;

class FacilityController extends Controller
{
    public function getFacilities(Request $request)
    {
    	$url = '/parks?facilityies=pool,firepit';

    	$parks = $reqiest->get('facilities');
    	$parks_data = explode(',' $parks);

    	$query = new Facility();

    	foreach($parks_data as $park)
    	{
    		$query += $query->where(trim($park), true);
    	}

    	$facilities = $query->get();

    	$facilities = Facility::sortFacilitiesByDistance($facilities, $your_location);

    	return $facilities;
    }
}
