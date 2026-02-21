<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionItem;
use Illuminate\Http\Request;
use App\Http\Resources\QuestionResource;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Question $question)
    {
        //
        $questions = $question
                    ->orderBy('created_at', 'desc')
                    ->get();

        return success(QuestionResource::collection($questions), '');

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
    public function store(Question $question, QuestionItem $questionItem, Request $request)
    {
        //
        try {

            if (isset($request->question_items) && !count($request->question_items)) {
                return error(null, 'Question items is required.');
            }

            if ($request->question_items == null) {
                return error(null, 'Question items is required.');
            }

            $addedQuestion = $question->create([
                'subject_id' => $request->subject_id,
                'question' => $request->question,
                'answer' => $request->answer,
                'question_type' => $request->question_type,
            ]);

            foreach ($request->question_items as $item) {
                $questionItem->create([
                    'question_id' => $addedQuestion->id,
                    'question_choice' => $item['question_choice'],
                    'question_image' => $item['question_image'],
                    'question_text' => $item['question_text'],
                ]);
            }

            return success($question, 'Question successfully created');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }

        

    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($question, Request $request, Question $questions)
    {
        //
        try {   
            $questions->where('id', $question)->update([
                'subject_id' => $request->subject_id,
                'question' => $request->question,
                'answer' => $request->answer,
                'question_type' => $request->question_type,
            ]);

            return success(null, 'Question successfully updated');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($question, Request $request, Question $questions)
    {
        //
        try {
            $questions->where('id', $question)->delete();
            return success(null, 'Question successfully deleted');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }
}
