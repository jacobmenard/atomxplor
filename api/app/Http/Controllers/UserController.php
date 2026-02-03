<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //

    public function studentList(Request $request, User $user, UserProfile $userProfile) {
        $search = $request->search;
        $students = $user->with('user_profile')
                    ->where('role', 'like', '%%')
                    ->whereHas('user_profile', function ($query) use ($search) {
                        $query->where('first_name', 'like', '%' . $search . '%')
                            ->orWhere('last_name', 'like', '%' . $search . '%');
                    })
                    ->get();

        return success(UserResource::collection($students), '');
        
    }

    public function newStudent(Request $request, User $user, UserProfile $userProfile) {
        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'gender' => 'required',
            'grade_level_id' => 'required',
            'student_id_number' => 'required|unique:users',
        ]);

        $fullName = $request->first_name . ' ' . $request->last_name;
        $trimName = str_replace(' ', '', $fullName);

        if ($userProfile->where('first_name', $request->first_name)->where('last_name', $request->last_name)->first()) {
            return error(null, 'Student already exists.');
        }

        $newUser = $user->create(
            [
                'name' => $fullName,
                'email' => $request->student_id_number. strtolower($trimName) . '@student.com',
                'password' => bcrypt(123456),
                'student_id_number' => $request->student_id_number,
                'role' => 'student',
            ]
        );

        $userProfile->create([
            'user_id' => $newUser->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'gender' => $request->gender,
            'grade_level_id' => $request->grade_level_id,
        ]);

        return success(new UserResource($newUser), 'New student successfully created.');
    }
}
