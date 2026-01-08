<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Subject $subject)
    {
        //
        return success($subject->all(), '');
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
    public function store(Request $request, Subject $subject)
    {
        //
        try {

            if ($subject->where('subject', $request->subject)->first()) {
                return error(null, 'Subject already exists.');
            }

            $subject->create([
                'subject' => $request->subject
            ]);

            return success($subject, 'Subject successfully created');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Subject $subject)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subject $subject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subject $subject)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        //
    }
}
