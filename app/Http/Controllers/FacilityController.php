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
    public function getFacilities(GetFacilitiesRequest $request)
    {
        $data = $request->all();

        if (Cache::store('database')->has($data['facilities']))
        {
            $facilities = Cache::store('database')->get($data['facilities']);
        }
        else
        {
            $query = new Facility();

            if (!empty($data['facilities'])) {

                $parks_data = explode(',', $data['facilities']);

                foreach($parks_data as $park) {
                    $query = $query->where(trim($park), true);
                }

                $facilities = $query->get();

                self::cacheData($data['facilities'], $facilities, 'json', 10);
            }
            else
            {
                $facilities = $query->all();

                self::cacheData($data['facilities'], $facilities, 'json', 10);
            }
        }

        $your_location   = array();
        $your_location[] = trim($data['lat']);
        $your_location[] = trim($data['lng']);

        $facilities = Facility::sortFacilitiesByDistance($facilities, $your_location);
        
    	return $facilities;
    }

    public function getFacility($id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            throw new \Exception ('Facility Not Found');
        }

        return $facility;
    }

    public function getParkImages(GetBingImagesRequest $request)
    {
        $data            = $request->all();
        $park_name       = utf8_encode($data['park']);
        $park_cache_name = str_replace("%20","_",$park_name);

        if (Cache::store('database')->has($park_cache_name))
        {
            return Cache::store('database')->get($park_cache_name);
        }
        else
        {
            $sURL = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=".$park_name."&count=20&size=medium";

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $sURL); 
            curl_setopt($ch, CURLOPT_TIMEOUT, '5'); 
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: multipart/form-data',
                'Ocp-Apim-Subscription-Key: d94b9ad51f0c422787649f57c7d68468'
            ));

            $park_image_content = curl_exec($ch);

            self::cacheData($park_cache_name, $park_image_content, 'string', 20160); // cache for two weeks

            return $park_image_content;
        }
    }

    public static function cacheData($key, $data, $type = 'json', $time)
    {
        switch ($type)
        {
            case 'json':
                $data_check = $data->isEmpty();
            break;
            case 'string':
                $data_check = empty($data);
            break;
        }
        if ($data_check) {
            throw new \Exception('Nothing matches search criteria');
        }
        else
        {
            Cache::store('database')->put($key, $data, $time);
        }
    }
}
