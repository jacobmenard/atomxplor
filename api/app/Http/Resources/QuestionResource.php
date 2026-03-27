<?php

namespace App\Http\Resources;

use App\Http\Resources\QuestionImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'question' => $this->question,
            'question_items' => $this->question_items,
            'question_type' => $this->question_type,
            'answer' => $this->answer,
            'question_images' => QuestionImageResource::collection($this->images),
        ];
    }
}
