<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\QuestionResource;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionaireResource extends JsonResource
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
            'activity_id' => $this->activity_id,
            'question_id' => $this->question_id,
            'question' => new QuestionResource($this->question),
        ];
    }
}
