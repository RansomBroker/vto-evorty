<?php

namespace App\Http\Livewire;

use App\Models\Product;
use Livewire\Component;

class EditProduct extends Component
{
    public $title;
    public $data;

    public function mount($slug)
    {
        $this->data = Product::where('slug', $slug)->first();
        $this->title = 'Edit '. $this->data['name'];
    }

    public function render()
    {
        return view('livewire.edit-product')->extends('master', ['title' => $this->title]);
    }
}
