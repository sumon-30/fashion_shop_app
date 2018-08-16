<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\HbAttendance;
use App\MEmployee;
use Validator;
use Carbon\Carbon;
use Log;
use DB;
use DateTime;
class DashboardController extends Controller
{
    
    public function dashboard(){
        $month= Date('m');
        $year= Date('Y');
        $end = new Carbon($year.'-'. $month.'-01');
        $enddate = $end->endOfMonth();
        $noOfDays = substr($enddate,8,2);
        $employees = DB::table('m_employees')
                ->select('m_employees.*','m_emptypes.name as emp_type_name','m_emptypes.leave_day')
                ->leftjoin('m_emptypes', function($join)
                {
                    $join->on('m_emptypes.id', '=', 'm_employees.emptype_id');
                })
                ->where('valid','=',true)
                ->get();
        $empSalary = array();
        foreach($employees as $key=>$employee){
            $currentMonth = DB::table('hb_attendances')
                    ->select(DB::raw('COUNT(hb_attendances.id) AS noOfAttendance'))
                    ->where('hb_attendances.valid', '=',true)
                    ->where('hb_attendances.emp_id', '=',$employee->id)
                    ->whereYear('hb_attendances.attendance_date', '=',$year)
                    ->whereMonth('hb_attendances.attendance_date', '=',$month)
                    ->get();
            $noOfDays = 31;
            $takeLeave = $noOfDays - $currentMonth[0]->noOfAttendance;
            
            $actualLeave = 0;
            if($takeLeave > $employee->leave_day){
                $actualLeave = $takeLeave - $employee->leave_day;
            }
            
            $net_salary = $employee->salary - (($employee->salary/$noOfDays)*$actualLeave);
            $empSalary[$employee->emp_code] = array('net_salary'=>$net_salary,
                                                    'taken_leave' =>$takeLeave
                                                );
            
        }
        $response = [
            'employees' => $employees,
            'empSalary' => $empSalary
        ];
    
        return response()->json($response);
}
}
