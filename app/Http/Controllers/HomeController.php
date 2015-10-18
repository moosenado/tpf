<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\FacilityClass;

class HomeController extends Controller
{
<<<<<<< HEAD
    public function index(){
    	$facilities = FacilityClass::getFacilityNames(); 
=======
    public function index() {
    	
    	$facility_names = FacilityClass::getFacilityNames(); 
>>>>>>> 6cb5dbc925203948b0795af923903a41d1d9cd09

    	return view( 'home.index' )
				->with( 'facilities', $facilities );
    }
}