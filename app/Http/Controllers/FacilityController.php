<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Facility;
use App\Http\Requests\GetFacilitiesRequest;
use App\Http\Requests\GetBingImagesRequest;
use Illuminate\Support\Facades\Cache;
use URL;

class FacilityController extends Controller
{
    public function getFacilities( GetFacilitiesRequest $request )
    {
        $data = $request->all();

        if ( Cache::store('database')->has( $data['facilities'] ) )
        {
            $facilities = Cache::store( 'database' )->get( $data['facilities'] );
        }
        else
        {
            $query = new Facility();

            if ( !empty($data['facilities']) ) {

                $parks_data = explode( ',', $data['facilities'] );

                foreach( $parks_data as $park ) {
                    $query = $query->where( trim( $park ), true );
                }

                $facilities = $query->get();

                self::cacheData( $data['facilities'], $facilities, 'json', 10 );
            }
            else
            {
                $facilities = $query->all();

                self::cacheData( $data['facilities'], $facilities, 'json', 10 );
            }
        }

        $your_location   = array();
        $your_location[] = trim( $data['lat'] );
        $your_location[] = trim( $data['lng'] );

        $facilities = Facility::sortFacilitiesByDistance( $facilities, $your_location );

    	return $facilities;
    }

    public function getFacility( $id )
    {
        $facility = Facility::find( $id );

        if ( !$facility ) {
            throw new \Exception ( 'Facility Not Found' );
        }

        return $facility;
    }

    public function getParkImages( GetBingImagesRequest $request )
    {
        $data            = $request->all();
        $park_name       = utf8_encode( $data['park'] );
        $park_cache_name = str_replace( "%20","_",$park_name );

        if ( Cache::store( 'database' )->has( $park_cache_name ) )
        {
            return Cache::store( 'database' )->get( $park_cache_name );
        }
        else
        {
            $url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
            $url.= '&api_key=d9a424d6ab4edd6d73b1b05baf3c40dd';
            $url.= '&sort=relevance';
            $url.= '&text='.$park_name;
            $url.= '&per_page=20';
            $url.= '&format=json';
            $url.= '&nojsoncallback=1';

            //set photo array from flikr

            $response = json_decode(file_get_contents($url));
            $photo_array = $response->photos->photo;
            $photo_urls = array();

            foreach($photo_array as $single_photo) {
                $farm_id = $single_photo->farm;
                $server_id = $single_photo->server;
                $photo_id = $single_photo->id;
                $secret_id = $single_photo->secret;

                $title = $single_photo->title;

                $photo_url = 'https://farm'.$farm_id.'.staticflickr.com/'.$server_id.'/'.$photo_id.'_'.$secret_id.'.'.'jpg';

                array_push($photo_urls, $photo_url);
            }

            self::cacheData( $park_cache_name, $photo_urls, 'string', 43800 ); // cache for one month
            return $photo_urls;

            // $sURL = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=".$park_name."&count=20&size=medium";

            // $ch = curl_init();
            // curl_setopt( $ch, CURLOPT_URL, $sURL );
            // curl_setopt( $ch, CURLOPT_TIMEOUT, '5' );
            // curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
            // //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            // curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
            //     'Content-Type: multipart/form-data',
            //     'Ocp-Apim-Subscription-Key: d94b9ad51f0c422787649f57c7d68468'
            // ) );

            // $park_image_content = curl_exec( $ch );
            // $park_image_content = json_decode( $park_image_content );
            // $count = 0;

            // foreach($park_image_content->value as $result) {
            //     $park_image_content->value[$count]->contentUrl = preg_replace("/^http:/i", "https:", $result->contentUrl);
            //     $count++;
            // }

            // $http_status = curl_getinfo( $ch, CURLINFO_HTTP_CODE );

            // if( $http_status != 200 )
            // {
            //     return $http_status;
            // }
            // else
            // {
                // $park_image_content = json_encode( $park_image_content );
                // self::cacheData( $park_cache_name, $park_image_content, 'string', 43800 ); // cache for one month
                // return $park_image_content;
            // }
        }
    }

    public static function cacheData( $key, $data, $type = 'json', $time )
    {
        switch ( $type )
        {
            case 'json':
                $data_check = $data->isEmpty();
            break;
            case 'string':
                $data_check = empty($data);
            break;
        }
        if ( $data_check ) {
            throw new \Exception( 'Nothing matches search criteria' );
        }
        else
        {
            Cache::store( 'database' )->put( $key, $data, $time );
        }
    }
}
