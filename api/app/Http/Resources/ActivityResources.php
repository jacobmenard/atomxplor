<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\QuestionaireResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResources extends JsonResource
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
            'user' => $this->user,
            'items' => $this->items,
            'time_started' => $this->time_started,
            'time_ended' => $this->time_ended,
            'activity_action' => $this->activity_action,
            'questionaires' => QuestionaireResource::collection($this->questionaires),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

        ];
    }
}
