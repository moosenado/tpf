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
Route::get('/findpark', 'HomeController@index'); //redirect to homepage

/* AJAX */
Route::get('getparks', 'AjaxController@getParks');
