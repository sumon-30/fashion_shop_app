<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HbAttendance extends Model
{
    // protected $casts = [
	// 	'id' => 'int',
	// 	'name' => 'string',
	// 	'room_id' => 'int',
	// 	'user_id' => 'int',
	// 	'reserved_date' => 'datetime',
    //     'price' => 'int',
    //     'room_status'=> 'int',
	// ];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','emp_id','user_id','attendance_date','attendance_status'
    ];
}
