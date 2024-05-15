<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LipstickController extends Controller
{

    /*
     *
     * IMPORTANT !!
     * JIKA MENAMBAHKAN PRODUCT LAIN HARAP SAMAKAN JUMLAH ITEM $products di fungsi tryOnAll() dan $products di tryOn()
     *
     * */

    public $products = [
        [
            "id" => 1,
            'name' => "lipstick one",
            "icon" => "others/lipstick1.png",
            "savedColors" => ['#fa0010', '#fa0010', '#00fa32']
        ],
        [
            "id" => 2,
            'name' => "lipstick two",
            "icon" => "others/lipstick2.png",
            "savedColors" => ['#00fa32']
        ]
    ];


    public function tryOn($id)
    {
        $product = $this->products[$id-1];
        return view('products.vto-lipstick', compact('product'));
    }

    public function tryOnAll()
    {
        $products = $this->products;
        return view('products.vto-lipstick-all', compact('products'));
    }

    public function getItem($id)
    {
        $product = $this->products[$id-1] ;

        return response()->json([
            'data' => $product,
            'fullUrl' => url('/')
        ]);
    }
}