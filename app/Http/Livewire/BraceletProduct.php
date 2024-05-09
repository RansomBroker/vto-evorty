<?php

namespace App\Http\Livewire;

use App\Models\Brand;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Livewire\Component;
use Livewire\Livewire;
use Livewire\WithFileUploads;

class BraceletProduct extends Component
{
    public $title;
    public Brand $brand;
    public $name;

    public $modelFile;
    public $modelName;
    public $materials = [];

    protected $listeners = ['updateMaterial'];

    public $productName;

    public function mount($slug)
    {
        $this->brand = Brand::with(['product'])->where('slug', $slug)->first();
        $this->name = $this->brand->name;
        $this->title = $this->brand->name.' Bracelet';
    }

    public function showAddProductModal()
    {
        $this->dispatchBrowserEvent('showAddProductModal');
    }

    public function closeAddProductModal()
    {
        $this->dispatchBrowserEvent('closeAddProductModal');
    }


    public function updateMaterial($materials)
    {
        $this->materials = $materials;
    }

    public function addProduct()
    {
        dd($this->modelFile, $this->modelName, $this->materials);
    }

    public function render()
    {
        return view('livewire.bracelet-product')->extends('master', ['title' => $this->title]);
    }
}
