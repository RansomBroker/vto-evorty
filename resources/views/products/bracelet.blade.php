@extends('master')
@section('title', 'Manage Bracelet Product')
@section('content')
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div class="layout-container">
        <x-sidebar :brand="$brand->name" :url="$brand->slug"/>

        <div class="layout-page">
            <x-navbar :license="$brand->license_active"/>
            <!-- Content wrapper -->
            <div class="content-wrapper">
                <!-- Content -->
                <div class="container-xxl flex-grow-1 container-p-y">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="fw-bold">Bracelet</h4>
                            @if($message = Session::get('message'))
                                @if($status = Session::get('status'))
                                    <div class="alert alert-{{ $status}} alert-dismissible fade show mb-3" role="alert">
                                        {{ $message }}
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                @endif
                            @endif
                            <div class="d-flex justify-content-end mb-3">
                                <button id="showAddProductModal" class="btn btn-primary" >Add New Product</button>
                            </div>
                            @php($i=0)
                            @foreach($products as $product)
                                <div class="card mb-3 shadow-lg">
                                    <div class="card-body">
                                        <h4 class="fw-bold">{{ $product->name }}</h4>
                                        <div class="d-flex justify-content-start">
                                            <button type="button" class="btn-edit btn btn-success btn-sm m-2 p-2 rounded-circle" data-id="{{ $product->id }}"><i class='bx bx-edit-alt'></i></button>
                                            <form action="{{ route('bracelet.delete', $product->id) }}" method="POST">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-danger btn-sm m-2 rounded-circle p-2"><i class='bx bx-trash'></i></button>
                                            </form>
                                            <a href="{{ route('bracelet.vto', [$brand->slug, $product->slug]) }}" class="btn btn-secondary btn-sm m-2 p-2 rounded-circle"><i class='bx bx-show'></i></a>
                                        </div>
                                    </div>
                                </div>
                                @php($i++)
                            @endforeach
                        </div>
                    </div>
                </div>
                <!-- / Content -->
                <div class="content-backdrop fade"></div>
            </div>
            <!-- Content wrapper -->
        </div>

        <!-- Modal add product -->
        <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title" id="addProductModalLabel">Add New Product</h5>
                    </div>
                    <div class="modal-body">
                        <form id="addProduct" enctype="multipart/form-data">
                            <input type="hidden" name="slug" value="{{$brand->slug}}">
                            <input type="hidden" name="brand_id" value="{{ $brand->id }}">
                            <div class="row">
                                <div class="form-group mb-3 col-lg-6 col-12">
                                    <label for="" class="form-label">Product Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="name"  required>
                                </div>
                                <div class="form-group mb-3 col-lg-6 col-12 row">
                                    <div class="form-group col-lg-8 col-12">
                                        <label for="" class="form-label">Model 3d <span class="text-danger">*</span></label>
                                        <input type="file" id="modelFile" class="form-control mb-3" name="modelFile"  required>
                                    </div>
                                    <div class="form-group dropdown col-lg-4 col-12">
                                        <label for="" class="form-label textwhite">List Materials<span class="text-danger">*</span></label>
                                        <button class="btn btn-light border dropdown-toggle w-100" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            List Materials
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <ul id="materialList"></ul>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="row model-container justify-content-center">
                                <div class="col-lg-12 col-md-12 col-12">
                                    <div id="viewer"></div>
                                </div>
                                <div class="col-lg-5 col-md-12 col-12">
                                    <div id="materialColorList">
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mb-3">Add New Product</button>
                            <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal" >Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal edit product -->
        <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title" id="editProductModalLabel">Edit Product</h5>
                    </div>
                    <div class="modal-body">
                        <form id="editProduct" enctype="multipart/form-data">
                            <input type="hidden" name="slug_edit" value="{{$brand->slug}}">
                            <input type="hidden" name="brand_id_edit" value="{{ $brand->id }}">
                            <div class="row">
                                <div class="form-group mb-3 col-lg-6 col-12">
                                    <label for="" class="form-label">Product Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="name_edit"  required>
                                </div>
                                <div class="form-group mb-3 col-lg-6 col-12 row">
                                    <div class="form-group col-lg-8 col-12">
                                        <label for="" class="form-label">Model 3d <span class="text-danger">*</span></label>
                                        <input type="file" id="modelFileEdit" class="form-control mb-3" name="modelFileEdit"  required>
                                    </div>
                                    <div class="form-group dropdown col-lg-4 col-12">
                                        <label for="" class="form-label textwhite">List Materials<span class="text-danger">*</span></label>
                                        <button class="btn btn-light border dropdown-toggle w-100" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                            List Materials
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                            <ul id="materialListEdit"></ul>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="row model-container justify-content-center">
                                <div class="col-lg-12 col-md-12 col-12">
                                    <div id="viewerEdit"></div>
                                </div>
                                <div class="col-lg-5 col-md-12 col-12">
                                    <div id="materialColorListEdit">
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mb-3">Edit Product</button>
                            <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal" >Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/RGBELoader.js"></script>

    @push('script')
            <script src="{{ asset('assets/evorty/js/bracelet-product-add.js') }}"></script>
            <script src="{{ asset('assets/evorty/js/bracelet-product-edit.js') }}"></script>
        @endpush
    </div>

@endsection
