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
                    ->where('role', 'student')
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

    public function updateUser($id, Request $request, User $user, UserProfile $userProfile) {
        try {
            $request->validate([
                'first_name' => 'required',
                'last_name' => 'required',
                'gender' => 'required',
                'grade_level_id' => 'required',
                'student_id_number' => 'required|unique:users,student_id_number,'.$id,
            ]);
            if ($user->where('student_id_number', $request->student_id_number)->where('id', '!=', $id)->first()) {
                return error(null, 'Student ID number already exists.');
            }

            $fullName = $request->first_name . ' ' . $request->last_name;
            $trimName = str_replace(' ', '', $fullName);
            $email = $request->student_id_number. strtolower($trimName) . '@student.com';
            
            $user->where('id', $id)->update([
                'name' => $fullName,
                'email' => $email,
                'student_id_number' => $request->student_id_number,
            ]);

            $userProfile->where('user_id', $id)->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'gender' => $request->gender,
                'grade_level_id' => $request->grade_level_id,
            ]);

            return success(null, 'User successfully updated');
        } catch (\Exception $e) {
            return error(null, $e->getMessage());
        }
    }
}
