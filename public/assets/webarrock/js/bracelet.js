// load asset list
$(window).on("load", function () {
    let productId = $("input[name=product]").val();
    $.ajax({
        url: BASE_URL + "/product/bracelet/get-item/" + productId,
        type: "GET",
        success: function (response) {
            let data =
                response.fullUrl +
                "/" +
                response.data.base_folder +
                "/" +
                response.data.filename;
            let colors = JSON.parse(response.data.color);
            let imagesData = JSON.parse(response.data.saved_images);
            let savedImages = [];
            let materials = [];

            // restruktur array saved Image
            colors.forEach(function (colors, material) {
                savedImages[material] = savedImages[material] || [];
                colors.forEach(function (color, current) {
                    savedImages[material].push(null);
                    imagesData.forEach(function (images, index) {
                        images.forEach(function (image, currentImage) {
                            if (
                                image.current == current &&
                                image.material == material
                            ) {
                                savedImages[material][current] =
                                    response.fullUrl + "/" + image.filepath;
                            }
                        });
                    });
                });
            });

            const NNPath = BASE_URL + "/assets/webarrock/neuralNets/";
            const NNWristVersion = "27";
            const wristModesCommonSettings = {
                threshold: 0.83, // detection sensitivity, between 0 and 1

                poseLandmarksLabels: [
                    // wristRightBottom not working
                    "wristBack",
                    "wristLeft",
                    "wristRight",
                    "wristPalm",
                    "wristPalmTop",
                    "wristBackTop",
                    "wristRightBottom",
                    "wristLeftBottom",
                    //"wristBack", "wristRight", "wristPalm", "wristPalmTop", "wristBackTop", "wristLeft"
                ],
                isPoseFilter: true,

                // soft occluder parameters (soft because we apply a fading gradient)
                occluderType: "SOFTCYLINDER",
                occluderRadiusRange: [4, 4.7], // first value: minimum or interior radius of the occluder (full transparency).
                // second value: maximum or exterior radius of the occluder (full opacity, no occluding effect)
                occluderHeight: 45, // height of the cylinder
                occluderOffset: [0, 0, 0], // relative to the wrist 3D model
                occluderQuaternion: [0.707, 0, 0, 0.707], // rotation of Math.PI/2 along X axis,
                occluderFlattenCoeff: 0.5, // 1 -> occluder is a cylinder 0.5 -> flatten by 50%

                objectPointsPositionFactors: [1.0, 1.0, 1.0], // factors to apply to point positions to lower pose angles - dirty tweak

                landmarksStabilizerSpec: {
                    minCutOff: 0.001,
                    beta: 4,
                    freqRange: [2, 144],
                    forceFilterNNInputPxRange: [2.5, 6], //[1.5, 4],
                },
            };

            const wristModelCommonSettings = {
                URL: data,

                scale: 1.35 * 1.462,
                offset: [0.076, -0.916, -0.504],
                quaternion: [0, 0, 0, 1], // Format: X,Y,Z,W (and not W,X,Y,Z like Blender)
            };

            const _settings = {
                VTOModes: {
                    wrist: Object.assign(
                        {
                            //NNsPaths: [NNPath + 'NN_WRIST_RP_' + NNWristVersion + '.json', NNPath + 'NN_WRIST_RB_' + NNWristVersion + '.json']
                            NNsPaths: [
                                NNPath + "NN_WRIST_" + NNWristVersion + ".json",
                            ],
                        },
                        wristModesCommonSettings
                    ),
                },
                models: {
                    wrist: Object.assign(
                        {
                            VTOMode: "wrist",
                        },
                        wristModelCommonSettings
                    ),
                },
                initialModel: "wrist",

                // debug flags:
                debugDisplayLandmarks: false,
                debugMeshMaterial: false,
                debugOccluder: false,
                debugWholeHand: false,
            };

            let _VTOMode = null;
            let _VTOModel = null;

            const _states = {
                notLoaded: -1,
                loading: 0,
                idle: 1,
                running: 2,
                busy: 3,
            };

            let _state = _states.notLoaded;
            let _isSelfieCam = true;
            let _isInstructionsHidden = false;

            function setFullScreen(cv) {
                const pixelRatio = window.devicePixelRatio || 1;
                cv.width = pixelRatio * window.innerWidth;
                cv.height = pixelRatio * window.innerHeight;
            }

            function is_mobileOrTablet() {
                let check = false;
                // from https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
                if (
                    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
                        navigator.userAgent
                    ) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                        navigator.userAgent.substr(0, 4)
                    )
                ) {
                    check = true;
                }
                return check;
            }

            // entry point:
            function main() {
                _state = _states.loading;

                // get canvases and size them:
                const handTrackerCanvas =
                    document.getElementById("handTrackerCanvas");
                const VTOCanvas = document.getElementById("VTOCanvas");

                console.log(_settings);
                // initial VTO mode:
                let initialModelSettings =
                    _settings.models[_settings.initialModel];
                _VTOMode = initialModelSettings.VTOMode; // "ring" or "wrist"
                let VTOModeSettings = _settings.VTOModes[_VTOMode];

                setFullScreen(handTrackerCanvas);
                setFullScreen(VTOCanvas);
                set_canvasMirroring(!is_mobileOrTablet());

                // initialize Helper:
                HandTrackerThreeHelper.init({
                    stabilizationSettings: {},
                    scanSettings: {
                        translationScalingFactors: [0.1, 0.1, 0.1],
                    },
                    videoSettings: get_videoSettings(),
                    landmarksStabilizerSpec:
                        VTOModeSettings.landmarksStabilizerSpec,
                    objectPointsPositionFactors:
                        VTOModeSettings.objectPointsPositionFactors,
                    poseLandmarksLabels: VTOModeSettings.poseLandmarksLabels,
                    poseFilter: VTOModeSettings.isPoseFilter
                        ? PoseFlipFilter.instance({})
                        : null,
                    NNsPaths: VTOModeSettings.NNsPaths,
                    threshold: VTOModeSettings.threshold,
                    VTOCanvas: VTOCanvas,
                    callbackTrack: callbackTrack,
                    handTrackerCanvas: handTrackerCanvas,
                    debugDisplayLandmarks: _settings.debugDisplayLandmarks,
                })
                    .then(start)
                    .catch(function (err) {
                        throw new Error(err);
                    });
            }

            function setup_lighting(three) {
                const scene = three.scene;

                const pmremGenerator = new THREE.PMREMGenerator(three.renderer);
                pmremGenerator.compileEquirectangularShader();

                new THREE.RGBELoader()
                    .setDataType(THREE.HalfFloatType)
                    .load(
                        BASE_URL + "/assets/others/hotel_room_1k.hdr",
                        function (texture) {
                            const envMap =
                                pmremGenerator.fromEquirectangular(
                                    texture
                                ).texture;
                            pmremGenerator.dispose();
                            scene.environment = envMap;
                        }
                    );

                // improve WebGLRenderer settings:
                three.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                three.renderer.outputEncoding = THREE.sRGBEncoding;
            }

            function change_VTOMode(newVTOMode) {
                console.log(
                    "INFO in main.js - change_VTOMode(): change VTO Mode to ",
                    newVTOMode
                );

                // clear everything including occluders:
                HandTrackerThreeHelper.clear_threeObjects(true);

                const VTOModeSettings = _settings.VTOModes[newVTOMode];
                return HandTrackerThreeHelper.update({
                    landmarksStabilizerSpec:
                        VTOModeSettings.landmarksStabilizerSpec,
                    objectPointsPositionFactors:
                        VTOModeSettings.objectPointsPositionFactors,
                    poseLandmarksLabels: VTOModeSettings.poseLandmarksLabels,
                    poseFilter: VTOModeSettings.isPoseFilter
                        ? PoseFlipFilter.instance({})
                        : null,
                    NNsPaths: VTOModeSettings.NNsPaths,
                    threshold: VTOModeSettings.threshold,
                })
                    .then(function () {
                        _VTOMode = newVTOMode;
                        set_occluder();
                    })
                    .then(function () {
                        _state = _states.idle;
                    });
            }

            function load_model(modelId, threeLoadingManager) {
                let _material_tab = ``;

                if (
                    (_state !== _states.running && _state !== _states.idle) ||
                    modelId === _VTOModel
                ) {
                    return; // model is already loaded or state is busy or loading
                }
                _state = _states.busy;
                const modelSettings = _settings.models[modelId];

                // remove previous model but not occluders:
                HandTrackerThreeHelper.clear_threeObjects(false);

                // look if we should change the VTOMode:
                if (modelSettings.VTOMode !== _VTOMode) {
                    change_VTOMode(modelSettings.VTOMode).then(function () {
                        load_model(modelId, threeLoadingManager);
                    });
                    return;
                }

                // load new model:
                new THREE.GLTFLoader(threeLoadingManager).load(
                    modelSettings.URL,
                    function (model) {
                        const me = model.scene.children[0]; // instance of THREE.Mesh
                        let data = model.scene;
                        me.scale.set(1, 1, 1);

                        // tweak the material:
                        if (_settings.debugMeshMaterial) {
                            me.traverse(function (child) {
                                if (child.material) {
                                    child.material =
                                        new THREE.MeshNormalMaterial();
                                }
                            });
                        }

                        // tweak position, scale and rotation:
                        if (modelSettings.scale) {
                            me.scale.multiplyScalar(modelSettings.scale);
                        }

                        if (modelSettings.offset) {
                            const d = modelSettings.offset;
                            const displacement = new THREE.Vector3(
                                d[0],
                                d[2],
                                -d[1]
                            ); // inverse Y and Z
                            me.position.add(displacement);
                        }

                        if (modelSettings.quaternion) {
                            const q = modelSettings.quaternion;
                            me.quaternion.set(q[0], q[2], -q[1], q[3]);
                        }

                        let i = 0;
                        // travese to create materials
                        data.traverse(function (child) {
                            if (
                                child instanceof THREE.Mesh &&
                                !materials.includes(child.material)
                            ) {
                                materials.push(child.material);

                                // assign name to materials
                                materials[i].name =
                                    materials[i].name ||
                                    "Material " + (materials.length - 1);

                                // render card
                                if (
                                    colors.length > 0 &&
                                    colors[i] != undefined
                                ) {
                                    // assing color to materials
                                    materials[i].savedColors =
                                        materials[i].savedColors ||
                                        (colors.length > 0 &&
                                            colors[i] != undefined)
                                            ? colors[i]
                                            : [];

                                    // asign warna dasar menjadi warna pertama
                                    materials[i].color.setStyle(colors[i][0]);

                                    HandTrackerThreeHelper.rerender_object();
                                }

                                // menampilkan card list jika color > 1
                                if (
                                    colors.length > 0 &&
                                    colors[i] != undefined &&
                                    colors[i].length > 1
                                ) {
                                    console.log(materials[i].name);
                                    console.log(
                                        "total color saved " + colors[i].length
                                    );
                                    _material_tab += `
                                    <button class="btn btn-tab pb-1 p-0 fs-material-list text-uppercase text-body font-weight-bold nav-item tab-selected ${
                                        i == 0 ? "tab-active" : ""
                                    } " id="material-${i}-tab" data-material="${i}" data-toggle="tab" href="#material-list-container-${i}" role="tab">
                                        ${materials[i].name}
                                    </button>
                                `;
                                    createCard(i);
                                }

                                i++;
                            }
                            $("#materialTab").html(_material_tab);
                        });

                        // add to the tracker:
                        HandTrackerThreeHelper.add_threeObject(me);

                        //run owl
                        $(".carousel-material-list").owlCarousel({
                            loop: false,
                            margin: 10,
                            nav: false,
                            autoWidth: true,
                            responsive: {
                                0: {
                                    items: 5,
                                },
                                600: {
                                    items: 10,
                                },
                                1000: {
                                    items: 10,
                                },
                            },
                        });

                        _state = _states.running;
                    }
                );
            }

            function createCard(index) {
                let _material_card_list = ``;
                let _material_card_list_container = ``;

                //iterate color
                materials[index].savedColors.forEach(function (color, key) {
                    if (savedImages[index][key] !== null) {
                        let image = savedImages[index][key];
                        _material_card_list += `
                                            <img src="${image}" alt="icon" class="card-item card-item-${index} card-item-${index}-${key}" data-material-index="${index}" data-current-material="${key}" data-color="${color}"/>
                                         `;
                    } else {
                        _material_card_list += `
                                        <div class="card-item card-item-${index} card-item-${index}-${key}" data-material-index="${index}" data-current-material="${key}" data-color="${color}" style="background-color: ${hexToRgb(
                            color
                        )};"></div>
                                    `;
                    }
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

            function start(three) {
                VTOCanvas.style.zIndex = 3; // fix a weird bug on iOS15 / safari

                setup_lighting(three);

                three.loadingManager.onLoad = function () {
                    console.log(
                        "INFO in main.js: All THREE.js stuffs are loaded"
                    );
                    hide_loading();
                    _state = _states.running;
                };

                if (_settings.debugWholeHand) {
                    add_wholeHand(three.loadingManager);
                }

                set_occluder()
                    .then(function () {
                        _state = _states.idle;
                    })
                    .then(function () {
                        load_model(
                            _settings.initialModel,
                            three.loadingManager
                        );
                    });
            }

            function add_wholeHand(threeLoadingManager) {
                new THREE.GLTFLoader(threeLoadingManager).load(
                    BASE_URL + "/assets/webarrock/debug/debugHand.glb",
                    function (model) {
                        const debugHandModel = model.scene.children[0];
                        debugHandModel.traverse(function (threeStuff) {
                            if (threeStuff.material) {
                                threeStuff.material =
                                    new THREE.MeshNormalMaterial();
                            }
                        });
                        HandTrackerThreeHelper.add_threeObject(debugHandModel);
                    }
                );
            }

            function set_occluder() {
                const VTOModeSettings = _settings.VTOModes[_VTOMode];

                if (VTOModeSettings.occluderType === "SOFTCYLINDER") {
                    return add_softOccluder(VTOModeSettings);
                } else if (VTOModeSettings.occluderType === "MODEL") {
                    return add_hardOccluder(VTOModeSettings);
                } else {
                    // no occluder specified
                    return Promise.resolve();
                }
            }

            function add_hardOccluder(VTOModeSettings) {
                return new Promise(function (accept, reject) {
                    new THREE.GLTFLoader().load(
                        VTOModeSettings.occluderModelURL,
                        function (model) {
                            const me = model.scene.children[0]; // instance of THREE.Mesh
                            me.scale.multiplyScalar(
                                VTOModeSettings.occluderScale
                            );

                            if (_settings.debugOccluder) {
                                me.material = new THREE.MeshNormalMaterial();
                                return;
                            }
                            HandTrackerThreeHelper.add_threeOccluder(me);
                            accept();
                        }
                    );
                });
            }

            function add_softOccluder(VTOModeSettings) {
                // add a soft occluder (for the wrist for example):
                const occluderRadius = VTOModeSettings.occluderRadiusRange[1];
                const occluderMesh = new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        occluderRadius,
                        occluderRadius,
                        VTOModeSettings.occluderHeight,
                        32,
                        1,
                        true
                    ),
                    new THREE.MeshNormalMaterial()
                );
                const dr =
                    VTOModeSettings.occluderRadiusRange[1] -
                    VTOModeSettings.occluderRadiusRange[0];
                occluderMesh.position.fromArray(VTOModeSettings.occluderOffset);
                occluderMesh.quaternion.fromArray(
                    VTOModeSettings.occluderQuaternion
                );
                occluderMesh.scale.set(
                    1.0,
                    1.0,
                    VTOModeSettings.occluderFlattenCoeff
                );
                HandTrackerThreeHelper.add_threeSoftOccluder(
                    occluderMesh,
                    occluderRadius,
                    dr,
                    _settings.debugOccluder
                );
                return Promise.resolve();
            }

            function get_videoSettings() {
                return {
                    facingMode: _isSelfieCam ? "environment" : "user",
                };
            }

            function flip_camera() {
                if (_state !== _states.running || !is_mobileOrTablet()) {
                    return;
                }
                _state = _states.busy;
                WEBARROCKSHAND.update_videoSettings(get_videoSettings())
                    .then(function () {
                        _isSelfieCam = !_isSelfieCam;
                        _state = _states.running;
                        // mirror canvas using CSS in selfie cam mode:
                        set_canvasMirroring(_isSelfieCam);
                        console.log(
                            "INFO in main.js: Camera flipped successfully"
                        );
                    })
                    .catch(function (err) {
                        console.log(
                            "ERROR in main.js: Cannot flip camera -",
                            err
                        );
                    });
            }

            function set_canvasMirroring(isMirror) {
                document.getElementById("canvases").style.transform = isMirror
                    ? "rotateY(180deg)"
                    : "";
            }

            function hide_loading() {
                // remove loading:
                const domLoading = document.getElementById("loading");
                domLoading.style.opacity = 0;
                setTimeout(function () {
                    domLoading.parentNode.removeChild(domLoading);
                }, 800);
            }

            function callbackTrack(detectState) {
                if (detectState.isDetected) {
                    if (!_isInstructionsHidden) {
                        hide_instructions();
                    }
                }
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

            // buat fungsi card click
            $(document).on("click", ".card-item", function () {
                let color = $(this).data("color");
                let materialIndex = $(this).data("material-index");
                let currentMaterial = $(this).data("current-material");

                materials[materialIndex].visible = true;
                $(".unselected-container-" + materialIndex).removeClass(
                    "unselected-material-active"
                );

                //ubah warna
                materials[materialIndex].color.setStyle(color);

                HandTrackerThreeHelper.rerender_object();

                //remove card active
                $(".card-item-" + materialIndex).removeClass(
                    "card-item-active"
                );

                // set card active baru
                $(
                    ".card-item-" + materialIndex + "-" + currentMaterial
                ).addClass("card-item-active");
            });

            // fungsi create card berdasarkan tab yg diklik
            $(document).on("click", ".tab-selected", function () {
                let currentMaterial = $(this).data("material");

                // hapus tab-active yang ada
                $(".tab-selected").removeClass("tab-active");

                // tambahkan tab active ke currenttab
                $("#material-" + currentMaterial + "-tab").addClass(
                    "tab-active"
                );

                $(".material-list-container").addClass("d-none");
                $(".material-list-container").removeClass("d-flex active show");

                $(".material-list-container-" + currentMaterial).addClass(
                    "d-flex active show"
                );
                $(".material-list-container-" + currentMaterial).removeClass(
                    "d-none"
                );
            });

            // sembunyikan material
            $(document).on("click", ".unselected-material-btn", function () {
                let materialIndex = $(this).data("material-index");
                materials[materialIndex].visible = false;
                $(".unselected-container-" + materialIndex).addClass(
                    "unselected-material-active"
                );

                $(".card-item-" + materialIndex).removeClass(
                    "card-item-active"
                );
            });

            main();
        },
    });
});

// dont move
function hide_instructions() {
    const domInstructions = document.getElementById("instructions");
    if (!domInstructions) {
        return;
    }
    domInstructions.style.opacity = 0;
    _isInstructionsHidden = true;
    setTimeout(function () {
        domInstructions.parentNode.removeChild(domInstructions);
    }, 800);
}
