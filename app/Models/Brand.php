<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'license_active', 'api_key', 'base_folder', 'slug'];

    public function product()
    {
        return $this->hasMany(Product::class, 'id', 'product_id');
    }
}
