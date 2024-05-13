<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="en-EN" />
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />

    <title>VTO Earring</title>

    <!-- INCLUDE WebAR.rocks.face MAIN SCRIPT -->
    <script src="{{ asset('assets/webarrock/dist/WebARRocksFace.js') }}"></script>

    <!-- INCLUDE EARRINGS3D HELPER -->
    <script src="{{ asset('assets/webarrock/helpers/WebARRocksFaceEarrings3DHelper.js') }}"></script>

    <!-- THREE.JS, FOR THE RENDERING -->
    <!-- WARNING: for production you should replace three.js by three.min.js -->
    <script src="{{ asset('assets/webarrock/libs/three/v136/build/three.js') }}"></script>
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/loaders/GLTFLoader.js') }}"></script>

    <!-- THREE.JS RGBE loader - you can remove it if you don't use envmap: -->
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/loaders/RGBELoader.js') }}"></script>

    <!-- THREE.JS postprocessing - you can remove it if you don't use bloom or temporal anti aliasing : -->
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/postprocessing/EffectComposer.js') }}"></script>
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/postprocessing/ShaderPass.js') }}"></script>
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/postprocessing/RenderPass.js') }}"></script>
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/shaders/CopyShader.js') }}"></script>

    <!-- Bloom postprocessing: -->
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/postprocessing/UnrealBloomPassTweaked.js') }}">
    </script>
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/shaders/LuminosityHighPassShader.js') }}">
    </script>

    <!-- TAA specifics: -->
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/postprocessing/SSAARenderPass.js') }}"></script>
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/postprocessing/TAARenderPass.js') }}"></script>

    <!-- INCLUDE RESIZER HELPER -->
    <script src="{{ asset('assets/webarrock/helpers/WebARRocksResizer.js') }}"></script>

    <!-- INCLUDE LANDMARKS STABILIZER -->
    <script src="{{ asset('assets/webarrock/helpers/landmarksStabilizers/OneEuroLMStabilizer.js') }}"></script>


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

<body class="bg-cosmic-latte w-full overflow-auto d-flex align-items-center">
    <input type="hidden" name="product" value="{{ $product->id }}">

    <div class="container-fluid container-control p-0">
        <div class="row justify-content-center m-0">
            <!-- canvas-->
            <div class="col-lg-12 col-md-12 col-12 p-0">
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
                            <div class="card border-0">
                                <div class="card-body p-0 card-material">
                                    <!-- nav -->
                                    <nav class="px-md-4 px-2 pt-2 nav nav-pills mb-2 carousel-material-list owl-carousel owl-theme border-bottom"
                                        id="materialTab" role="tablist">

                                    </nav>
                                    <div class="tab-content px-md-4 px-2 mb-1" id="pillsMaterialList">

                                    </div>
                                    <!-- product desc -->
                                    <div class="d-flex justify-content-start mx-2">
                                        <!-- back -->
                                        <a href="{{ route('earring.vto.all', $brand->slug)}}" class="btn btn-back">
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
    <!-- INCLUDE DEMO SCRIPT -->
    <script src="{{ asset('assets/webarrock/js/earring.js') }}"></script>
</body>

</html>