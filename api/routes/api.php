<?php

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SubjectsController;
use App\Http\Controllers\GradeLevelController;
use App\Http\Controllers\ActivityParticipantController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/login-using-id', [AuthController::class, 'loginUsingID']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return new UserResource($request->user());
});

Route::prefix('v1')->group(function () {
    Route::middleware('auth:sanctum')->group(function() {
    Route::resource('/activity', ActivityController::class);
    Route::resource('/question', QuestionController::class);
    Route::resource('/subject', SubjectsController::class);

    Route::get('/dashboard', [ActivityController::class, 'dashboard']);

    Route::prefix('activity')->group(function() {
        Route::post('/{id}/submit-answer', [AnswerController::class, 'answer']);
        Route::get('/{id}/check-already-answered', [ActivityParticipantController::class, 'checkAlreadyAnswered']);
        Route::get('/get-object/{id}', [ActivityController::class, 'getObject']);
    });
    
    Route::resource('/grade-level', GradeLevelController::class);
    Route::prefix('/students')->group(function() {
        Route::get('/list', [UserController::class, 'studentList']);
        Route::post('/new-student', [UserController::class, 'newStudent']);
    });
});

    // public apis
    Route::prefix('/public')->group(function() {
        Route::prefix('activity')->group(function() {
            Route::get('/list', [ActivityController::class, 'publicActivityList']);
            Route::get('/{id}', [ActivityController::class, 'show']);

        });
    });
});
