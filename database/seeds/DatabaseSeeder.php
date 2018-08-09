<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(EmpTypesTableSeeder::class);
        $this->call(MEmployeesTableSeeder::class);
        $this->call(HbUsersTableSeeder::class);
    }
}
