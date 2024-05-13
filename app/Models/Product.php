<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'brand_id', 'base_folder', 'type', 'color', 'filename', 'saved_images', 'thumbnail'];

    public function brand()
    {
        return $this->hasOne(Brand::class, 'id', 'brand_id');
    }
}
