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
                        <div class="d-flex justify-content-end">
                            <button wire:click="showAddProductModal" class="btn btn-primary" >Add New Product</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- / Content -->
            <div class="content-backdrop fade"></div>
        </div>
        <!-- Content wrapper -->
    </div>

    <!-- Modal -->
    <div wire:submit.prevent="addProduct" wire:ignore.self class="modal  fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true"  data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="addProductModalLabel">Add New Product</h5>
                </div>
                <div class="modal-body">
                    <form wire:submit.prevent="addProduct" wire:loading.attr="disabled" id="addProduct" >
                        <div class="form-group mb-3">
                            <label for="" class="form-label">Product Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" wire:model.defer="productName" required>
                        </div>
                        <div class="form-group mb-3">
                            <label for="" class="form-label">Model 3d <span class="text-danger">*</span></label>
                            <input type="file" id="modelFile" class="form-control mb-3"  required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 mb-3">Add New Product</button>
                        <button type="button" class="btn btn-secondary w-100" wire:click="closeAddProductModal">Cancel</button>
                    </form>
                    <div class="row model-container">
                        <div class="col-lg-6 col-md-12 col-12">
                            <div id="viewer"></div>
                        </div>
                        <div class="col-lg-6 col-md-12 col-12">
                            <ul id="materialList"></ul>
                            <div id="materialColorList">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
    @push('script')
        <script>
            let materials = []; // Array to store materials
            const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'))
            window.addEventListener('showAddProductModal', (event) => {
                addProductModal.show();
                $('#addProductModal').on('shown.bs.modal', function () {
                    var viewerDiv = document.getElementById('viewer');

                    var scene = new THREE.Scene();
                    var camera = new THREE.PerspectiveCamera(75, viewerDiv.clientWidth / viewerDiv.clientHeight, 0.1, 1000);
                    var renderer = new THREE.WebGLRenderer();

                    // Set warna latar belakang renderer menjadi putih
                    renderer.setSize(viewerDiv.clientWidth, viewerDiv.clientHeight);
                    viewerDiv.appendChild(renderer.domElement);
                    // Set warna latar belakang renderer menjadi putih
                    renderer.setClearColor(0xffffff);

                    // Tambahkan directional light
                    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                    directionalLight.position.set(5, 5, 5);
                    scene.add(directionalLight);

                    // Tambahkan ambient light
                    var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
                    scene.add(ambientLight);

                    var light = new THREE.SpotLight(0xffa95c,4);
                    light.position.set(-50,50,50);
                    light.castShadow = true;
                    scene.add( light );

                    // Pencahayaan Hemisphere
                    var hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
                    scene.add(hemiLight);

                    // Atur pengaturan rendering
                    renderer.toneMapping = THREE.ReinhardToneMapping; // Menggunakan Reinhard Tone Mapping
                    renderer.toneMappingExposure = 2.3; // Koreksi kecerahan secara global
                    renderer.physicallyCorrectLights = true; // Pencahayaan yang lebih akurat

                    // Set latar belakang scene menjadi warna solid
                    scene.background = new THREE.Color(0xffffff);

                    var controls = new THREE.OrbitControls(camera, renderer.domElement);

                    let _material_list_template = ``;

                    // filemodel upload
                    $('#modelFile').on('change', function(e) {
                        materials = [];
                        _material_list_template = ``;
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
                            window.livewire.emit('addModel', ['tes', 'tes'])
                        };

                        reader.readAsDataURL(e.target.files[0]);
                    })

                    function displayModel(dataURL) {
                        var loader = new THREE.GLTFLoader();
                        loader.load(
                            dataURL,
                            function (gltf) {
                                var model = gltf.scene;

                                scene.add(model);

                                // Center the model
                                var bbox = new THREE.Box3().setFromObject(model);
                                var center = bbox.getCenter(new THREE.Vector3());
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

                                        _material_list_template += `
                                            <li>
                                                ${materialName}
                                                <input type="color" name="color-${i}" class="color-input-${i}" value="${'#'+child.material.color.getHexString()}">
                                                <button type="button" class="btn btn-primary btn-save-color-${i}" data-key="${i}" wire:ignore>Save</button>
                                            </li>
                                        `

                                        $('#materialList').html(_material_list_template);

                                        // listener for color change
                                        $(document).on('input', '.color-input-'+i, function() {
                                            child.material.color.set($(this).val());
                                            renderer.render(scene, camera);
                                        });

                                        $(document).on('click', '.btn-save-color-'+i, function() {
                                            let key = $(this).data('key')
                                            let index = materials.indexOf(child.material);
                                            if (index !== -1) {
                                                materials[index].name = materials[index].name || 'Material ' + (materials.length - 1);
                                                materials[index].savedColors = materials[index].savedColors || [];
                                                materials[index].savedColors.push($('input[name="color-' + key + '"]').val());
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
                        materials[index].savedColors.forEach(function(color) {
                            _material_card_list += `
                            <div class="card-item" data-material-index="${index}" data-color=${color} style="background-color: ${hexToRgb(color)};">${materials[index].name}</div>
                        `
                        })

                        // gabungkan semua
                        _material_card_list_container = `
                        <h5>${materials[index].name}</h5>
                        ${_left_arrow}
                        <div class="card-list">
                            ${_material_card_list}
                        </div>
                        ${_right_arrow}
                    `

                        // append all
                        $('.container-cardlist-'+index).html(_material_card_list_container);

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
                        materials[materialIndex].color.setStyle(color);

                        // re render
                        renderer.render(scene, camera);
                    })

                    function animate() {
                        requestAnimationFrame(animate);
                        renderer.render(scene, camera);
                        controls.update();
                    }
                    animate();

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

                    // Update renderer size and aspect ratio on window resize
                    window.addEventListener('resize', function () {
                        camera.aspect = viewerDiv.clientWidth / viewerDiv.clientHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(viewerDiv.clientWidth, viewerDiv.clientHeight);
                    });

                });
            });

            window.addEventListener('closeAddProductModal', (event) => {
                addProductModal.hide();
            });


        </script>
    @endpush
</div>
