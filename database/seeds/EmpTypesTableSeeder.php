<?php

use Illuminate\Database\Seeder;

class EmpTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('m_emptypes')->insert([
            'name' => 'manager',
            'leave_day' => '2'
        ]);
    }
}
