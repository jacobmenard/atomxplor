<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Question;
use App\Models\ActivityParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnswerController extends Controller
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
    public function show(Answer $answer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Answer $answer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Answer $answer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Answer $answer)
    {
        //
    }

    public function answer(Request $request, $id, Answer $answer, Question $question, ActivityParticipant $activityParticipant) {
        try {
            $user = Auth::user();
            
            if (count($request->answers) <= 0) {
                return error(null, 'Answers are required.');
            } else {
                $correct = 0;
                $incorrect = 0;
                $total = 0;
                
                $getActivityParticipant = $activityParticipant->where('activity_id', $id)->where('user_id', $user->id)->first();

                foreach ($request->answers as $answerData) {
                    $answer->create([
                        'user_id' => $user->id,
                        'activity_id' => $id,
                        'question_id' => $answerData['question_id'],
                        'correct_answer' => $answerData['correct_answer'],
                        'user_answer' => $answerData['user_answer'],
                    ]);

                    if ($answerData['correct_answer'] == $answerData['user_answer']) {
                        $correct++;
                    } else {
                        $incorrect++;
                    }

                    $total++;
                }
                
                if ($getActivityParticipant) {
                    $getActivityParticipant->update([
                        'correct_activity_answers' => $correct, 
                        'incorrect_activity_answers' => $incorrect,
                        'activity_items' => $total,
                    ]);
                }
            }

            $score = [
                'correct' => $correct,
                'incorrect' => $incorrect,
                'total' => $total,
            ];
            
            return success($score, 'Answers you have a score of ' . $correct . ' out of ' . $total . '');

        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }
}
