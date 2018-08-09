<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MEmptype extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','leave_day'
    ];
}
