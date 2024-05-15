<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="en-EN" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    <title>Bracelet VTO</title>

    <!-- INCLUDE WEBARROCKSHAND SCRIPT -->
    <script src="{{ asset('assets/webarrock/dist/WebARRocksHand.js') }}"></script>

    <!-- THREE.JS - REPLACE IT BY three.min.js FOR PROD -->
    <script src="{{ asset('assets/webarrock/libs/three/v131/build/three.js') }}"></script>

    <!-- THREE.JS HELPERS -->
    <script src="{{ asset('assets/webarrock/libs/three/v131/examples/js/loaders/GLTFLoader.js') }}"></script>

    <!-- WEBARROCKSHAND THREEJS VTO HELPER -->
    <script src="{{ asset('assets/webarrock/helpers/HandTrackerThreeHelper.js') }}"></script>

    <!-- WEBARROCKSHAND POINTS STABILIZER -->
    <script src="{{ asset('assets/webarrock/helpers/landmarksStabilizers/OneEuroLMStabilizer.js') }}"></script>

    <!-- POSEFLIP FILTER -->
    <script src="{{ asset('assets/webarrock/helpers/PoseFlipFilter.js') }}"></script>

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
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/RGBELoader.js"></script>
    <!-- END OFF ASSET EVORTY-->
</head>

<body class="bg-dark-alpha">
    <input type="hidden" name="product" value="{{ $product->id }}">

    <div class="container-fluid p-0">
        <div class="row justify-content-center m-0 container-vto d-flex align-items-center">
            <!-- canvas-->
            <div class="col-lg-8 col-md-12 col-12 p-0">
                <div class="card bg-transparent border-0 rounded-lg">
                    <div class="card-body card-vto-container p-0">
                        <div id='loading' class='modalVTO'>
                            <div>
                                LOADING...
                            </div>
                        </div>
                        <div id='instructions' class='modalVTOinstructions'>
                            <div>
                                <p class="mb-0 mt-5">Display your hand vertically,</p>
                                <p class="mb-0">fully visible</p>
                                <img src='{{ asset('assets/webarrock/assets/VTOWristGuidline2.png') }}'
                                    class="instructionsImg" /><br />
                                <button class='instructionsOK' onclick="hide_instructions()">OK</button>
                            </div>
                        </div>
                        <div id='canvases' class="position-relative">
                            <canvas id='VTOCanvas'></canvas>
                            <canvas id='handTrackerCanvas'></canvas>
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
                                        <a href="{{ route('bracelet.vto.all', $brand->slug)}}" class="btn btn-back">
                                            <i class='bx bxs-chevron-left'></i>
                                        </a>
                                        <div class="product-container d-flex justify-content-start">
                                            <!-- image -->
                                            <img class="ml-2 img-thumbnail-product"
                                                src="{{ asset($product->base_folder.'/'.$product->thumbnail) }}" alt="">
                                            <!-- Text -->
                                            <p class="ml-1 pt-1 text-product">{{ $product->name }}</p>
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
    <script src="{{ asset('assets/webarrock/js/bracelet.js') }}"></script>
</body>

</html>