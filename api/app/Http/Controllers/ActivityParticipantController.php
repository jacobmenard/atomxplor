<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityParticipant;
use Illuminate\Support\Facades\Auth;

class ActivityParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ActivityParticipant $activityParticipant)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ActivityParticipant $activityParticipant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ActivityParticipant $activityParticipant)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActivityParticipant $activityParticipant)
    {
        //
    }

    public function checkAlreadyAnswered($id, ActivityParticipant $activityParticipant) {
        try {
            $user = Auth::user();

            $getActivityParticipant = $activityParticipant->where('activity_id', $id)->where('user_id', $user->id)->first();

            if (!$getActivityParticipant) { 
                $activityParticipant->create([
                    'activity_id' => $id,
                    'user_id' => $user->id,
                ]);
            }
            
            return success(null, 'You are successfully joined the activity.');

        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }
}
