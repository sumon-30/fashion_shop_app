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
class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->month !='') {
            $request_date = $request->year.'-'. $request->month.'-01';
        }else{
            $month= Date('m');
            $request_date = $request->year.'-'. $month.'-01';
        } 
        //select room with pagination
        $perPages = ($request->perPages!="")? $request->perPages : 5;   
        $employees = DB::table('m_employees')
                ->select('m_employees.*','m_emptypes.name as emptype_name')
                ->leftjoin('m_emptypes', function($join)
                {
                    $join->on('m_emptypes.id', '=', 'm_employees.emptype_id');
                })
                ->latest()->paginate($perPages);

        $end = new Carbon($request_date);
        $enddate = $end->endOfMonth();
        $dd = substr($enddate,8,2);
        
        for($i = 1; $i <=  $dd; $i++)
        {
           $dates[]= str_pad($i, 2, '0', STR_PAD_LEFT);
        }
        $attendances = DB::table('hb_attendances')
                     ->select('hb_attendances.*')
                     ->leftjoin('m_employees', function($join)
                        {
                            $join->on('m_employees.id', '=', 'hb_attendances.emp_id');
                        })
                     ->leftjoin('m_emptypes', function($join)
                        {
                            $join->on('m_emptypes.id', '=', 'm_employees.emptype_id');
                        })
                     ->leftjoin('hb_users', function($join)
                        {
                            $join->on('hb_users.id', '=', 'hb_attendances.user_id');
                        })
                    ->where('hb_attendances.valid','=', true)
                    ->whereYear('hb_attendances.attendance_date', '=',$request->year)
                    ->whereMonth('hb_attendances.attendance_date', '=',$request->month)
                    ->whereIn('hb_attendances.emp_id',$employees->pluck('id'))
                    ->orderBy('attendance_date','emp_id')
                    ->get();
        
        
        $selectAtt=array();
        // $empID = "";
        // $attendancedate = "";
               
        foreach($attendances as $attendance){
                    // if($empID == $attendance->emp_id && $attendancedate ==$attendance->attendance_date){
                    //     $selectAtt[ (new DateTime($attendance->attendance_date))->format('d')."_".$attendance->emp_id]["secondBooking"]= $attendance;
                    // }else{
                       
                        // $empID = $attendance->emp_id;
                        // $attendancedate = $attendance->attendance_date;
                        $selectAtt[ (new DateTime($attendance->attendance_date))->format('d')."_".$attendance->emp_id]= $attendance;
                    // }
                }
        $response = [
            'pagination' => [
                'total' => $employees->total(),
                'perPage' => $employees->perPage(),
                'currentPage' => $employees->currentPage(),
                'lastPage' => $employees->lastPage(),
                'from' => $employees->firstItem(),
                'to' => $employees->lastItem()
            ],
            'dates'  => $dates,
            'attendances' => $selectAtt,
            'employees' => $employees
            
        ];
     
        return response()->json($response);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
    //    $rules = array(
    //     'name' =>'required',
    //     'room_status' =>'required',
    //     'price' =>'required',
    //     );
    //     $validator = Validator::make($request->all(), $rules);

    //     if ($validator->fails()) 
    //     {
    //         return response()->json(array('errors' => $validator->messages(), 'result' => false, 'message' => 'validation error'));
    //     }
        //$currentDateTime = Carbon::now();
        if(!isset($request->id)){
            $booking = new HbAttendance([
            'name' => $request->get('name'),
            'room_id' => $request->get('room_id'),
            'user_id' => $request->get('user_id'),
            'reserved_date' =>$request->get('reserved_date'),
            'price' => $request->get('price'),
            'room_status' => $request->get('room_status'),
            ]);
            
        }else{
            $booking = HbAttendance::find($request->id);
            if( $request->get('attendanceStatus') != 2){
                $booking->attendance_status = $request->get('attendanceStatus');
            }else{
                $booking->valid = '0';
            }
            
        }
        $booking = $booking->save();
        return response()->json($booking);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $booking = HbBooking::find($id);
        return response()->json($booking);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $booking = HbBooking::find($id);
        $booking->valid =false;
        $booking = $booking->save();
        return response()->json($booking);
    }
    public function setAttendance(Request $request){
        $employees = DB::table('m_employees')
                ->select('m_employees.*')
                ->where('valid','=',true)
                ->get();

        if ($request->month !='') {
            $request_date = $request->year.'-'. $request->month.'-01';
        }else{
            $month= Date('m');
            $request_date = $request->year.'-'. $month.'-01';
        } 
        

        $end = new Carbon($request_date);
        $enddate = $end->endOfMonth();
        $dd = substr($enddate,8,2);
        
        foreach($employees as $employee){
            DB::table('hb_attendances')
                ->where('emp_id', $employee->id)
                ->whereYear('hb_attendances.attendance_date', '=',$request->year)
                ->whereMonth('hb_attendances.attendance_date', '=',$request->month)
                ->delete();
            for($i = 1; $i <=  $dd; $i++)
            {
                $attendance = new HbAttendance([
                    'emp_id' => $employee->id,
                    'user_id' => $request->user_id,
                    'attendance_date' => $request->year.'-'. $request->month.'-'.$i,
                    'attendance_status' => '0',
                    ]);
                $booking = $attendance->save();
            }
        }
        return response()->json('true');
    }
}
