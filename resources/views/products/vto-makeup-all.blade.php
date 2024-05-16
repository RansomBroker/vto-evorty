<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="en-EN" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    <title>Lipstick VTO</title>

    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet" />
    <!-- Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Philosopher:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- owl carousel css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css">
    <!-- Box Icon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/boxicons/2.1.0/css/boxicons.min.css">
    <!-- Custom style -->
    <link rel="stylesheet" href="{{ asset('assets/evorty/css/vto.css') }}">
    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <!-- Bootstrap JS -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <!-- Owl carousel -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
    <!-- END OFF ASSET EVORTY-->
</head>

<body class="bg-dark-alpha">
    <div class="container-fluid p-0">
        <div class="row justify-content-center m-0 container-vto d-flex align-items-center">
            <!-- canvas-->
            <div class="col-lg-8 col-md-12 col-12 p-0">
                <div class="card bg-transparent border-0 rounded-lg">
                    <div class="card-body card-vto-container p-0">
                        <div id='canvases' class="position-relative">
                            <canvas id='camera'></canvas>
                        </div>
                        <!-- model load -->
                        <div class="col-lg-12 col-md-12 col-12 p-0 m-0 card-product-control">
                            <div class="card border-0 rounded-0">
                                <div class="card-body p-0 card-product">
                                    <!-- nav -->
                                    <nav class="px-2 pt-1 nav nav-pills mb-2 carousel-material-list border-bottom"
                                        id="materialTab" role="tablist">
                                        <button
                                            class="mx-1 btn btn-tab pb-1 p-0 fs-material-list text-uppercase text-body font-weight-bold nav-item tab-selected tab-active"
                                            id="material-0-tab" data-material="0" data-toggle="tab"
                                            href="#material-list-container-0" role="tab" aria-controls="all"
                                            aria-selected="true">
                                            All
                                        </button>
                                        <button
                                            class="mx-1 btn btn-tab pb-1 p-0 fs-material-list text-uppercase text-body font-weight-bold tab-selected nav-item"
                                            id="material-1-tab" data-material="1" data-toggle="tab"
                                            href="#material-list-container-1" role="tab" aria-controls="lipColor"
                                            aria-selected="false">
                                            Lip Color
                                        </button>
                                        <button
                                            class="mx-1 btn btn-tab pb-1 p-0 fs-material-list text-uppercase text-body font-weight-bold tab-selected nav-item"
                                            id="material-2-tab" data-material="2" data-toggle="tab"
                                            href="#material-list-container-2" role="tab" aria-controls="blush"
                                            aria-selected="false">
                                            Blush
                                        </button>
                                        <button
                                            class="mx-1 btn btn-tab pb-1 p-0 fs-material-list text-uppercase text-body font-weight-bold tab-selected nav-item"
                                            id="material-3-tab" data-material="3" data-toggle="tab"
                                            href="#material-list-container-3" role="tab" aria-controls="eyeLiner"
                                            aria-selected="true">
                                            Eye Liner
                                        </button>
                                        <button
                                            class="mx-1 btn btn-tab pb-1 p-0 fs-material-list text-uppercase text-body font-weight-bold tab-selected nav-item"
                                            id="material-4-tab" data-material="4" data-toggle="tab"
                                            href="#material-list-container-4" role="tab" aria-controls="eyeShadow"
                                            aria-selected="true">
                                            Eye Shadow
                                        </button>
                                        <button
                                            class="mx-1 btn btn-tab pb-1 p-0 fs-material-list text-uppercase text-body font-weight-bold nav-item"
                                            id="material-5-tab" data-material="5" data-toggle="tab"
                                            href="#material-list-container-5" role="tab" aria-controls="foundation"
                                            aria-selected="true">
                                            Foundation
                                        </button>
                                    </nav>
                                    <div class="mx-2 tab-content" id="pillsProductList">
                                        <div class="tab-pane fade show active" role="tabpanel"
                                            id="material-list-container-0">
                                            <div
                                                class="d-flex justify-content-start owl-carousel owl-theme product-list-0">
                                                @foreach ($data as $products)
                                                @foreach ($products as $product)
                                                <div class="d-flex justify-content-center card-item-makeup flex-wrap">
                                                    <a href="{{ route('makeup.vto', [$product['link'], $product['slug'], $product['id']])}}"
                                                        class="stretched-link"></a>
                                                    <img src="{{ asset('assets/' . $product["icon"]) }}" alt=""
                                                        class="image-product pb-1">
                                                    <p class="text-center">
                                                        {{substr($product['name'], 0, 12) . "...";}}</p>
                                                </div>
                                                @endforeach
                                                @endforeach
                                            </div>
                                        </div>
                                        @php($i = 1)
                                        @foreach($data as $products)
                                        <div class="tab-pane fade" role="tabpanel" id="material-list-container-{{$i}}">
                                            <div
                                                class="d-flex justify-content-start owl-carousel owl-theme product-list-{{$i}}">
                                                @foreach($products as $product)
                                                <div class="d-flex justify-content-center card-item-makeup flex-wrap ">
                                                    <a href="{{ route('makeup.vto', [$product['link'], $product['slug'], $product['id']])}}"
                                                        class="stretched-link"></a>
                                                    <img src="{{ asset('assets/' . $product["icon"]) }}" alt=""
                                                        class="image-product pb-1">
                                                    <p class="text-center">
                                                        {{substr($product['name'], 0, 12) . "...";}}</p>
                                                </div>
                                                @endforeach
                                            </div>
                                        </div>
                                        @php($i++)
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    const BASE_URL = "{{ url('/') }}"
    </script>
    <script src="{{ asset('assets/webarrock/js/makeup-all-product.js') }}"></script>
</body>

</html>