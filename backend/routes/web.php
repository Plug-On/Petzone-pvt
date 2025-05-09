<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/esewa-payment-success', [PaymentController::class, 'esewaSuccess']);
Route::get('/esewa-payment-failure', [PaymentController::class, 'esewaFailure']);
