$(window).on("load", function () {
    let productId = $("input[name=product]").val();
    $.ajax({
        url: BASE_URL + "/product/earring/get-item/" + productId,
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

            const PI = Math.PI;
            const _settings = {
                // 3D model:
                GLTFModelURL: data,

                // lighting:
                envmapURL:
                    BASE_URL + "/assets/webarrock/assets/venice_sunset_512.hdr",
                pointLightIntensity: 0.8,
                pointLightY: 200, // larger -> move the pointLight to the top
                hemiLightIntensity: 0.8,

                // bloom (set to null to disable):
                bloom: {
                    threshold: 0.5, //0.99,
                    strength: 8,
                    radius: 0.6,
                },

                // temporal anti aliasing. Number of samples. 0 -> disabled:
                taaLevel: 3,

                // occluder parameters:
                earsOccluderCylinderRadius: 2,
                earsOccluderCylinderHeight: 0.5, // height of the cylinder, so depth in fact
                earsOccluderCylinderOffset: [0, 1, 0], // +Y -> pull up
                earsOccluderCylinderEuler: [0, PI / 6, PI / 2, "XYZ"],

                // debug flags:
                debugCube: false,
                debugOccluder: false, // set to true to tune earsOccluderCylinder* settings
            };

            const _canvases = {
                face: null,
                three: null,
            };

            let _three = null;

            function start() {
                // Init WebAR.rocks.face through the earrings 3D helper:
                WebARRocksFaceEarrings3DHelper.init({
                    NN:
                        BASE_URL +
                        "/assets/webarrock/neuralNets/NN_EARS_4.json",
                    taaLevel: _settings.taaLevel,
                    canvasFace: _canvases.face,
                    canvasThree: _canvases.three,
                    debugOccluder: _settings.debugOccluder,
                    //,videoURL: '../../../../testVideos/1032526922-hd.mov'
                })
                    .then(function (three) {
                        _three = three;
                        if (_settings.debugCube) {
                            const debugCubeMesh = new THREE.Mesh(
                                new THREE.BoxGeometry(2, 2, 2),
                                new THREE.MeshNormalMaterial()
                            );
                            _three.earringRight.add(debugCubeMesh);
                            _three.earringLeft.add(debugCubeMesh.clone());
                        }

                        // improve WebGLRenderer settings:
                        _three.renderer.toneMapping =
                            THREE.ACESFilmicToneMapping;
                        _three.renderer.outputEncoding = THREE.sRGBEncoding;

                        set_postprocessing();

                        set_lighting();

                        if (_settings.GLTFModelURL) {
                            load_GLTF(_settings.GLTFModelURL, true, true);
                        }

                        set_occluders();

                        if (check_isAppleCrap()) {
                            WebARRocksFaceEarrings3DHelper.resize(
                                _canvases.three.width,
                                _canvases.three.height - 0.001
                            );
                        }

                        $("#loading").addClass("d-none");
                    })
                    .catch(function (err) {
                        throw new Error(err);
                    });
            }

            // return true if IOS:
            function check_isAppleCrap() {
                return (
                    /iPad|iPhone|iPod/.test(navigator.platform) ||
                    (navigator.platform === "MacIntel" &&
                        navigator.maxTouchPoints > 1)
                );
            }

            function set_postprocessing() {
                // bloom:
                if (_settings.bloom) {
                    // see https://threejs.org/examples/#webgl_postprocessing_unreal_bloom
                    // create the bloom postprocessing pass:
                    const bloom = _settings.bloom;
                    const rendererSize = new THREE.Vector2();
                    _three.renderer.getSize(rendererSize);
                    const bloomPass = new THREE.UnrealBloomPass(
                        rendererSize,
                        bloom.strength,
                        bloom.radius,
                        bloom.threshold
                    );

                    _three.composer.addPass(bloomPass);
                }
            }

            function set_lighting() {
                if (_settings.envmapURL) {
                    // image based lighting:
                    const pmremGenerator = new THREE.PMREMGenerator(
                        _three.renderer
                    );
                    pmremGenerator.compileEquirectangularShader();

                    new THREE.RGBELoader()
                        .setDataType(THREE.HalfFloatType)
                        .load(_settings.envmapURL, function (texture) {
                            const envMap =
                                pmremGenerator.fromEquirectangular(
                                    texture
                                ).texture;
                            pmremGenerator.dispose();
                            _three.scene.environment = envMap;
                        });
                }

                // simple lighting:
                //  We add a soft light. Should not be necessary if we use an envmap:
                if (_settings.hemiLightIntensity > 0) {
                    const hemiLight = new THREE.HemisphereLight(
                        0xffffff,
                        0x000000,
                        _settings.hemiLightIntensity
                    );
                    _three.scene.add(hemiLight);
                }

                // add a pointLight to highlight specular lighting:
                if (_settings.pointLightIntensity > 0) {
                    const pointLight = new THREE.PointLight(
                        0xffffff,
                        _settings.pointLightIntensity
                    );
                    pointLight.position.set(0, _settings.pointLightY, 0);
                    _three.scene.add(pointLight);
                }
            }

            function load_GLTF(modelURL, isRight, isLeft) {
                let _material_tab = ``;

                new THREE.GLTFLoader().load(modelURL, function (gltf) {
                    const model = gltf.scene;

                    model.scale.multiplyScalar(100); // because the model is exported in meters. convert it to cm

                    set_shinyMetal(model);

                    let i = 0;
                    // travese to create materials
                    model.traverse(function (child) {
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
                            if (colors.length > 0 && colors[i] != undefined) {
                                // assing color to materials
                                materials[i].savedColors =
                                    materials[i].savedColors ||
                                    (colors.length > 0 &&
                                        colors[i] != undefined)
                                        ? colors[i]
                                        : [];

                                // asign warna dasar menjadi warna pertama
                                materials[i].color.setStyle(colors[i][0]);

                                WebARRocksFaceEarrings3DHelper.rerender_object();
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

                    _three.earringRight.add(model);
                    _three.earringLeft.add(model.clone());
                });
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
                        <div class="unselected-container d-flex align-items-center justify-content-center">
                            <img src="${
                                BASE_URL + "/assets/others/unselected.png"
                            }" class="unselected-img">
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

            function set_shinyMetal(model) {
                model.traverse(function (threeStuff) {
                    if (!threeStuff.isMesh) {
                        return;
                    }
                    const mat = threeStuff.material;
                    mat.roughness = 0.0;
                    mat.metalness = 1.0;
                    mat.refractionRatio = 1.0;
                });
            }

            function set_occluders() {
                const occluderRightGeom = new THREE.CylinderGeometry(
                    _settings.earsOccluderCylinderRadius,
                    _settings.earsOccluderCylinderRadius,
                    _settings.earsOccluderCylinderHeight
                );
                const matrix = new THREE.Matrix4().makeRotationFromEuler(
                    new THREE.Euler().fromArray(
                        _settings.earsOccluderCylinderEuler
                    )
                );
                matrix.setPosition(
                    new THREE.Vector3().fromArray(
                        _settings.earsOccluderCylinderOffset
                    )
                );
                occluderRightGeom.applyMatrix4(matrix);
                WebARRocksFaceEarrings3DHelper.add_threeEarsOccluders(
                    occluderRightGeom
                );
            }

            function main() {
                // get the 2 canvas from the DOM:
                _canvases.face = document.getElementById("faceTrackerCanvas");
                _canvases.three = document.getElementById("VTOCanvas");

                // Set the canvas to fullscreen
                // and add an event handler to capture window resize:
                WebARRocksResizer.size_canvas({
                    isFullScreen: true,
                    canvas: _canvases.face, // WebARRocksFace main canvas
                    overlayCanvas: [_canvases.three], // other canvas which should be resized at the same size of the main canvas
                    callback: start,
                    onResize: WebARRocksFaceEarrings3DHelper.resize,
                });
            }

            main();

            // buat fungsi card click
            $(document).on("click", ".card-item", function () {
                let color = $(this).data("color");
                let materialIndex = $(this).data("material-index");
                let currentMaterial = $(this).data("current-material");

                //ubah warna
                materials[materialIndex].color.setStyle(color);

                WebARRocksFaceEarrings3DHelper.rerender_object();

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
        },
    });
});
