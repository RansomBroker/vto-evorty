<?php

namespace App\Http\Livewire;

use App\Models\Brand;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Livewire\Component;

class BrandAdd extends Component
{
    public $title = 'VTO Create Brand';
    public $name;

    public function add()
    {
        $data = [
            'name' => $this->name,
            'base_folder' => Str::of($this->name)->slug('-'),
            'license_active' => Carbon::now()->addMonth(),
            'api_key' => base64_encode(base64_encode(Carbon::now()->addMonth().'||'.$this->name)),
            'slug' => Str::of($this->name)->slug('-')
        ];

        $brand = Brand::create($data);

        session()->flash('status', 'success');
        session()->flash('message', 'Success create Brand');

        // create folder
        File::makeDirectory(public_path().'/brands/'.$data['base_folder']);
        return redirect()->route('dashboard', $data['slug']);
    }

    public function render()
    {
        return view('livewire.brand-add')->extends('master', ['title' => $this->title]);
    }
}
