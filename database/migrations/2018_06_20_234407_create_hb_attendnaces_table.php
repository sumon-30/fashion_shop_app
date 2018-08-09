<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHbAttendnacesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hb_attendances', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('emp_id');
            $table->foreign('emp_id')->references('id')->on('m_employees');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('hb_users');
            $table->dateTime('attendance_date');
            $table->tinyInteger('attendance_status')->comment("0 :Full ,1:half");
            $table->boolean('valid') ->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('hb_attendances');        
    }
}
