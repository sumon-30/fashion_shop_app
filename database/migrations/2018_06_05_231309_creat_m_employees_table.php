<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatMEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_employees', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('emp_code');
            $table->integer('phone_no');
            $table->integer('salary');
            $table->unsignedInteger('emptype_id');

            $table->foreign('emptype_id')->references('id')->on('m_emptypes');
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
        Schema::dropIfExists('m_employees');        
    }
}
