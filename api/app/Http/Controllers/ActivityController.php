<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Question;
use App\Models\Questionaire;
use Illuminate\Http\Request;
use App\Models\ActivityParticipant;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ActivityRequest;
use App\Http\Resources\ActivityResources;
use App\Http\Resources\ActivityParticipantResource;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Activity $activity)
    {
        //
        $user = Auth::user();

        $activities = $activity->where('user_id', $user->id)
                                ->orderBy('time_started', 'desc')
                                ->get();

        return ActivityResources::collection($activities);
    }

    public function dashboard(Activity $activity, Question $question) {

        try {
            $user = Auth::user();
            $overview = [
                'total_activities' => $activity->where('user_id', $user->id)->count(),
                'total_ongoing_activities' => $activity->where('user_id', $user->id)->whereNot('activity_action', 'done')->count(),
                'total_done_activities' => $activity->where('user_id', $user->id)->where('activity_action', 'done')->count(),
                'ongoing_activities' => ActivityResources::collection($activity->where('user_id', $user->id)->where('activity_action', 'started')->get()),
            ];

            return success($overview, '');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }

    }

    public function publicActivityList(Activity $activity) {
        

        $activities = $activity->orderBy('time_started', 'desc')
                                ->get();

        return ActivityResources::collection($activities);

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
    public function store(ActivityRequest $request, Activity $activity, Question $question, Questionaire $questionaire)
    {
        //
        try {
            $user = Auth::user();

            $totalActivities = $question->questionsCount();

            if ($totalActivities >= $request->items) {
            
                $saveActivity = $activity->create([
                    'user_id' => $user->id,
                    'items' => $request->items,
                    'time_started' => $request->time_started,
                    'time_ended' => $request->usertime_ended_id,
                    'activity_action' => $request->activity_action,
                    'title' => $request->title,
                ]);

                $questions = $question->inRandomOrder()->limit($request->items)->get();

                foreach ($questions as $question) {
                    $questionaire->create([
                        'activity_id' => $saveActivity->id,
                        'question_id' => $question->id
                    ]);
                }

                return success($saveActivity, 'Activity successfully created');
            } else {
                return error(null, 'Error, requested items are greater than the question stored.');
            }

            
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }

        
    }

    /**
     * Display the specified resource.
     */
    public function show($id, Activity $activity)
    {
        //
        $activityObject = $activity->find($id);

        if ($activityObject) {
            return success(new ActivityResources($activityObject), 'Activity found');
        } else {
            return error(null, 'Activity not found');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Activity $activity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Activity $activity)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Activity $activity)
    {
        //
    }

    public function getObject($id, Activity $activity) {
        try {
            $activityObject = $activity->find($id);

            if ($activityObject) {
                return success(new ActivityResources($activityObject), 'Activity found');
            } else {
                return error(null, 'Activity not found');
            }
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }

    public function studentParticipantsList(Request $request, ActivityParticipant $activityParticipant) {
        try {
            $students = $activityParticipant->where('activity_id', $request->activity)->get();

            return success(ActivityParticipantResource::collection($students), 'Students found');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }

    public function studentParticipantsAction(Request $request, Activity $activity) {
        try {
            $action = '';
            if ($request->activity_action == '') {
                return error(null, 'Action is required');
            }
            $activity->where('id', $request->activity_id)->update([
                'activity_action' => $request->activity_action
            ]);

            return success(null, 'Activity action updated');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }
}
