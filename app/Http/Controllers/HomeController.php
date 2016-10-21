<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Facility;
use DB;

class HomeController extends Controller
{
    public function index() {

    	$table_columns   = DB::getSchemaBuilder()->getColumnListing('facilities');
    	$facilities_init = array_slice($table_columns,10);
    	$facilities      = array();

    	foreach($facilities_init as $key => $facility)
    	{
    		$facilities[$key]['id'] = $key;
    		$facilities[$key]['file_name'] = str_replace('_', '', $facility);
    		$facilities[$key]['query_name'] = $facility;
    		$facilities[$key]['nice_name'] = ucwords(str_replace('_', ' ', $facility));
    	}

		usort($facilities, function($a, $b){
			return strcmp($a["nice_name"], $b["nice_name"]);
		});

    	return view( 'home.index', compact( 'facilities' ) );
    }
}