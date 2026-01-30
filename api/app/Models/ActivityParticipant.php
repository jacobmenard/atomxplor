<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id', 'user_id', 'correct_activity_answers', 'incorrect_activity_answers', 'activity_items'
    ];
}
