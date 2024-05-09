<?php

namespace App\Http\Livewire;

use App\Models\Brand;
use Livewire\Component;

class Dashboard extends Component
{
    public $title;
    public Brand $brand;
    public $name;
    public $uniqueKey;

    public function mount($slug)
    {
        $this->brand = Brand::with(['product'])->where('slug', $slug)->first();
        $this->name = $this->brand->name;
        $this->uniqueKey = $this->brand->api_key;
        $this->title = $this->brand->name.' Dashboard';
    }

    public function render()
    {
        return view('livewire.dashboard')->extends('master', ['title' => $this->title]);
    }
}
