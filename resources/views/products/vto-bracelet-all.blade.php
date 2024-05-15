<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="en-EN" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    <title>Bracelet VTO</title>

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
    <input type="hidden" name="brand" value="{{ $brand->name }}">

    <div class="container-fluid p-0">
        <div class="row justify-content-center m-0 container-vto d-flex align-items-center">
            <!-- canvas-->
            <div class="col-lg-8 col-md-12 col-12 p-0">
                <div class="card bg-transparent border-0 rounded-lg shadow-lg">
                    <div class="card-body card-vto-container p-0">
                        <div id='canvases' class="position-relative">
                            <canvas id='camera'></canvas>
                        </div>
                        <!-- model load -->
                        <div class="col-lg-12 col-md-12 col-12 p-0 m-0 card-product-control">
                            <div class="card border-0 rounded-0">
                                <div class="card-body card-product">
                                    <!-- nav -->
                                    <div class="tab-content owl-carousel owl-theme" id="pillsProductList">
                                        @foreach($products as $product)
                                        <a href="{{ route('bracelet.vto', [$brand->slug, $product->slug]) }}">
                                            <img src="{{ asset($product->base_folder.'/'.$product->thumbnail) }}" alt=""
                                                class="card-item-product">
                                        </a>
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
    <script src="{{ asset('assets/webarrock/js/bracelet-all-product.js') }}"></script>
</body>

</html>