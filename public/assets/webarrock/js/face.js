$(window).on("load", function () {
    let _canvasVideo = null,
        _canvasAR = null;

    // menambahkan warna array ke 1 lips,
    // array ke 2 cheeks
    // array ke 3 eye
    let colors = [
        ["#fc005d", "#05f776"],
        ["#fc005d", "#1d05f7"],
        ["#fc005d", "#f78e05"],
    ];

    // LIPS:
    const SHAPELIPS = {
        name: "LIPS",

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
                    0.0,
                    0.0,
                    0.0,
                    -0.015,
                    0.0,
                    0.0, // exterior
                    0.0,
                    0,
                    0.01,
                    0.015,
                    0.01, // interior
                    0,
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
                    0, 0.015, 0.02, 0.015, 0, 0.0, 0, 0, 0, 0, 0, 0.0,
                ],
            },
        ],

        // color with smooth border:
        GLSLFragmentSource:
            "\
        const vec3 LUMA = 1.3 * vec3(0.299, 0.587, 0.114);\n\
        \n\
        float linStep(float edge0, float edge1, float x){\n\
          float val = (x - edge0) / (edge1 - edge0);\n\
          return clamp(val, 0.0, 1.0);\n\
        }\n\
        \n\
        void main(void){\n\
          vec3 videoColor = texture2D(samplerVideo, vUV).rgb;\n\
          vec3 videoColorGs = vec3(1., 1., 1.) * dot(videoColor, LUMA);\n\
          \n\
          float alpha = 1.0; // Tidak ada pembatas yang halus\n\
          alpha *= linStep(-1.0, -0.95, abs(iVal)); // Interior\n\
          alpha *= 0.5 + 0.5 * linStep(1.0, 0.6, abs(iVal)); // Pembatas eksterior yang halus\n\
          \n\
          float alphaClamped = uLipstickColorAlpha.a * alpha;\n\
          \n\
          vec3 color = videoColorGs * uLipstickColorAlpha.rgb;\n\
          gl_FragColor = vec4(color, alphaClamped);\n\
        }",
        uniforms: [
            {
                name: "uLipstickColorAlpha",
                value: [1, 0, 0.3, 0],
            },
        ],
    }; // END SHAPELIPS

    const SHAPEEYES = {
        name: "EYES",
        points: [
            "eyeRightInt0", // 0
            "eyeRightTop0",
            "eyeRightTop1",
            "eyeRightExt0",
            "eyeRightOut0",
            "eyeRightOut1", // 5
            "eyeRightOut2",
            "eyeRightOut3",

            "eyeLeftInt0",
            "eyeLeftTop0",
            "eyeLeftTop1", // 10
            "eyeLeftExt0",
            "eyeLeftOut0",
            "eyeLeftOut1",
            "eyeLeftOut2",
            "eyeLeftOut3", // 15
        ],
        iVals: [
            [1], // eyeRightInt0
            [1], // eyeRightTop0
            [1], // eyeRightTop1
            [1], // eyeRightExt0
            [1], // eyeRightOut0
            [-1], // eyeRightOut1
            [-1], // eyeRightOut2
            [-1], // eyeRightOut3

            [1], // eyeLeftInt0
            [1], // eyeLeftTop0
            [1], // eyeLeftTop1
            [1], // eyeLeftExt0
            [1], // eyeLeftOut0
            [-1], // eyeLeftOut1
            [-1], // eyeLeftOut2
            [-1], // eyeLeftOut3
        ],
        tesselation: [
            // upper right eye;
            0, 6, 7, 0, 1, 6, 1, 5, 6, 2, 5, 1, 2, 4, 5, 3, 4, 2,

            // upper left eye:
            8, 15, 14, 9, 8, 14, 14, 13, 9, 9, 13, 10, 10, 13, 12, 11, 10, 12,
        ],
        interpolations: [
            // top of right eye smoother:
            {
                tangentInfluences: [2, 2, 2],
                points: [0, 1, 2],
                ks: [-0.5, 0.5], // between -1 and 1
            },
            {
                tangentInfluences: [2, 2, 2],
                points: [0, 1, 2],
                ks: [0.5, -0.5], // between -1 and 1
            },

            // right eyebrow smoother:
            {
                tangentInfluences: [2, 2, 2],
                points: [3, 4, 5],
                ks: [0.5, -0.5], // between -1 and 1
            },
            {
                tangentInfluences: [2, 2, 2],
                points: [4, 5, 6],
                ks: [-0.5, 0.5], // between -1 and 1
            },
            {
                tangentInfluences: [2, 2, 2],
                points: [5, 6, 7],
                ks: [-0.5, 0.5], // between -1 and 1
            },
            {
                tangentInfluences: [2, 2, 2],
                points: [6, 7, 0],
                ks: [-0.5, 0.5], // between -1 and 1
            },

            // top of left eye smoother:
            {
                tangentInfluences: [2, 2, 2],
                points: [8, 9, 10],
                ks: [-0.5, 0.5], // between -1 and 1
            },
            {
                tangentInfluences: [2, 2, 2],
                points: [8, 9, 10],
                ks: [0.5, -0.5], // between -1 and 1
            },

            // left eyebrow smoother:
            {
                tangentInfluences: [2, 2, 2],
                points: [11, 12, 13],
                ks: [0.5, -0.5], // between -1 and 1
            },
            {
                tangentInfluences: [2, 2, 2],
                points: [12, 13, 14],
                ks: [-0.5, 0.5], // between -1 and 1
            },
            {
                tangentInfluences: [2, 2, 2],
                points: [13, 14, 15],
                ks: [-0.5, 0.5], // between -1 and 1
            },
            {
                tangentInfluences: [2, 2, 2],
                points: [14, 15, 8],
                ks: [-0.5, 0.5], // between -1 and 1
            },
        ],
        outlines: [
            // right top eye higher:
            {
                points: [0, 1, 2, 3, 4, 5, 6, 7],
                displacements: [-0.07, -0.03, -0.01, -0.05, 0, 0, 0, 0],
            },
            // left top eye higher:
            {
                points: [8, 9, 10, 11, 12, 13, 14, 15],
                displacements: [-0.07, -0.03, -0.01, -0.05, 0, 0, 0, 0],
            },
        ],
        GLSLFragmentSource:
            "void main(void){\n\
            float alphaMax = 0.6;\n\
            float borderHardness = 0.6; // 0.001 -> very hard, 1 -> soft border\n\
            float alpha = alphaMax * pow(0.5 + iVal * 0.5, borderHardness);\n\
            gl_FragColor = vec4(uEyeColor.rgb, alpha * uEyeColor.a);\n\
          }",
        uniforms: [
            {
                name: "uEyeColor",
                value: [0.4, 0.1, 1.0, 0], // Contoh nilai warna mata dengan alpha
            },
        ],
    }; //end SHAPEEYES

    const SHAPECHEEKS = {
        name: "CHEEKS",
        points: [
            "cheekRightExt0",
            "cheekRightExt1",
            "cheekRightExt2",
            "cheekRightExt3",
            "cheekRightExt4",
            "cheekRightExt5",
            "cheekRightInt0",

            "cheekLeftExt0",
            "cheekLeftExt1",
            "cheekLeftExt2",
            "cheekLeftExt3",
            "cheekLeftExt4",
            "cheekLeftExt5",
            "cheekLeftInt0",
        ],
        iVals: [
            [-1], // cheekRightExt0
            [-1], // cheekRightExt1
            [-1], // cheekRightExt2
            [-1], // cheekRightExt3
            [-1], // cheekRightExt4
            [-1], // cheekRightExt5
            [1], // cheekRightInt0

            [-1], // cheekLeftExt0
            [-1], // cheekLeftExt1
            [-1], // cheekLeftExt2
            [-1], // cheekLeftExt3
            [-1], // cheekLeftExt4
            [-1], // cheekLeftExt5
            [1], // cheekLeftInt0
        ],
        tesselation: [
            // right cheek:
            0,
            1,
            6,
            1,
            2,
            6,
            2,
            3,
            6,
            3,
            4,
            6,
            4,
            5,
            6,
            5,
            0,
            6, //*/

            // left cheek:
            7,
            8,
            13,
            8,
            9,
            13,
            9,
            10,
            13,
            10,
            11,
            13,
            11,
            12,
            13,
            12,
            7,
            13,
        ],
        interpolations: [],
        outlines: [],
        GLSLFragmentSource:
            "void main(void){\n\
          float alphaMax = 0.5;\n\
          float borderHardness = 0.4; // 0.001 -> very hard, 1 -> soft border\n\
          float alpha = alphaMax * pow(0.5 + iVal * 0.5, borderHardness);\n\
          gl_FragColor = vec4(uBlushColor.rgb, uBlushColor.a * alpha);\n\
        }",

        // shader uniforms:
        uniforms: [
            {
                name: "uBlushColor",
                value: [0.81, 0.2, 0.26, 0],
            },
        ],
    }; //end SHAPECHEEKS

    function start() {
        WebARRocksFaceShape2DHelper.init({
            NNCPath: BASE_URL + "/assets/webarrock/neuralNets/NN_MAKEUP_2.json",
            canvasVideo: _canvasVideo,
            canvasAR: _canvasAR,
            shapes: [SHAPELIPS, SHAPEEYES, SHAPECHEEKS],
        })
            .then(function () {
                $("#loading").addClass("d-none");

                //run owl
                $(".carousel-material-list").owlCarousel({
                    loop: false,
                    margin: 10,
                    nav: false,
                    autoWidth: true,
                });

                // LIPS
                createCard(0);
                // CHEEKS
                createCard(1);
                // EYES
                createCard(2);

                //set no color
            })
            .catch(function (err) {
                throw new Error(err);
            });
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

    function createCard(index) {
        let _material_card_list = ``;
        let _material_card_list_container = ``;

        //iterate color
        colors[index].forEach(function (color, key) {
            _material_card_list += `
                                <div class="card-item card-item-${index} card-item-${index}-${key}" data-material-index="${index}" data-current-material="${key}" data-color="${color}" style="background-color: ${hexToRgb(
                color
            )};"></div>`;
        });

        // gabungkan semua
        _material_card_list_container = `
            <div class="material-list-container-${index} material-list-container justify-content-start tab-pane fade" id="material-list-container-${index}" role="tabpanel">
                <div class="unselected-container unselected-container-${index} d-flex align-items-center justify-content-center">
                    <img src="${
                        BASE_URL + "/assets/others/unselected.png"
                    }" class="unselected-img unselected-material-btn btn-rounded" data-material-index="${index}">
                </div>
                <div class="material-list-${index} owl-carousel owl-theme">
                    ${_material_card_list}
                </div>
            </div>
        `;

        // append all
        $("#pillsMaterialList").append(_material_card_list_container);

        //run owl
        $(".material-list-" + index).owlCarousel({
            loop: false,
            nav: false,
            autoWidth: true,
        });

        $(".material-list-container-" + index).addClass("d-none");

        $(".material-list-container-0").removeClass("d-none");
        $(".material-list-container-0").addClass("d-flex show active");
    }

    // buat fungsi card click
    $(document).on("click", ".card-item", function () {
        let color = $(this).data("color");
        let materialIndex = $(this).data("material-index");
        let currentMaterial = $(this).data("current-material");

        $(".unselected-container-" + materialIndex).removeClass(
            "unselected-material-active"
        );

        if (materialIndex == 0) {
            WebARRocksFaceShape2DHelper.set_uniformValue(
                "LIPS",
                "uLipstickColorAlpha",
                hexToRgbArray(color)
            );
        }

        if (materialIndex == 1) {
            WebARRocksFaceShape2DHelper.set_uniformValue(
                "CHEEKS",
                "uBlushColor",
                hexToRgbArray(color)
            );
        }

        if (materialIndex == 2) {
            WebARRocksFaceShape2DHelper.set_uniformValue(
                "EYES",
                "uEyeColor",
                hexToRgbArray(color)
            );
        }

        //remove card active
        $(".card-item-" + materialIndex).removeClass("card-item-active");

        // set card active baru
        $(".card-item-" + materialIndex + "-" + currentMaterial).addClass(
            "card-item-active"
        );
    });

    // fungsi create card berdasarkan tab yg diklik
    $(document).on("click", ".tab-selected", function () {
        let currentMaterial = $(this).data("material");

        // hapus tab-active yang ada
        $(".tab-selected").removeClass("tab-active");

        // tambahkan tab active ke currenttab
        $("#material-" + currentMaterial + "-tab").addClass("tab-active");

        $(".material-list-container").addClass("d-none");
        $(".material-list-container").removeClass("d-flex active show");

        $(".material-list-container-" + currentMaterial).addClass(
            "d-flex active show"
        );
        $(".material-list-container-" + currentMaterial).removeClass("d-none");
    });

    // sembunyikan material
    $(document).on("click", ".unselected-material-btn", function () {
        let materialIndex = $(this).data("material-index");
        $(".unselected-container-" + materialIndex).addClass(
            "unselected-material-active"
        );

        if (materialIndex == 0) {
            WebARRocksFaceShape2DHelper.set_uniformValue(
                "LIPS",
                "uLipstickColorAlpha",
                [0, 0, 0, 0]
            );
        }

        if (materialIndex == 1) {
            WebARRocksFaceShape2DHelper.set_uniformValue(
                "EYES",
                "uEyeColor",
                [0, 0, 0, 0]
            );
        }

        if (materialIndex == 2) {
            WebARRocksFaceShape2DHelper.set_uniformValue(
                "CHEEKS",
                "uBlushColor",
                [0, 0, 0, 0]
            );
        }

        $(".card-item-" + materialIndex).removeClass("card-item-active");
    });

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

    function hexToRgbArray(hex) {
        // Remove the hash at the start if it's there
        hex = hex.replace(/^#/, "");

        // Parse the r, g, b values
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;

        // Return as an array of floats normalized to [0.0, 1.0]
        return [r / 255, g / 255, b / 255, 0.3];
    }
});
