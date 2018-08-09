<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MEmployee extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name','phone_no','salary','valid'
    ];
}
