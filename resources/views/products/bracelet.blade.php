@extends('master')
@section('content')
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div class="layout-container">
        <x-sidebar :brand="$brand->name" :url="$brand->slug"/>

        <div class="layout-page">
            <x-navbar :license="$brand->license_active"/>
            <!-- Content wrapper -->
            <div class="content-wrapper">
                <!-- Content -->
                <div class="container-xxl flex-grow-1 container-p-y">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="fw-bold">Bracelet</h4>
                            @if($message = Session::get('message'))
                                @if($status = Session::get('status'))
                                    <div class="alert alert-{{ $status}} alert-dismissible fade show mb-3" role="alert">
                                        {{ $message }}
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                @endif
                            @endif
                            <div class="d-flex justify-content-end mb-3">
                                <button id="showAddProductModal" class="btn btn-primary" >Add New Product</button>
                            </div>
                            @php($i=0)
                            @foreach($products as $product)
                                <div class="card mb-3 shadow-lg">
                                    <div class="card-body">
                                        <h3 class="fw-bold">{{ $product->name }}</h3>
                                        <div class="d-flex justify-content-start">
                                            <button type="button" class="btn-edit btn btn-success btn-sm me-2" data-id="{{ $product->id }}"><i class='bx bx-edit-alt'></i></button>
                                            <form action="{{ route('bracelet.delete', $product->id) }}" method="POST">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-danger btn-sm"><i class='bx bx-trash'></i></button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                @php($i++)
                            @endforeach
                        </div>
                    </div>
                </div>
                <!-- / Content -->
                <div class="content-backdrop fade"></div>
            </div>
            <!-- Content wrapper -->
        </div>

        <!-- Modal add product -->
        <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title" id="addProductModalLabel">Add New Product</h5>
                    </div>
                    <div class="modal-body">
                        <form id="addProduct" enctype="multipart/form-data">
                            <input type="hidden" name="slug" value="{{$brand->slug}}">
                            <input type="hidden" name="brand_id" value="{{ $brand->id }}">
                            <div class="row">
                                <div class="form-group mb-3 col-lg-6 col-12">
                                    <label for="" class="form-label">Product Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="name"  required>
                                </div>
                                <div class="form-group mb-3 col-lg-6 col-12 row">
                                    <div class="form-group col-lg-8 col-12">
                                        <label for="" class="form-label">Model 3d <span class="text-danger">*</span></label>
                                        <input type="file" id="modelFile" class="form-control mb-3" name="modelFile"  required>
                                    </div>
                                    <div class="form-group dropdown col-lg-4 col-12">
                                        <label for="" class="form-label textwhite">List Materials<span class="text-danger">*</span></label>
                                        <button class="btn btn-light border dropdown-toggle w-100" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            List Materials
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <ul id="materialList"></ul>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="row model-container justify-content-center">
                                <div class="col-lg-12 col-md-12 col-12">
                                    <div id="viewer"></div>
                                </div>
                                <div class="col-lg-5 col-md-12 col-12">
                                    <div id="materialColorList">
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mb-3">Add New Product</button>
                            <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal" >Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal edit product -->
        <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title" id="editProductModalLabel">Edit Product</h5>
                    </div>
                    <div class="modal-body">
                        <form id="editProduct" enctype="multipart/form-data">
                            <input type="hidden" name="slug_edit" value="{{$brand->slug}}">
                            <input type="hidden" name="brand_id_edit" value="{{ $brand->id }}">
                            <div class="row">
                                <div class="form-group mb-3 col-lg-6 col-12">
                                    <label for="" class="form-label">Product Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="name_edit"  required>
                                </div>
                                <div class="form-group mb-3 col-lg-6 col-12 row">
                                    <div class="form-group col-lg-8 col-12">
                                        <label for="" class="form-label">Model 3d <span class="text-danger">*</span></label>
                                        <input type="file" id="modelFileEdit" class="form-control mb-3" name="modelFileEdit"  required>
                                    </div>
                                    <div class="form-group dropdown col-lg-4 col-12">
                                        <label for="" class="form-label textwhite">List Materials<span class="text-danger">*</span></label>
                                        <button class="btn btn-light border dropdown-toggle w-100" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                            List Materials
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                            <ul id="materialListEdit"></ul>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="row model-container justify-content-center">
                                <div class="col-lg-12 col-md-12 col-12">
                                    <div id="viewerEdit"></div>
                                </div>
                                <div class="col-lg-5 col-md-12 col-12">
                                    <div id="materialColorListEdit">
                                    </div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mb-3">Edit Product</button>
                            <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal" >Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
        @push('script')
            <script>
                const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
                let materials = []; // Array to store materials
                let savedColors = [];
                let savedImages = [];
                let viewerDiv, scene, camera, renderer;
                let savedCameraPosition;
                let _material_list_template = ``;

                viewerDiv = document.getElementById('viewer');
                renderer = new THREE.WebGLRenderer();
                scene = new THREE.Scene();

                viewerDiv.appendChild(renderer.domElement);

                // Set warna latar belakang renderer menjadi putih
                renderer.setClearColor(0xffffff);

                // Tambahkan directional light
                let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(5, 5, 5);
                scene.add(directionalLight);

                // Tambahkan ambient light
                let ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
                scene.add(ambientLight);

                let light = new THREE.SpotLight(0xffa95c,4);
                light.position.set(-50,50,50);
                light.castShadow = true;
                scene.add( light );

                // Pencahayaan Hemisphere
                let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
                scene.add(hemiLight);

                // Atur pengaturan rendering
                renderer.toneMapping = THREE.ReinhardToneMapping; // Menggunakan Reinhard Tone Mapping
                renderer.toneMappingExposure = 2.3; // Koreksi kecerahan secara global
                renderer.physicallyCorrectLights = true; // Pencahayaan yang lebih akurat

                // Set latar belakang scene menjadi warna solid
                scene.background = new THREE.Color(0xffffff);

                $('#showAddProductModal').on('click', function () {
                    addProductModal.show();
                    $('#addProductModal').on('shown.bs.modal', function () {
                        console.log('modal add call')
                        camera = new THREE.PerspectiveCamera(75, viewerDiv.clientWidth / viewerDiv.clientHeight, 0.1, 1000);

                        if (savedCameraPosition) {
                            camera.position.copy(savedCameraPosition);
                        }

                        //resize
                        renderer.setSize(viewerDiv.clientWidth, viewerDiv.clientHeight);

                        let controls = new THREE.OrbitControls(camera, renderer.domElement);

                        // filemodel upload
                        $('#modelFile').off('change').on('change', function(e) {
                            materials = [];
                            _material_list_template = ``;
                            savedColors = [];
                            savedImages = [];

                            $('#materialColorList').html('');

                            scene.children.forEach(child => {
                                if (!(child instanceof THREE.Light)) {
                                    scene.remove(child);
                                }
                            });

                            let reader = new FileReader();

                            reader.onload = function (event) {
                                let contents = event.target.result;
                                displayModel(contents);
                            };

                            reader.readAsDataURL(e.target.files[0]);
                        })

                        function displayModel(dataURL) {
                            let loader = new THREE.GLTFLoader();
                            loader.load(
                                dataURL,
                                function (gltf) {
                                    let model = gltf.scene;

                                    scene.add(model);

                                    // Center the model
                                    let bbox = new THREE.Box3().setFromObject(model);
                                    let center = bbox.getCenter(new THREE.Vector3());
                                    model.position.sub(center);

                                    controls.target.copy(center); // Set camera target to the center of the model
                                    camera.position.set(0, 0, 5); // Set initial camera position
                                    controls.update(); // Update controls to focus on the new model

                                    // Iterate through the model's children to get materials
                                    let i = 0;
                                    model.traverse(function(child) {
                                        if (child instanceof THREE.Mesh && !materials.includes(child.material)) {
                                            materials.push(child.material);

                                            let materialName = child.material.name || 'Material ' + (materials.length - 1);

                                            // assign name to materials
                                            materials[i].name = materials[i].name ||'Material ' + (materials.length - 1);

                                            // create template when input file
                                            _material_list_template += `
                                            <li>
                                                ${materialName}
                                                <input class="form-check-input ms-3" name="material-select" data-default-color="${'#'+child.material.color.getHexString()}" type="checkbox" value="${i}" id="materialsList">
                                            </li>
                                        `
                                            // render html
                                            $('#materialList').html(_material_list_template);

                                            i++;
                                        }

                                    });
                                },
                                undefined,
                                function (error) {
                                    console.error(error);
                                }
                            );
                        }

                        function animate() {
                            requestAnimationFrame(animate);
                            renderer.render(scene, camera);
                            controls.update();
                        }
                        animate();

                        // Update renderer size and aspect ratio on window resize
                        window.addEventListener('resize', function () {
                            camera.aspect = viewerDiv.clientWidth / viewerDiv.clientHeight;
                            camera.updateProjectionMatrix();
                            renderer.setSize(viewerDiv.clientWidth, viewerDiv.clientHeight);
                        });

                    });
                });

                $('#addProductModal').on('hidden.bs.modal', function () {
                    savedCameraPosition = camera.position.clone();
                    $("input[name='name']").val('');
                    $("#modelFile").val('');
                    $('#materialList').html('');
                    $('#materialColorList').html('');
                    savedImages = [];
                    savedColors = [];
                    materials = [];

                    scene.children.forEach(child => {
                        if (!(child instanceof THREE.Light)) {
                            scene.remove(child);
                        }
                    });

                });

                // if checkbox is change
                $(document).off('change').on('change', 'input[type="checkbox"][name="material-select"]', function () {
                    let material = $(this).val();
                    let defaultColor = $(this).data("default-color")
                    if ($(this).is(':checked')) {
                        // initialize data
                        savedColors[material]=  savedColors[material] || [];
                        savedImages[material]= savedImages[material] || [];
                        materials[material].savedColors = materials[material].savedColors || [];
                        savedImages[material].push(null);
                        materials[material].savedColors.push(defaultColor);
                        savedColors[material].push(defaultColor);
                        createCard(material);

                        console.log(savedImages);
                    } else {
                        // delete current savedColors
                        // delete current savedColors on materials
                        savedColors.splice(material, 1);
                        materials[material].savedColors = [];
                        savedColors[material] = [];
                        savedImages[material] = [];
                        // delete current container
                        $('.container-cardlist-' + material).html('');
                    }
                })

                // buat fungsi menutup control
                $(document).on('click', '.btn-close-control', function() {
                    let materialIndex = $(this).data('material-index');
                    $('.control-container-'+materialIndex).hide();
                    $('#icon-file-'+materialIndex).val();
                })

                // buat fungsi card click
                $(document).on('click', '.card-item', function() {
                    let color = $(this).data('color');
                    let materialIndex = $(this).data('material-index');
                    let currentMaterial = $(this).data('current-material');

                    //menampilkan control
                    $('.control-container-'+materialIndex).show();

                    //ubah warna
                    materials[materialIndex].color.setStyle(color);

                    // re render
                    renderer.render(scene, camera);

                    //set data metarial list yang sekarang
                    $('.control-container-'+materialIndex).attr('data-current-material', currentMaterial);

                    // set input color
                    $('input[name="color-'+materialIndex+'"').val(savedColors[materialIndex][currentMaterial]);

                    //remove card active
                    $('.card-item-'+materialIndex).removeClass('card-item-active');

                    // set card active baru
                    $('.card-item-'+materialIndex+'-'+currentMaterial).addClass('card-item-active');
                })

                //buat fungsi save warna
                $(document).on('click', '.btn-save', function() {
                    let materialIndex = $(this).data('material-index');
                    let currentMaterial = $('.control-container-'+materialIndex).data('current-material');

                    // set warna
                    materials[materialIndex].savedColors[currentMaterial] = $('input[name="color-'+materialIndex+'"]').val();
                    savedColors[materialIndex][currentMaterial] = $('input[name="color-'+materialIndex+'"]').val();

                    if ($('#icon-file-'+materialIndex)[0].files.length > 0) {
                        savedImages[materialIndex][currentMaterial] = $('#icon-file-'+materialIndex)[0].files[0];
                        savedImages[materialIndex][currentMaterial].index = currentMaterial;
                        savedImages[materialIndex][currentMaterial].indexCurrent = currentMaterial;
                        console.log(savedImages);
                    } else {
                        savedImages[materialIndex][currentMaterial] = null;
                        console.log(savedImages);
                    }

                    // redner ulang card
                    createCard(materialIndex);

                    $('.control-container-'+materialIndex).hide();
                })

                // buat fungsi tambah warna
                $(document).on('click', '.btn-add', function() {
                    let materialIndex = $(this).data('material-index');

                    // tambah warna
                    materials[materialIndex].savedColors.push($('input[name="color-'+materialIndex+'"]').val());
                    savedColors[materialIndex].push($('input[name="color-'+materialIndex+'"]').val());

                    let currentActive = savedColors[materialIndex].length - 1;

                    if ($('#icon-file-'+materialIndex)[0].files.length > 0) {
                        savedImages[materialIndex].push($('#icon-file-'+materialIndex)[0].files[0]);
                        savedImages[materialIndex][currentActive].index = materialIndex;
                        savedImages[materialIndex][currentActive].currentIndex = currentActive;
                        console.log(savedImages);
                    } else {
                        savedImages[materialIndex].push(null)
                        console.log(savedImages);
                    }

                    // render card baru
                    createCard(materialIndex);

                    //remove card active
                    $('.card-item-'+materialIndex).removeClass('card-item-active');

                    // set card active baru
                    $('.card-item-'+materialIndex+'-'+ currentActive).addClass('card-item-active');

                    $('.control-container-'+materialIndex).hide();
                })

                //buat fungsi hapus warna
                $(document).on('click', '.btn-delete', function() {
                    let materialIndex = $(this).data('material-index');
                    let currentMaterial = $('.control-container-'+materialIndex).data('current-material');

                    // tambah warna
                    materials[materialIndex].savedColors.splice(currentMaterial, 1);
                    savedColors[materialIndex].splice(currentMaterial, 1);
                    savedImages[materialIndex].splice(currentMaterial,1);

                    console.log(materials)
                    console.log(savedColors)
                    console.log(savedImages);

                    // render card baru
                    createCard(materialIndex);

                    $('.control-container-'+materialIndex).hide();
                })

                //fungsi uplaod icon
                $(document).on('click', '.btn-icon', function() {
                    let materialIndex = $(this).data('material-index');
                    $('#icon-file-'+materialIndex).click();
                })

                $('#addProduct').on('submit', function (e) {
                    e.preventDefault();

                    const modelFile = document.getElementById('modelFile');

                    let formData = new FormData();
                    formData.append('name', $("input[name='name']").val() );
                    formData.append('slug', $("input[name='slug']").val())
                    formData.append('savedColors', JSON.stringify(savedColors));
                    formData.append('file', modelFile.files[0]);
                    formData.append('brand_id', $("input[name='brand_id']").val());

                    savedImages.forEach(function(file, index) {
                        formData.append('material-index[]', index )
                        file.forEach(function(data, current ) {
                            formData.append('material-list-'+index+'[]', current);
                            if (data !== null) {
                                formData.append('current-material-'+index+'-'+current, current);
                                formData.append('savedImages-'+index+'-'+current, data);
                            }
                        });
                    });

                    $.ajax({
                        url: '{{ route('bracelet.add', $brand->name) }}',
                        processData: false,
                        contentType: false,
                        cache: false,
                        enctype: 'multipart/form-data',
                        method: 'POST',
                        data: formData,
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        success: function (response) {
                            if (response.status == 1) {
                                window.location.reload()
                            }
                        }
                    });
                });

                function hexToRgb(hex) {
                    // Hilangkan tanda '#' jika ada
                    hex = hex.replace(/^#/, '');

                    // Pisahkan nilai warna menjadi komponen R, G, dan B
                    var r = parseInt(hex.substring(0, 2), 16);
                    var g = parseInt(hex.substring(2, 4), 16);
                    var b = parseInt(hex.substring(4, 6), 16);

                    // Kembalikan nilai RGB dalam format string
                    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                }

                function createCard(index) {
                    let _material_card_list = ``;
                    let _material_card_list_container = ``;
                    let _left_arrow = `<div class="arrow left-arrow-${index} left-arrow">&lt;</div>`;
                    let _right_arrow = `<div class="arrow right-arrow-${index} right-arrow">&gt;</div>`;
                    let _card_list_container = `<div class="container-cardlist container-cardlist-${index}"></div>`;

                    // add card list container
                    if(!$('div').hasClass('container-cardlist-'+index)) {
                        $('#materialColorList').append(_card_list_container);
                    }

                    //iterate color
                    materials[index].savedColors.forEach(function(color, key) {
                        if (savedImages[index][key] !== null) {
                            let image = URL.createObjectURL(savedImages[index][key]);

                            _material_card_list += `
                                            <img src="${image}" alt="icon" class="card-item-${index} card-item-${index}-${key} card-item ${(savedColors[index].length === 1 ? 'card-item-active' : '')}" data-material-index="${index}" data-current-material="${key}" data-color="${color}"/>
                                         `

                        } else {
                            _material_card_list += `
                                        <div class="card-item-${index} card-item-${index}-${key} card-item ${(savedColors[index].length === 1 ? 'card-item-active' : '')}" data-material-index="${index}" data-current-material="${key}" data-color="${color}" style="background-color: ${hexToRgb(color)};">${materials[index].name}</div>
                                    `
                        }
                    })

                    // gabungkan semua
                    _material_card_list_container = `
                                <div class="card shadow-lg position-absolute  start-50 translate-middle-x border control control-container-${index}">
                                    <div class="card-body p-2 position-relative">
                                        <button type="button" class="position-absolute position-absolute btn-close-control btn btn-danger border border-light rounded-circle bg-danger p-1 close-control" data-material-index="${index}"><i class='bx bx-x fs-4'></i></button>
                                        <div class="row">
                                            <div class="col-sm-6 d-flex align-items-center">
                                                <label for="colorSelect" class="col-form-label me-1">Color:</label>
                                                <input type="color" name="color-${index}" data-material-index="${index}"  id="colorSelect" class="col-2 form-control form-control-color me-2" value="#${materials[index].color.getHexString()}">
                                                <label for="thumbnailSelect" class="col-form-label me-1 ">Icon:</label>
                                                <button type="button" class="btn-icon btn btn-outline-primary p-1" data-material-index="${index}"><i class='bx bx-image-alt fs-4'></i></button>
                                                <input type="file" name="icon-file-${index}" id="icon-file-${index}" class="me-1 d-none">
                                            </div>
                                            <div class="col-sm-6 d-flex align-items-center justify-content-center">
                                                <button type="button" class="btn btn-save btn-success p-1 mx-3 border border-light rounded-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="Save" data-material-index="${index}"><i class='bx bx-check fs-4'></i></button>
                                                <button type="button" class="btn btn-add btn-outline-dark p-1 mx-3 border border-light rounded-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="Add" data-material-index="${index}"><i class='bx bx-plus fs-4'></i></button>
                                                <button type="button" class="btn btn-delete btn-danger p-1 mx-3 border border-light rounded-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" data-material-index="${index}"><i class='bx bx-trash fs-4' ></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h5 class="mt-5">${materials[index].name}</h5>
                                ${_left_arrow}
                                <div class="card-list d-flex justify-content-start">
                                    ${_material_card_list}
                                </div>
                                ${_right_arrow}
                            `

                    // append all
                    $('.container-cardlist-'+index).html(_material_card_list_container);

                    // check container if exist then hide
                    if($('div').hasClass('control-container-'+index)) {
                        $('.control-container-'+index).hide();
                    }

                    // buat fungsi scroll
                    $(document).on('click', '.left-arrow-'+index, function () {
                        $(this).next().next().scrollLeft($(this).next().next().scrollLeft() - 200);
                    })

                    // buat fungsi scroll
                    $(document).on('click', '.right-arrow-'+index, function () {
                        $(this).prev().scrollLeft($(this).prev().scrollLeft() + 200);
                    })

                    // buat listener untuk perubahan warna
                    $(document).on('change', 'input[name="color-'+index+'"]', function () {
                        let materialIndex = $(this).data('material-index');
                        //ubah warna
                        materials[materialIndex].color.setStyle($(this).val());

                        // re render
                        renderer.render(scene, camera);

                    });

                }

            </script>
            <script>
                const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
                let materialsEdit = []; // Array to store materials
                let savedColorsEdit = [];
                let savedImagesEdit = [];
                let viewerDivEdit, sceneEdit, cameraEdit, rendererEdit;
                let savedCameraPositionEdit;
                let _material_list_template_edit = ``;

                viewerDivEdit = document.getElementById('viewerEdit');
                rendererEdit = new THREE.WebGLRenderer();
                sceneEdit = new THREE.Scene();

                viewerDivEdit.appendChild(rendererEdit.domElement);

                // Set warna latar belakang renderer menjadi putih
                rendererEdit.setClearColor(0xffffff);

                // Tambahkan directional light
                let directionalLightEdit = new THREE.DirectionalLight(0xffffff, 1);
                directionalLightEdit.position.set(5, 5, 5);
                scene.add(directionalLightEdit);

                // Tambahkan ambient light
                let ambientLightEdit = new THREE.AmbientLight(0xffffff, 0.3);
                sceneEdit.add(ambientLightEdit);

                let lightEdit = new THREE.SpotLight(0xffa95c,4);
                lightEdit.position.set(-50,50,50);
                lightEdit.castShadow = true;
                sceneEdit.add( lightEdit );

                // Pencahayaan Hemisphere
                let hemiLightEdit = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
                sceneEdit.add(hemiLightEdit);

                // Atur pengaturan rendering
                rendererEdit.toneMapping = THREE.ReinhardToneMapping; // Menggunakan Reinhard Tone Mapping
                rendererEdit.toneMappingExposure = 2.3; // Koreksi kecerahan secara global
                rendererEdit.physicallyCorrectLights = true; // Pencahayaan yang lebih akurat

                // Set latar belakang scene menjadi warna solid
                sceneEdit.background = new THREE.Color(0xffffff);

                //set loader
                let loader;
                let id = 0;
                let color;

                // edit function
                $('.btn-edit').off('click').on('click', function() {
                    id = $(this).data('id');
                    loader = new THREE.GLTFLoader();
                    // ajax untuk ambil data
                    $.ajax({
                        url: '/product/bracelet/get-item/'+ id,
                        method: 'GET',
                        success: function (response) {
                            let data = response.fullUrl+response.data.base_folder+'/'+response.data.filename;
                            let savedImages = JSON.parse(response.data.saved_images);
                            console.log(savedImages);
                            savedColors = JSON.parse(response.data.color);

                            $("input[name='name_edit']").val(response.data.name);

                            savedColors.forEach(function (colors, material) {
                                savedImagesEdit[material]= savedImagesEdit[material] || [];
                                colors.forEach(function (color, current) {
                                    savedImagesEdit[material].push(null);
                                    savedImages.forEach(function (images, index) {
                                        images.forEach(function(image, currentImage) {
                                            if(image.current == current && image.material == material) {
                                                savedImagesEdit[material][current] = response.fullUrl + image.filepath;
                                            }
                                        })
                                    })
                                })

                            })

                            editProductModal.show();
                            $('#editProductModal').on('shown.bs.modal', function () {
                                cameraEdit = new THREE.PerspectiveCamera(75, viewerDivEdit.clientWidth / viewerDivEdit.clientHeight, 0.1, 1000);

                                if (savedCameraPositionEdit) {
                                    cameraEdit.position.copy(savedCameraPositionEdit);
                                }

                                //resize
                                rendererEdit.setSize(viewerDivEdit.clientWidth, viewerDivEdit.clientHeight);

                                let controls = new THREE.OrbitControls(cameraEdit, rendererEdit.domElement);

                                //init
                                if (data !== '') {
                                    materialsEdit = [];
                                    _material_list_template_edit = ``;
                                    $('#materialColorListEdit').html('');

                                    sceneEdit.children.forEach(child => {
                                        if (!(child instanceof THREE.Light)) {
                                            sceneEdit.remove(child);
                                        }
                                    });

                                    displayModel(data);
                                    data = '';
                                }

                                // filemodel upload
                                $('#modelFileEdit').off('change').on('change', function(e) {
                                    materialsEdit = [];
                                    _material_list_template_edit = ``;
                                    savedColorsEdit = [];
                                    color = [];
                                    $('#materialColorListEdit').html('');

                                    sceneEdit.children.forEach(child => {
                                        if (!(child instanceof THREE.Light)) {
                                            sceneEdit.remove(child);
                                        }
                                    });

                                    let reader = new FileReader();

                                    reader.onload = function (event) {
                                        let contents = event.target.result;
                                        displayModel(contents);
                                    };

                                    reader.readAsDataURL(e.target.files[0]);
                                })

                                function displayModel(dataURL) {
                                    loader.load(
                                        dataURL,
                                        function (gltf) {
                                            let model = gltf.scene;

                                            sceneEdit.add(model);

                                            // Center the model
                                            let bbox = new THREE.Box3().setFromObject(model);
                                            let center = bbox.getCenter(new THREE.Vector3());
                                            model.position.sub(center);

                                            controls.target.copy(center); // Set camera target to the center of the model
                                            cameraEdit.position.set(0, 0, 5); // Set initial camera position
                                            controls.update(); // Update controls to focus on the new model

                                            // Iterate through the model's children to get materials
                                            let i = 0;
                                            model.traverse(function(child) {
                                                if (child instanceof THREE.Mesh && !materialsEdit.includes(child.material)) {
                                                    materialsEdit.push(child.material);

                                                    let materialName = child.material.name || 'Material ' + (materialsEdit.length - 1);

                                                    materialsEdit[i].name = materialsEdit[i].name || 'Material ' + (materialsEdit.length - 1);
                                                    materialsEdit[i].savedColors = materialsEdit[i].savedColors || [];
                                                    savedColorsEdit[i]=  savedColorsEdit[i] || [];


                                                    // push saved color to materials
                                                    if (color.length > 0 ) {
                                                        materialsEdit[i].savedColors = color[i];
                                                        createCard(i)
                                                    }

                                                    _material_list_template_edit += `
                                                        <li>
                                                            ${materialName}
                                                            <input type="color" name="color-${i}" class="color-input-${i}" value="${'#'+child.material.color.getHexString()}">
                                                            <button type="button" class="btn btn-primary btn-save-color-${i}" data-key="${i}">Save</button>
                                                        </li>
                                                    `

                                                    $('#materialListEdit').html(_material_list_template_edit);

                                                    // listener for color change
                                                    $(document).on('input', '.color-input-'+i, function() {
                                                        child.material.color.set($(this).val());
                                                        rendererEdit.render(sceneEdit, cameraEdit);
                                                    });

                                                    $(document).on('click', '.btn-save-color-'+i, function() {
                                                        let key = $(this).data('key')
                                                        let index = materialsEdit.indexOf(child.material);
                                                        if (index !== -1) {
                                                            // save to savedColor
                                                            materialsEdit[index].savedColors.push($('input[name="color-' + key + '"]').val());
                                                            savedColorsEdit[index].push($('input[name="color-' + key + '"]').val());
                                                            createCard(index);
                                                        }
                                                    })

                                                    i++;
                                                }
                                            });
                                        },
                                        undefined,
                                        function (error) {
                                            console.error(error);
                                        }
                                    );
                                }

                                function createCard(index) {
                                    let _material_card_list_edit = ``;
                                    let _material_card_list_container_edit = ``;
                                    let _left_arrow_edit = `<div class="arrow left-arrow-${index} left-arrow">&lt;</div>`;
                                    let _right_arrow_edit = `<div class="arrow right-arrow-${index} right-arrow">&gt;</div>`;
                                    let _card_list_container_edit = `<div class="container-cardlist container-cardlist-${index}"></div>`;

                                    // add card list container
                                    if(!$('div').hasClass('container-cardlist-'+index)) {
                                        $('#materialColorListEdit').append(_card_list_container_edit);
                                    }

                                    //iterate color
                                    materialsEdit[index].savedColors.forEach(function(color) {
                                        _material_card_list_edit += `
                                            <div class="card-item" data-material-index="${index}" data-color=${color} style="background-color: ${hexToRgb(color)};">${materialsEdit[index].name}</div>
                                        `
                                    })

                                    // gabungkan semua
                                    _material_card_list_container_edit = `
                                        <h5>${materialsEdit[index].name}</h5>
                                        ${_left_arrow_edit}
                                        <div class="card-list">
                                            ${_material_card_list_edit}
                                        </div>
                                        ${_right_arrow_edit}
                                    `

                                    // append all
                                    $('.container-cardlist-'+index).html(_material_card_list_container_edit);

                                    // buat fungsi scroll
                                    $(document).on('click', '.left-arrow-'+index, function () {
                                        $(this).next().next().scrollLeft($(this).next().next().scrollLeft() - 200);
                                    })

                                    // buat fungsi scroll
                                    $(document).on('click', '.right-arrow-'+index, function () {
                                        $(this).prev().scrollLeft($(this).prev().scrollLeft() + 200);
                                    })

                                }

                                // buat fungsi card click
                                $(document).on('click', '.card-item', function() {
                                    let color = $(this).data('color');
                                    let materialIndex = $(this).data('material-index');

                                    //ubah warna
                                    materialsEdit[materialIndex].color.setStyle(color);

                                    // re render
                                    rendererEdit.render(sceneEdit, cameraEdit);
                                })

                                function animate() {
                                    requestAnimationFrame(animate);
                                    rendererEdit.render(sceneEdit, cameraEdit);
                                    controls.update();
                                }
                                animate();

                                // Update renderer size and aspect ratio on window resize
                                window.addEventListener('resize', function () {
                                    cameraEdit.aspect = viewerDivEdit.clientWidth / viewerDivEdit.clientHeight;
                                    cameraEdit.updateProjectionMatrix();
                                    rendererEdit.setSize(viewerDivEdit.clientWidth, viewerDivEdit.clientHeight);
                                });

                                function hexToRgb(hex) {
                                    // Hilangkan tanda '#' jika ada
                                    console.log(hex);
                                    hex = hex.replace(/^#/, '');

                                    // Pisahkan nilai warna menjadi komponen R, G, dan B
                                    var r = parseInt(hex.substring(0, 2), 16);
                                    var g = parseInt(hex.substring(2, 4), 16);
                                    var b = parseInt(hex.substring(4, 6), 16);

                                    // Kembalikan nilai RGB dalam format string
                                    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
                                }

                            });
                        }
                    });
                })

                $('#editProductModal').on('hidden.bs.modal', function () {
                    savedCameraPositionEdit = cameraEdit.position.clone();
                    $("input[name='name_edit']").val('');
                    $("input[name='modelFileEdit']").val('');
                    $("#modelFileEdit").val('');
                    $('#materialListEdit').html('');
                    $('#materialColorListEdit').html('');


                    loader = null;
                })

                $('#editProduct').on('submit', function (e) {
                    e.preventDefault();

                    const modelFile = document.getElementById('modelFileEdit');

                    let newColor;
                    if(color.length > 0) {
                        newColor = color
                    } else {
                        newColor = savedColorsEdit
                    }

                    let formData = new FormData();
                    formData.append('name', $("input[name='name_edit']").val() );
                    formData.append('slug', $("input[name='slug']").val())
                    formData.append('savedColors', JSON.stringify(newColor));
                    formData.append('file', modelFile.files[0]);
                    formData.append('brand_id', $("input[name='brand_id']").val());
                    formData.append('product_id', id)

                    $.ajax({
                        url: '{{ route('bracelet.edit') }}',
                        processData: false,
                        contentType: false,
                        cache: false,
                        enctype: 'multipart/form-data',
                        method: 'POST',
                        data: formData,
                        headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        success: function (response) {
                            if (response.status == 1) {
                                window.location.reload()
                            }
                        }
                    });
                });

            </script>
        @endpush
    </div>

@endsection
