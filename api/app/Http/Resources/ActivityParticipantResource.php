<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\ActivityResources;

class ActivityParticipantResource extends JsonResource
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
            'activity_id' => $this->activity->id,
            'activity' => new ActivityResources($this->activity),
            'user' => new UserResource($this->user),
            'correct_activity_answers' => $this->correct_activity_answers,
            'incorrect_activity_answers' => $this->incorrect_activity_answers,
            'activity_items' => $this->activity_items,
        ];
    }
}
