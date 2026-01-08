<?php

namespace App\Models;

use App\Models\Question;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Questionaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'id', 'activity_id', 'question_id',
    ];

    public function question() {
        return $this->belongsTo(Question::class, 'question_id', 'id');
    }
}
