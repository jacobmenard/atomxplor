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
        return success($subject->orderBy('subject', 'asc')->get(), '');
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

            return success(null, 'Subject successfully created');
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
    public function update($subject, Request $request, Subject $subjects)
    {
        //
        try {
            if ($subjects->where('subject', $request->subject)->where('id', '!=', $request->id)->first()) {
                return error(null, 'Subject already exists.');
            }
            $subjects->where('id', $subject)->update([
                'subject' => $request->subject
            ]);

            return success(null, 'Subject successfully updated');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($subject, Request $request, Subject $subjects)
    {
        //
        try {
            $subjects->where('id', $subject)->delete();
            return success(null, 'Subject successfully deleted');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }

    }
}
