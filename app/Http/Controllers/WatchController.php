<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class WatchController extends Controller
{
    public function view($slug)
    {
        $brand = Brand::with(['product'])->where('slug', $slug)->first();
        $products = Product::where('brand_id', $brand->id)->where('type', 'watch')->get();
        return view('products.watch', compact('brand', 'products'));
    }

    public function tryOn($brand, $product)
    {
        $brand = Brand::with(['product'])->where('slug', $brand)->first();
        $product = Product::where('slug', $product)->where('type', 'watch')->first();
        return view('products.vto-watch', compact('brand', 'product'));
    }

    public function tryOnAll($brand)
    {
        $brand = Brand::with(['product'])->where('slug', $brand)->first();
        $products = Product::where('brand_id', $brand->id)->where('type', 'watch')->get();
        return view('products.vto-watch-all', compact('brand', 'products'));
    }

    public function add(Request $request)
    {
        $product = Str::of($request->name)->slug('-');

        $path = 'brands/'.$request->slug.'/'.$product;

        if (!File::exists($path)) {
            // create newfolder
            File::makeDirectory($path);
        }

        $file = $request->file('file');
        $filename = str_replace(' ', '', $file->getClientOriginalName());

        $thumbnailFile = $request->file('thumbnail');
        $thumbnailName = str_replace(' ', '', $thumbnailFile->getClientOriginalName());

        // Simpan file ke folder publik dengan nama yang ditentukan
        $file->move($path, $filename);
        $thumbnailFile->move($path, $thumbnailName);

        // rekonstruksi data
        $savedImages = [];

        if ($request->has('material-index')) {
            foreach ($request->get('material-index') as $material) {
                if ($request->has('material-list-'.$material)) {
                    foreach ($request->get('material-list-'.$material) as $list ) {
                        if ($request->get('current-material-'.$material.'-'.$list) == $list) {
                            $file = $request->file('savedImages-'.$material.'-'.$list);
                            $filenameImage = str_replace(' ', '', $file->getClientOriginalName());
                            $savedImages[$material][] = ['filepath' => $path.'/'.$filenameImage, 'material' => $material, 'current' => $list];
                            $file->move($path, $filenameImage);
                        }
                    }
                }
            }
        }

        $data = [
            'name' => $request->name,
            'brand_id' => $request->brand_id,
            'slug' => $product,
            'base_folder' => $path,
            'type' => 'watch',
            'color' => $request->savedColors,
            'filename' => $filename,
            'saved_images' => json_encode($savedImages),
            'thumbnail' => $thumbnailName
        ];

        Product::create($data);

        session()->flash('status', 'success');
        session()->flash('message', 'Success create product');

        return response()->json([
            'status' => '1',
            'data' => route('watch.view', $request->slug)
        ]);

    }

    public function delete(Product $product)
    {
        $brand = Brand::find($product->brand_id);

        $path = $product->base_folder;

        // hapus folder
        if (File::exists($path)) {
            File::deleteDirectory($path);
        }

        // hapus data
        $product->delete();

        session()->flash('status', 'danger');
        session()->flash('message', 'Success delete product');

        return redirect()->route('watch.view', $brand->slug);

    }

    public function edit(Request $request)
    {
        $product = Product::find($request->product_id);
        $brand = Brand::find($request->brand_id);

        $data = [
            'name' => $request->name,
            'brand_id' => $request->brand_id,
            'slug' => Str::of($request->name)->slug('-'),
            'base_folder' => $product->base_folder,
            'type' => 'bracelet',
            'color' => $request->savedColors,
            'filename' => $product->filename
        ];

        //ubah nama folder
        if ($request->name != $product->name) {
            $oldPath = public_path().$product->base_folder;
            $newPath = public_path().'/brands/'.$brand->slug.'/'.Str::of($request->name)->slug('-');
            File::move($oldPath, $newPath);
            File::deleteDirectory($oldPath);
            $data['base_folder'] = '/brands/'.$brand->slug.'/'.Str::of($request->name)->slug('-');;
        }

        // jika ada perubahan model
        if ($request->file('file') != null) {
            $file = $request->file('file');
            $filename = $file->getClientOriginalName();

            // Simpan file ke folder publik dengan nama yang ditentukan
            $file->move(public_path().$data['base_folder'], $filename);
            $data['filename'] = $filename;
        }

        $product->update($data);

        session()->flash('status', 'warning');
        session()->flash('message', 'Success edit product');

        return response()->json([
            'status' => '1',
            'data' => route('bracelet.view', $request->slug)
        ]);
    }

    public function getItem($id)
    {
        $product = Product::find($id) ;

        return response()->json([
            'data' => $product,
            'fullUrl' => url('/')
        ]);
    }
}
