<?php

namespace App\Models;

use App\Models\User;
use App\Models\Questionaire;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'items', 'time_started', 'time_ended', 'activity_action', 'title'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function questionaires() {
        return $this->hasMany(Questionaire::class);
    }
}
