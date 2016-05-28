<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\FacilityClass;

class AjaxController extends Controller
{
    public function getParks(Request $request) {
    	
    	$facility_array = $request->input( 'facility_array' );
    	$lnglat_array   = $request->input( 'lnglat_array' );
    	$all_parks      = $request->input( 'all_parks' );

    	// get array of parks - closest to furthest from user
    	$parks = FacilityClass::getParksFromSelectedFacilities( $facility_array, $lnglat_array, $all_parks );

    	return $parks;
    }
}