$(window).on("load", function () {
    let id = $("input[name=id]").val();
    let name = $("input[name=name]").val();
    $.ajax({
        url: BASE_URL + "/product/lipstick/get-item" + "/" + name + "/" + id,
        type: "GET",
        success: function (response) {
            let _canvasVideo = null,
                _canvasAR = null;

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
                    gl_FragColor = vec4(alpha * uBlushColor, alpha);\n\
                  }",

                // shader uniforms:
                uniforms: [
                    {
                        name: "uBlushColor",
                        value: [0.81, 0.2, 0.26],
                    },
                ],
            }; //end SHAPECHEEKS

            function start() {
                WebARRocksFaceShape2DHelper.init({
                    NNCPath:
                        BASE_URL +
                        "/assets/webarrock/neuralNets/NN_MAKEUP_2.json",
                    canvasVideo: _canvasVideo,
                    canvasAR: _canvasAR,
                    shapes: [SHAPECHEEKS],
                })
                    .then(function () {
                        //  set value to transparent
                        WebARRocksFaceShape2DHelper.set_uniformValue(
                            "CHEEKS",
                            "uBlushColor"
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

                //  set value to transparent
                WebARRocksFaceShape2DHelper.set_uniformValue(
                    "CHEEKS",
                    "uBlushColor",
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
                    "CHEEKS",
                    "uBlushColor"
                );

                $(".card-item").removeClass("card-item-active");
            });
        },
    });
});
