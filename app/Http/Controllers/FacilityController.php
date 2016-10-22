<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Facility;
use App\Http\Requests\GetFacilitiesRequest;

class FacilityController extends Controller
{
    public function getFacilities(GetFacilitiesRequest $request)
    {
        $data = $request->all();

    	$query = new Facility();
        if (!empty($data['facilities'])) {
            $parks_data = explode(',', $data['facilities']);

            foreach($parks_data as $park) {
                $query = $query->where(trim($park), true);
            }
            $facilities = $query->get();
        }
        else
        {
            $facilities = $query->all();
        }
        
    	$facilities = $query->get();

        $your_location = array();
        $your_location[] = trim($data['lat']);
        $your_location[] = trim($data['lng']);

        
        $facilities = Facility::sortFacilitiesByDistance($facilities, $your_location);

        if (!$facilities) {
            throw new \Exception('No facilities match criteria');
        }
        

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
}
