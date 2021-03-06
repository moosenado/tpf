<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/* INDEX */
Route::get('/', 'HomeController@index');
Route::get('/nearme', 'HomeController@index'); //redirect to homepage

/*Facilities resource calls*/
Route::get('facilities', 'FacilityController@getFacilities');
Route::get('facilities/{id}', 'FacilityController@getFacility');

/*Park Images*/
Route::get('bingimages', 'FacilityController@getParkImages');

