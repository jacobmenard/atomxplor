<?php

namespace App\Http\Resources;

use App\Http\Resources\QuestionaireResource;
use App\Models\ActivityParticipant;
use Carbon\Carbon;
use Illuminate\Http\Request;
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
            'title' => $this->title ?? 'Untitled Activity',
            'questionaires' => QuestionaireResource::collection($this->questionaires),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'student_participants' => $this->getTotalParticipantsAttribute(),
            'activity_duration' => $this->activity_duration($this->time_started, $this->time_ended)
        ];
    }

    public function activity_duration($time_started, $time_ended) {
        if (!$time_started || !$time_ended) {
            return 'Unlimited time duration';
        } else {

            $start = Carbon::parse($time_started);

            $end = Carbon::parse($time_ended);

            $duration = $start->diffInMinutes($end);
            
            if ($duration <= 0) {
                return $duration . ' minute';
            } else {
                return $duration . ' minutes';
            }

        }
    }
}
