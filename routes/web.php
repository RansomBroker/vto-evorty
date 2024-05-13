<?php

use App\Http\Controllers\BraceletController;
use App\Http\Controllers\EarringController;
use App\Http\Livewire\BraceletProduct;
use App\Http\Livewire\BrandAdd;
use App\Http\Livewire\Dashboard;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', BrandAdd::class)->name('brand.add');
Route::get('/dashboard/{slug}', Dashboard::class)->name('dashboard');

Route::controller(BraceletController::class)->name('bracelet.')->group(function () {
    Route::get('/product/bracelet/{slug}', 'view')->name('view');
    Route::post('/product/bracelet/add', 'add')->name('add');
    Route::get('/product/bracelet/get-item/{id}', 'getItem')->name('get.item');
    Route::delete('/product/bracelet/delete/{product}', 'delete')->name('delete');
    Route::post('/product/bracelet/edit', 'edit')->name('edit');
    Route::get('/vto/bracelet/{brand}', 'tryOnAll')->name('vto.all');
    Route::get('/vto/bracelet/{brand}/{product}', 'tryOn')->name('vto');
});

Route::controller(EarringController::class)->name('earring.')->group(function () {
    Route::get('/product/earring/{slug}', 'view')->name('view');
    Route::post('/product/earring/add', 'add')->name('add');
    Route::get('/product/earring/get-item/{id}', 'getItem')->name('get.item');
    Route::delete('/product/earring/delete/{product}', 'delete')->name('delete');
    Route::post('/product/earring/edit', 'edit')->name('edit');
    Route::get('/vto/earring/{brand}', 'tryOnAll')->name('vto.all');
    Route::get('/vto/earring/{brand}/{product}', 'tryOn')->name('vto');
});

