<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SubjectsController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->group(function () {
    Route::middleware('auth:sanctum')->group(function() {
    Route::resource('/activity', ActivityController::class);
    Route::resource('/question', QuestionController::class);
    Route::resource('/subject', SubjectsController::class);

    Route::get('/dashboard', [ActivityController::class, 'dashboard']);
});

    // public apis
    Route::prefix('/public')->group(function() {
        Route::prefix('activity')->group(function() {
            Route::get('/list', [ActivityController::class, 'publicActivityList']);
        });
    });
});
