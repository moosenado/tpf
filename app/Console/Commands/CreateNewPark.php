<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Facility;

class CreateNewPark extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:new-parks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $old_facilities = \DB::table('parksdata')->get();
        $new_facility_count = 0;

        foreach($old_facilities as $old_facility) {
            $new_facility = Facility::where('name', $old_facility->parkname)->first();
            if (!$new_facility) {
                $new_facility = new Facility();
                $new_facility->name = $old_facility->parkname;
                $new_facility->postal_code = $old_facility->postalcode;
                $new_facility->address = $old_facility->address;
                $new_facility->phone = $old_facility->phonenumber;
                $new_facility->longitude = $old_facility->lng;
                $new_facility->latitude = $old_facility->lat;

                $new_facility_count++;

            }

            $new_facility = $this->setFacilityType($new_facility, $old_facility->facility);
            $new_facility->save();
        }

        $this->info('found and created '.$new_facility_count.' facilities');
    }

    private function setFacilityType($new_facility, $value)
    {
        switch ($value) {
            case 'Wading Pool':
            case 'Outdoor Pool':
            case 'Indoor Pool':
                $new_facility->pool = true;
                break;

            case 'Firepit':
                $new_facility->fire_pit = true;
                break;

            case 'Playground':
                $new_facility->play_ground = true;
                break;

            case 'Multipurpose Room':
                $new_facility->multipurpose_room = true;
                break;

            case 'Outdoor Rink':
                $new_facility->outdoor_rink = true;
                break;

            case 'Kitchen':
                $new_facility->kitchen - true;
                break;

            case 'Outdoor Dry Pad':
                $new_facility->outdoor_dry_pad = true;
                break;

            case 'Park Shelter':
                $new_facility->park_shelter = true;
                break;

            case 'Sport Field':
                $new_facility->sport_field = true;
                break;

            case 'Ball Diamond':
                $new_facility->ball_diamond = true;
                break;

            case 'Dressing Room':
                $new_facility->dressing_room = true;
                break;

            case 'Gymnasium':
                $new_facility->gymnasium = true;
                break;

            case 'Fitness/Weight Room':
                $new_facility->fitness_room = true;
                break;

            case 'Dogg Off-Leash Area':
                $new_facility->dog_park = true;
                break;

            case 'Preschool Room':
                $new_facility->pre_school_room = true;
                break;

            case 'Indoor Track':
                $new_facility->indoor_track = true;
                break;

            case 'Splash Pad':
                $new_facility->splash_pad = true;
                break;

            case 'Clubhouse':
                $new_facility->clubhouse = true;
                break;

            case 'Stage':
                $new_facility->stage = true;
                break;

            case 'Skateboard Park':
                $new_facility->skateboard_park = true;
                break;

            case 'Games Room':
                $new_facility->game_room = true;
                break;

            case 'Outdoor Track':
                $new_facility->outdoor_track = true;
                break;

            case 'Computer/Training Room':
                $new_facility->computer_training_room = true;
                break;
        }
        return $new_facility;
    }

}
