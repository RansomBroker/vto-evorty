<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="en-EN" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />

    <title>Blush VTO</title>

    <!-- INCLUDE WebAR.rocks.face MAIN SCRIPT -->
    <script src="{{ asset('assets/webarrock/dist/WebARRocksFace.js') }}"></script>

    <!-- INCLUDE MAIN HELPER -->
    <script src="{{ asset('assets/webarrock/helpers/WebARRocksFaceShape2DHelper.js') }}"></script>

    <!-- INCLUDE RESIZER HELPER -->
    <script src="{{ asset('assets/webarrock/helpers/WebARRocksResizer.js') }}"></script>

    <!-- INCLUDE LANDMARKS STABILIZER -->
    <script src="{{ asset('assets/webarrock/helpers/landmarksStabilizers/WebARRocksLMStabilizer2.js') }}"></script>


    <!-- ASSET EVORTY !!! -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>

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
</head>

<body class="bg-dark-alpha">
    <input type="hidden" name="id" value="{{ $product['id'] }}">
    <input type="hidden" name="name" value="{{ $product['slug'] }}">

    <div class="container-fluid p-0">
        <div class="row justify-content-center m-0 container-vto d-flex align-items-center">
            <!-- canvas-->
            <div class="col-lg-8 col-md-12 col-12 p-0">
                <div class="card bg-transparent border-0 rounded-lg">
                    <div class="card-body card-vto-container p-0">
                        <div id='loading' class='modalVTO fade'>
                            <div>
                                LOADING...
                            </div>
                        </div>
                        <div id='canvases' class="position-relative">
                            <canvas id='VTOCanvas'></canvas>
                            <canvas id='faceTrackerCanvas'></canvas>
                        </div>
                        <!-- model load -->
                        <div class="col-lg-12 col-md-12 col-12 p-0 m-0 card-material-control">
                            <div class="card border-0 rounded-0">
                                <div class="card-body p-0 card-material">

                                    <!-- nav -->
                                    <nav class="px-2 pt-1 nav nav-pills mb-2 carousel-material-list owl-carousel owl-theme border-bottom"
                                        id="materialTab" role="tablist">

                                    </nav>
                                    <div class="tab-content px-2 mb-1" id="pillsMaterialList">
                                    </div>

                                    <!-- product desc -->
                                    <div class="d-flex justify-content-start px-2">
                                        <!-- back -->
                                        <a href="{{ route('makeup.vto.all')}}" class="btn btn-back">
                                            <i class='bx bxs-chevron-left'></i>
                                        </a>
                                        <div class="product-container d-flex justify-content-start">
                                            <!-- image -->
                                            <img class="ml-2 img-thumbnail-product"
                                                src="{{ asset('assets/'.$product['icon']) }}" alt="">
                                            <!-- Text -->
                                            <p class="ml-1 pt-1 text-product">{{ $product['name'] }}</p>
                                        </div>
                                        <!-- shop now button -->
                                        <div class="d-flex align-items-center">
                                            <button class="btn-shop btn-sm btn btn-dark"> Shop Now</button>
                                        </div>
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
    <!-- INCLUDE DEMO SCRIPT -->
    <script src="{{ asset('assets/webarrock/js/blush.js') }}"></script>
</body>

</html>