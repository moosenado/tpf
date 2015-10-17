<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\FacilityClass;

class HomeController extends Controller
{
    public function index(){

    	$FacilityClass = new FacilityClass();
    	$facility_names = $FacilityClass->getFacilityNames();

    	return view( 'home.index' )
				->with( 'facility_names', $facility_names );
    }
}