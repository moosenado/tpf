<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\FacilityClass;

class AjaxController extends Controller
{
    public function getParks(Request $request) {
    	
    	$park_array = $request->input( 'park_array' );

    	return $park_array;
    }
}