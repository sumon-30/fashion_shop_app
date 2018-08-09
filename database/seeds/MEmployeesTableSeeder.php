<?php

use Illuminate\Database\Seeder;
use App\MEmployee;

class MEmployeesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $hb_emptypes = DB::table('m_emptypes')->get();
        foreach( $hb_emptypes as  $hb_emptype){
            MEmployee::create(array(
                'name' => str_random(10),
                'emp_code' => 'K1-0001',
                'phone_no' => '1',
                'salary' => '100000',
                'emptype_id' => $hb_emptype->id
            ));
        }
        
    }
}
