$(window).on("load", function () {
    let id = $("input[name=id]").val();
    let name = $("input[name=name]").val();
    $.ajax({
        url: BASE_URL + "/product/lipstick/get-item" + "/" + name + "/" + id,
        type: "GET",
        success: function (response) {
            let _canvasVideo = null,
                _canvasAR = null;

            console.log(response.data.savedColors);

            const mouthWiden = 0.01;
            const upperLipOut = 0; //0.01;
            const lowerLipOut = 0.005; //0.01;

            const SHAPELIPS = {
                name: "LIPS",

                // list of the points involved in this shape.
                // each point is given as its label
                // the label depends on the used neural network
                // run WEBARROCKSFACE.get_LMLabels() to get all labels
                points: [
                    "lipsExt0", // 0
                    "lipsExtTop1", // 1
                    "lipsExtTop2", // 2
                    "lipsExtTop3", // 3
                    "lipsExtTop4", // 4
                    "lipsExtTop5", // 5

                    "lipsExt6", // 6

                    "lipsExtBot7", // 7
                    "lipsExtBot8", // 8
                    "lipsExtBot9", // 9
                    "lipsExtBot10", // 10
                    "lipsExtBot11", // 11

                    "lipsInt12", // 12

                    "lipsIntTop13", // 13
                    "lipsIntTop14", // 14
                    "lipsIntTop15", // 15

                    "lipsInt16", // 16

                    "lipsIntBot17", // 17
                    "lipsIntBot18", // 18
                    "lipsIntBot19", // 19
                ],

                // iVals are interpolated values
                // a value is given for each shape point
                // in the same order as points array
                // a value can have between 0 and 4 elements
                // the value will be retrieved in the fragment shader used to color the shape
                // as a float, vec2, vec3 or vec4 depending on its components count
                // it is useful to not color evenly the shape
                // we can apply gradients, smooth borders, ...
                iVals: [
                    [1], // lipsExt0
                    [1], // lipsExtTop1
                    [1], // lipsExtTop2
                    [1], // lipsExtTop3
                    [1], // lipsExtTop4
                    [1], // lipsExtTop5

                    [1], // lipsExt6

                    [1], // lipsExtBot7
                    [1], // lipsExtBot8
                    [1], // lipsExtBot9
                    [1], // lipsExtBot10
                    [1], // lipsExtBot11

                    [-1], // lipsInt12

                    [-1], // lipsIntTop13
                    [-1], // lipsIntTop14
                    [-1], // lipsIntTop15

                    [-1], // lipsInt16

                    [-1], // lipsIntBot17
                    [-1], // lipsIntBot18
                    [-1], // lipsIntBot1
                ],

                // how to group shape points to draw triangles
                // each value is an index in shape points array
                tesselation: [
                    // upper lip:
                    0,
                    1,
                    13, // each group of 3 indices is a triangular face
                    0,
                    12,
                    13,
                    1,
                    13,
                    2,
                    2,
                    13,
                    14,
                    2,
                    3,
                    14,
                    3,
                    4,
                    14,
                    14,
                    15,
                    4,
                    4,
                    5,
                    15,
                    15,
                    5,
                    6,
                    15,
                    6,
                    16,

                    // lower lip:
                    0,
                    12,
                    19,
                    0,
                    19,
                    11,
                    11,
                    10,
                    19,
                    10,
                    18,
                    19,
                    10,
                    9,
                    18,
                    8,
                    9,
                    18,
                    8,
                    17,
                    18,
                    7,
                    8,
                    17,
                    6,
                    7,
                    17,
                    6,
                    17,
                    16, //*/
                ],

                // interpolated points:
                // to make shape border smoother, we can add computed points
                // each value of this array will insert 2 new points
                //
                // the first point will be between the first 2 points indices
                // the second point will be between the last 2 points indices
                //
                // the first value of ks controls the position of the first interpolated point
                // if -1, it will match the first point, if 0 it will match the middle point
                // the second value of ks controls the position of the second interpolated point
                // if 1, it will match the last point, if 0 it will match the middle point
                //
                // computed using Cubic Hermite interpolation
                // the point is automatically inserted into the tesselation
                // points are given by their indices in shape points array
                interpolations: [
                    {
                        // upper lip sides:
                        tangentInfluences: [2, 2, 2],
                        points: [1, 2, 3],
                        ks: [-0.25, 0.25], // between -1 and 1
                    },
                    {
                        tangentInfluences: [2, 2, 2],
                        points: [3, 4, 5],
                        ks: [-0.25, 0.25], // between -1 and 1
                    },
                    {
                        // upper lip middle
                        tangentInfluences: [2, 2, 2],
                        points: [2, 3, 4],
                        ks: [-0.25, 0.25], // between -1 and 1
                    },
                    {
                        // lower lip middle:
                        tangentInfluences: [2, 2, 2],
                        points: [10, 9, 8],
                        ks: [-0.25, 0.25], // between -1 and 1
                    },
                ],

                // we can move points along their normals using the outline feature.
                // an outline is specified by the list of point indices in shape points array
                // it will be used to compute the normals, the inside and the outside
                //
                // displacement array are the displacement along normals to apply
                // for each point of the outline.
                outlines: [
                    {
                        // upper lip. Indices of points in points array:
                        points: [
                            0,
                            1,
                            2,
                            3,
                            4,
                            5, // exterior
                            6,
                            16,
                            15,
                            14,
                            13, // interior
                            12,
                        ],
                        displacements: [
                            // displacements, relative to perimeter:
                            mouthWiden,
                            upperLipOut,
                            upperLipOut,
                            upperLipOut - 0.015,
                            upperLipOut,
                            upperLipOut, // exterior
                            0.0,
                            0,
                            0.01,
                            0.015,
                            0.01, // interior
                            mouthWiden,
                        ],
                    },
                    {
                        // lower lip:
                        points: [
                            12,
                            19,
                            18,
                            17, // interior
                            16,
                            6,
                            7,
                            8,
                            9,
                            10,
                            11, // exterior
                            0,
                        ],
                        displacements: [
                            0,
                            0.015,
                            0.02,
                            0.015,
                            0,
                            0.0,
                            lowerLipOut,
                            lowerLipOut,
                            lowerLipOut,
                            lowerLipOut,
                            lowerLipOut,
                            0.0,
                        ],
                    },
                ],

                // RENDERING:
                // GLSLFragmentSource is the GLSL source code of the shader used
                // to fill the shape:

                // Debug interpolated vals:
                /*GLSLFragmentSource: "void main(void){\n\
                  gl_FragColor = vec4(0.5 + 0.5*iVal, 0., 1.);\n\
                }" //*/

                // uniform color:
                /*GLSLFragmentSource: "void main(void){\n\
                  gl_FragColor = vec4(0.1, 0.0, 0.2, 0.5);\n\
                }" //*/

                // debug samplerVideo and vUV:
                /*GLSLFragmentSource: "void main(void){\n\
                  gl_FragColor = vec4(0., 1., 0., 1.) * texture2D(samplerVideo, vUV);\n\
                }" //*/

                // color with smooth border:
                GLSLFragmentSource:
                    "\n\
                  const vec2 ALPHARANGE = vec2(0.1, 0.6);\n\
                  const vec3 LUMA = 1.3 * vec3(0.299, 0.587, 0.114);\n\
                  \n\
                  float linStep(float edge0, float edge1, float x){\n\
                    float val = (x - edge0) / (edge1 - edge0);\n\
                    return clamp(val, 0.0, 1.0);\n\
                  }\n\
                  \n\
                  \n\
                  void main(void){\n\
                    // get grayscale video color:\n\
                    vec3 videoColor = texture2D(samplerVideo, vUV).rgb;\n\
                    vec3 videoColorGs = vec3(1., 1., 1.) * dot(videoColor, LUMA);\n\
                    \n\
                    // computer alpha:\n\
                    float alpha = 1.0; // no border smoothing\n\
                    alpha *= linStep(-1.0, -0.95, abs(iVal)); // interior\n\
                    alpha *= 0.5 + 0.5 * linStep(1.0, 0.6, abs(iVal)); // exterior smoothing\n\
                    float alphaClamped = ALPHARANGE.x + (ALPHARANGE.y - ALPHARANGE.x) * alpha;\n\
                    \n\
                    // mix colors:\n\
                    vec3 color = videoColorGs * lipstickColor;\n\
                    gl_FragColor = vec4(color*alphaClamped, alphaClamped);\n\
                    \n\
                    // DEBUG ZONE:\n\
                    //gl_FragColor = vec4(0., alpha, 0., 1.0);\n\
                    //gl_FragColor = vec4(alpha, alpha, alphaClamped, 1.0);\n\
                    //gl_FragColor = vec4(0., 1., 0., 1.);\n\
                  }",
                uniforms: [
                    {
                        name: "lipstickColor",
                        value: [1, 0, 0.3],
                    },
                ],
            }; //end SHAPELIPS

            function start() {
                WebARRocksFaceShape2DHelper.init({
                    NNCPath:
                        BASE_URL +
                        "/assets/webarrock/neuralNets/NN_LIPS_8.json",
                    canvasVideo: _canvasVideo,
                    canvasAR: _canvasAR,
                    shapes: [SHAPELIPS],
                })
                    .then(function () {
                        //  set value to transparent
                        WebARRocksFaceShape2DHelper.set_uniformValue(
                            "LIPS",
                            "lipstickColor"
                        );

                        $("#loading").addClass("d-none");

                        // buat perulangan untuk buat nav
                        let _material_tab = `
                            <button class="btn btn-tab pb-1 p-0 fs-material-list text-uppercase text-body font-weight-bold nav-item tab-selected tab-active" data-toggle="tab"  role="tab" href="#material-list-container">
                                Color Variant
                            </button>
                        `;

                        $("#materialTab").html(_material_tab);

                        //run owl
                        $(".carousel-material-list").owlCarousel({
                            loop: false,
                            margin: 10,
                            nav: false,
                            autoWidth: true,
                        });

                        createCard();
                    })
                    .catch(function (err) {
                        throw new Error(err);
                    });
            }

            function createCard() {
                let _material_card_list = ``;
                let _material_card_list_container = ``;

                //iterate color
                response.data.savedColors.forEach(function (color, key) {
                    _material_card_list += `
                                        <div class="card-item card-item-${key}" data-material-index="${key}" data-color="${color}" style="background-color: ${hexToRgb(
                        color
                    )};"></div>
                                    `;
                });

                // gabungkan semua
                _material_card_list_container = `
                    <div class="material-list-container justify-content-start tab-pane fade" id="material-list-container" role="tabpanel">
                        <div class="unselected-container unselected-container d-flex align-items-center justify-content-center">
                            <img src="${
                                BASE_URL + "/assets/others/unselected.png"
                            }" class="unselected-img unselected-material-btn btn-rounded">
                        </div>
                        <div class="material-list owl-carousel owl-theme">
                            ${_material_card_list}
                        </div>
                    </div>
                `;

                // append all
                $("#pillsMaterialList").append(_material_card_list_container);

                //run owl
                $(".material-list").owlCarousel({
                    loop: false,
                    nav: false,
                    autoWidth: true,
                });

                $(".material-list-container").addClass("d-none");

                $(".material-list-container").removeClass("d-none");
                $(".material-list-container").addClass("d-flex show active");
            }

            // entry point:
            function main() {
                _canvasAR = document.getElementById("VTOCanvas");
                _canvasVideo = document.getElementById("faceTrackerCanvas");

                WebARRocksResizer.size_canvas({
                    canvas: _canvasVideo,
                    overlayCanvas: [_canvasAR],
                    callback: start,
                    isFullScreen: true,
                });
            }

            main();

            function hexToRgbArray(hex) {
                // Remove the hash at the start if it's there
                hex = hex.replace(/^#/, "");

                // Parse the r, g, b values
                var bigint = parseInt(hex, 16);
                var r = (bigint >> 16) & 255;
                var g = (bigint >> 8) & 255;
                var b = bigint & 255;

                // Return as an array of floats normalized to [0.0, 1.0]
                return [r / 255, g / 255, b / 255];
            }

            function hexToRgb(hex) {
                // Hilangkan tanda '#' jika ada
                hex = hex.replace(/^#/, "");

                // Pisahkan nilai warna menjadi komponen R, G, dan B
                var r = parseInt(hex.substring(0, 2), 16);
                var g = parseInt(hex.substring(2, 4), 16);
                var b = parseInt(hex.substring(4, 6), 16);

                // Kembalikan nilai RGB dalam format string
                return "rgb(" + r + ", " + g + ", " + b + ")";
            }

            $(document).on("click", ".card-item", function () {
                let color = $(this).data("color");
                let materialIndex = $(this).data("material-index");

                $(".unselected-container").removeClass(
                    "unselected-material-active"
                );

                WebARRocksFaceShape2DHelper.set_uniformValue(
                    "LIPS",
                    "lipstickColor",
                    hexToRgbArray(color)
                );

                //remove card active
                $(".card-item").removeClass("card-item-active");

                $(".card-item-" + materialIndex).addClass("card-item-active");
            });

            // sembunyikan material
            $(document).on("click", ".unselected-material-btn", function () {
                $(".unselected-container").addClass(
                    "unselected-material-active"
                );

                WebARRocksFaceShape2DHelper.set_uniformValue(
                    "LIPS",
                    "lipstickColor"
                );

                $(".card-item").removeClass("card-item-active");
            });
        },
    });
});
