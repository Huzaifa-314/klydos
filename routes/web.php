<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebTestController;

Route::get('/', function () {
    return view('home');
});

Route::get('/run-test', [WebTestController::class, 'showForm']);
Route::post('/run-test', [WebTestController::class, 'submitTest']);