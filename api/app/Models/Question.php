<?php

namespace App\Models;

use App\Models\Subject;
use App\Models\QuestionItem;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'subject_id', 'question', 'answer', 'question_type'
    ];

    public function question_items() {
        return $this->hasMany(QuestionItem::class);
    }

    public function subject() {
        return $this->belongsTo(Subject::class);
    }

    public function scopeQuestionsCount($query) {
        return $query->count();
    }

    public function images() {
        return $this->hasMany(QuestionImage::class);
    }
}
