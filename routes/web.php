<?php

use App\Http\Controllers\BraceletController;
use App\Http\Controllers\EarringController;
use App\Http\Controllers\LipstickController;
use App\Http\Controllers\WatchController;
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

Route::controller(WatchController::class)->name('watch.')->group(function () {
    Route::get('/product/watch/{slug}', 'view')->name('view');
    Route::post('/product/watch/add', 'add')->name('add');
    Route::get('/product/watch/get-item/{id}', 'getItem')->name('get.item');
    Route::delete('/product/watch/delete/{product}', 'delete')->name('delete');
    Route::post('/product/watch/edit', 'edit')->name('edit');
    Route::get('/vto/watch/{brand}', 'tryOnAll')->name('vto.all');
    Route::get('/vto/watch/{brand}/{product}', 'tryOn')->name('vto');
});

Route::controller(LipstickController::class)->name('lipstick.')->group(function() {
    Route::get('/vto/lipstick/test', 'tryOnAll')->name('vto.all');
    Route::get('/product/lipstick/get-item/{id}', 'getItem')->name('get.item');
    Route::get('/vto/lipstick/test/product/{id}', 'tryOn')->name('vto');
});

Route::get('/vto/face/test', function () {
    return view('products.vto-face');
});

Route::get('/vto/makeup/test', function() {
    $data = [
        // lip
        [
            [
                "id" => 1,
                'name' => "lipstick one",
                'slug' => "lipstick-one",
                "icon" => "others/lipstick1.png",
                "savedColors" => ['#fa0010', '#fa0010', '#00fa32'],
                "link" => "lipstick"
            ],
            [
                "id" => 2,
                'name' => "lipstick two",
                'slug' => "lipstick-two",
                "icon" => "others/lipstick1.png",
                "savedColors" => ['#fa0010', '#fa0010', '#00fa32'],
                "link" => 'lipstick'
            ],
        ],
        // blush 
        [
            [
                "id" => 1,
                'name' => "blush one",
                'slug' => "lipstick-two",
                "icon" => "others/lipstick1.png",
                "savedColors" => ['#fa0010', '#fa0010', '#00fa32'],
                "link" => "blush"
            ],
        ],
        // Eye Liner
        [
            [
                "id" => 1,
                'name' => "eye liner one",
                'slug' => "eye-liner-one",
                "icon" => "others/lipstick1.png",
                "savedColors" => ['#fa0010', '#fa0010', '#00fa32'],
                "link" => "eyeliner"
            ],
        ],
        // Eye Shadow
        [
            [
                "id" => 1,
                'name' => "eye shadow one",
                'slug' => "eye-shadow-one",
                "icon" => "others/lipstick1.png",
                "savedColors" => ['#fa0010', '#fa0010', '#00fa32'],
                "link" => "eyeshadow"
            ],
        ],
        // Foundation
        [
            [
                "id" => 1,
                'name' => "foundation one",
                'slug' => "foundation-one",
                "icon" => "others/lipstick1.png",
                "savedColors" => ['#fa0010', '#fa0010', '#00fa32'],
                "link" => "foundation"
            ],
        ],
    ];

    return view('products.vto-makeup-all', compact('data'));
})->name('makeup.all');

Route::get('/vto/makeup/{link}/{product}/{id}', function($link, $product, $id) {
    
    if($link == 'lipstick') {
        
    }

    
})->name('makeup.vto');