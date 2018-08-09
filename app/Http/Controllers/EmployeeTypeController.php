<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\MEmployee;
use App\MEmptype;
use Validator;
use Log;
use DB;
class EmployeeTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $emptypes = DB::table('m_emptypes');

        
        $perPages = ($request->perPages!="")? $request->perPages : 5;   
       
        $emptypes = DB::table('m_emptypes')
            ->select('m_employees.emptype_id', 'm_emptypes.*')
            ->leftjoin('m_employees', 'm_employees.emptype_id', '=', 'm_emptypes.id')
            ->distinct('m_emptypes.id');

        if($request->name!=""){
           $emptypes->where('m_emptypes.name', 'like', '%'.$request->name.'%');
        }
         $emptypes = $emptypes->latest()->paginate($perPages,['m_emptypes.id']);
        $response = [
                        'pagination' => [
                            'total' => $emptypes->total(),
                            'perPage' => $emptypes->perPage(),
                            'currentPage' => $emptypes->currentPage(),
                            'lastPage' => $emptypes->lastPage(),
                            'from' => $emptypes->firstItem(),
                            'to' => $emptypes->lastItem()
                        ],
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
    //    dd($request['id']);exit;
        $rules = array(
            'name' =>'required',
        );
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) 
        {
            return response()->json(array('errors' => $validator->messages(), 'result' => false, 'message' => 'validation error'));
        }

        if($request['id']){
            $empType = MEmptype::find($request['id']);
            $empType->name = $request->get('name');
            $empType->leave_day = $request->get('leaveDay');
        }else{
            $empType = new MEmptype([
           'name' => $request->get('name'),
           'leave_day' => $request->get('leaveDay'),
         ]);
        }         
         $empType = $empType->save();
         return response()->json($empType);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // dd($id);exit;
        $emptypes = MEmptype::find($id);
        return response()->json($emptypes);
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
        // dd($id);exit;
        $emptypes = MEmptype::find($id)->delete();
        return response()->json($emptypes);
    }
}

