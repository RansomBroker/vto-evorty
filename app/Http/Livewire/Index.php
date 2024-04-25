<?php

namespace App\Http\Livewire;

use App\Models\Product;
use Illuminate\Support\Str;
use Livewire\Component;

class Index extends Component
{
    public $title = 'VTO';
    public $name = '';

    public function render()
    {
        return view('livewire.index')->extends('master', ['title' => $this->title]);
    }

    public function createProduct()
    {
        $data = $this->validate();
        $data['slug'] = Str::of($data['name'])->slug('-');

        Product::create($data);

        $this->name = '';

        return redirect()->route('product.edit', $data['slug']);
    }

    public function showModal()
    {
        $this->dispatchBrowserEvent('showModal');
    }

    public function closeModal()
    {
        $this->name = '';
        $this->dispatchBrowserEvent('closeModal');
    }

    protected function rules()
    {
        return [
            'name' => 'required|min:1|max:200',
        ];
    }
}
