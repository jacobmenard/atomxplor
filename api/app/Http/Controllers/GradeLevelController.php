<?php

namespace App\Http\Controllers;

use App\Models\GradeLevel;
use Illuminate\Http\Request;

class GradeLevelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(GradeLevel $gradeLevel)
    {
        return success($gradeLevel->all(), '');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, GradeLevel $gradeLevel)
    {

        if ($request->grade_level == null || $request->grade_level == '') {
            return error(null, 'Grade level is required.');
        }

        if ($gradeLevel->where('grade_level', $request->grade_level)->first()) {
            return error(null, 'Grade level already exists.');
        }

        $newGradeLevel = $gradeLevel->create([
            'grade_level' => $request->grade_level
        ]);

        return success($newGradeLevel, 'Grade level successfully created');
    }

    /**
     * Display the specified resource.
     */
    public function show(GradeLevel $gradeLevel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GradeLevel $gradeLevel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GradeLevel $gradeLevel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GradeLevel $gradeLevel)
    {
        //
    }
}
