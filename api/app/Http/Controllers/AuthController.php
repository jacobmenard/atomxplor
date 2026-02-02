<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //

    public function login(Request $request) {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        return response()->json([
            'message' => 'Successfully logged in...',
            'token' => auth()->user()->createToken(auth::user()->email)->plainTextToken,
        ], 200);
    }

    public function logout(Request $request) {
        auth()->user()->tokens()->delete();

        return response()->json([
            'message' => 'Successfully logged out...',
        ], 200);
    }

    public function loginUsingID(Request $request) {
        if (!Auth::attempt($request->only('student_id_number', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        return response()->json([
            'message' => 'Successfully logged in...',
            'token' => auth()->user()->createToken(auth::user()->email)->plainTextToken,
        ], 200);
    }
}
