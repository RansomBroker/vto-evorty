<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="en-EN" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />

    <title>WebAR.rocks.face 3D earrings demo</title>

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
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/postprocessing/UnrealBloomPassTweaked.js') }}"></script>
    <script src="{{ asset('assets/webarrock/libs/three/v136/examples/js/shaders/LuminosityHighPassShader.js') }}"></script>

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
    <link href="https://fonts.googleapis.com/css2?family=Philosopher:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
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
<body class="bg-cosmic-latte w-full min-vh-100 overflow-auto d-flex align-items-center">
<input type="hidden" name="product" value="{{ $product->id }}">

<div class="container-fluid">
    <div class="row justify-content-center m-0">
        <!-- canvas-->
        <div class="col-lg-6 col-md-6 col-12">
            <div class="card bg-transparent border-0 rounded-lg">
                <div class="card-body card-vto-container p-0">
                    <div id='canvases' class="position-relative">
                        <!-- canvas where the earring will be displayed: -->
                        <canvas  id='VTOCanvas'></canvas>
                        <!-- canvas where the video will be displayed: -->
                        <canvas  id='faceTrackerCanvas'></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- model load -->
        <div class="col-lg-6 col-md-6 col-12 mt-3 mt-lg-0">
            <div class="border-0 border-cosmic mb-3"></div>
            <div class="card bg-transparent border-0 rounded-lg">
                <div class="card-body">
                    <ul class="nav nav-tabs mb-3 border-cosmic" id="materialTab" role="tablist">

                    </ul>
                    <div class="tab-content" id="pillsMaterialList">

                    </div>

                </div>
            </div>
        </div>

    </div>
</div>

<!-- INCLUDE DEMO SCRIPT -->
<script src="{{ asset('assets/webarrock/js/earring.js') }}"></script>
</body>
</html>
