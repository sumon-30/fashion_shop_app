<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use App\MEmployee;
use App\MEmptype;
use App\HbAttendance;
use Validator;
use Log;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $emptypes = MEmptype::all();
        // $emp = DB::table('m_employees');
        $emp = DB::table('m_employees')
                ->select('m_employees.*','m_emptypes.name as emp_type_name')
                ->leftjoin('m_emptypes', function($join)
                {
                    $join->on('m_emptypes.id', '=', 'm_employees.emptype_id');
                })
                ->distinct('m_employees.id')
                ->where('m_employees.valid', '=', true);
        
        if($request->name!=""){
           $emp->where('m_employees.name', 'like', '%'.$request->name.'%');
               // ->orWhere('m_employees.name','like','%'.$request->name.'%');
        }
        //Log::debug((array)$emp);
        $perPages = ($request->perPages!="")? $request->perPages : 5;   
        $emp = $emp->latest()->paginate($perPages,['m_employees.id']);
        $response = [
                        'pagination' => [
                            'total' => $emp->total(),
                            'perPage' => $emp->perPage(),
                            'currentPage' => $emp->currentPage(),
                            'lastPage' => $emp->lastPage(),
                            'from' => $emp->firstItem(),
                            'to' => $emp->lastItem()
                        ],
                        'employee' => $emp,
                        'emptypes' => $emptypes
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
        $rules = array(
            'name' =>'required',
            'phoneNo' => 'required',
            'salary' => 'required'
        );
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) 
        {
            return response()->json(array('errors' => $validator->messages(), 'result' => false, 'message' => 'validation error'));
        }
        
        if($request['id']){
            $emp = MEmployee::find($request['id']);
            $code =substr($emp->emp_code,3);
            $banch = $request->get('branchStatus')+1;
            $emp->emp_code = 'K'.$banch.'-'.$code;
        }else{
            $emp = new MEmployee();
            $empCount = DB::table('m_employees')
                    ->select(DB::raw('count(*) as emp_count'))
                    ->get();
            Log::debug($empCount);
            Log::debug($empCount[0]->emp_count);
            $maxCount = $empCount[0]->emp_count+1;
            $banch = $request->get('branchStatus')+1;
            $emp->emp_code = 'K'.$banch.'-'.$maxCount;
        }
        
        $emp->name = $request->get('name');
        $emp->phone_no = $request->get('phoneNo');
        $emp->salary = $request->get('salary');
        $emp->emptype_id = $request->get('empTypeId');

            $emp = $emp->save();
            return response()->json($emp);
            
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // var_dump($id);exit;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $emp = MEmployee::find($id);
        return response()->json($emp);
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
        // $emp = MEmployee::find($id);
        // $emp->name = $request->get('name');
        // $emp->roomno = $request->get('roomno');
        // $emp->roomtype_id = $request->get('roomtype_id');
        // $emp->save();

        // return response()->json($emp);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $emp = MEmployee::find($id);
        $emp->valid = false;
        $emp->save();
        return response()->json('Successfully Deleted');
    }
}
