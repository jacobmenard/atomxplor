<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserProfile extends Model
{
    use HasFactory, softDeletes;

    protected $fillable = [
        'user_id', 'first_name', 'last_name', 'gender', 'grade_level_id',
    ];

    public function grade_level() {
        return $this->belongsTo(GradeLevel::class, 'grade_level_id');
    }

    public function user_account() {
        return $this->hasOne(User::class, 'user_id');
    }
}
