<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class NewFacilityTableYo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('postal_code')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('longitude')->nullable();
            $table->string('latitude')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');
            $table->timestamp('deleted_at');

            $table->boolean('pool')->default(false);
            $table->boolean('fire_pit')->default(false);
            $table->boolean('multipurpose_room')->default(false);
            $table->boolean('outdoor_rink')->default(false);
            $table->boolean('kitchen')->default(false);
            $table->boolean('outdoor_dry_pad')->default(false);
            $table->boolean('park_shelter')->default(false);
            $table->boolean('sport_field')->default(false);
            $table->boolean('ball_diamond')->default(false);
            $table->boolean('dressing_room')->default(false);
            $table->boolean('gymnasium')->default(false);
            $table->boolean('fitness_room')->default(false);
            $table->boolean('dog_park')->default(false);
            $table->boolean('pre_school_room')->default(false);
            $table->boolean('indoor_track')->default(false);
            $table->boolean('splash_pad')->default(false);
            $table->boolean('clubhouse')->default(false);
            $table->boolean('stage')->default(false);
            $table->boolean('skateboard_park')->default(false);
            $table->boolean('game_room')->default(false);
            $table->boolean('outdoor_track')->default(false);
            $table->boolean('computer_training_room')->default(false);
            $table->boolean('play_ground')->default(false);
            $table->boolean('amphitheatre')->default(false);
            $table->boolean('auditorium')->default(false);
            $table->boolean('coat_check_room')->default(false);
            $table->boolean('craft_room')->default(false);
            $table->boolean('curling_rink')->default(false);
            $table->boolean('farm')->default(false);
            $table->boolean('gallery')->default(false);
            $table->boolean('indoor_dry_pad')->default(false);
            $table->boolean('indoor_rink')->default(false);
            $table->boolean('proshop')->default(false);
            $table->boolean('stadium')->default(false);
            $table->boolean('wading_pool')->default(false);

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('facilities');
    }
}
