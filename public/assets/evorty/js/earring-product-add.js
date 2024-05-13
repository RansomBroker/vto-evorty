const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
let materials = []; // Array to store materials
let savedColors = [];
let savedImages = [];
let viewerDiv, scene, camera, renderer;
let savedCameraPosition;
let _material_list_template = ``;

viewerDiv = document.getElementById('viewer');
renderer = new THREE.WebGLRenderer({ antialias: true });
scene = new THREE.Scene();

renderer.outputEncoding = THREE.sRGBEncoding;

let rgbeLoader = new THREE.RGBELoader();
rgbeLoader.setDataType(THREE.UnsignedByteType);

rgbeLoader.load(
    BASE_URL +'/assets/others/hotel_room_1k.hdr',
    function (texture) {
        let pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromEquirectangular(texture).texture;
        texture.dispose();
        pmremGenerator.dispose();
    },
    undefined,
    function (error) {
        console.error('Error loading HDR texture:', error);
    }
);

viewerDiv.appendChild(renderer.domElement);

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
                            child.material.roughness = 0.05;
                            child.material.metalness = 0.950;
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
    const thumbnail = document.getElementById('thumbnail');

    let formData = new FormData();
    formData.append('name', $("input[name='name']").val() );
    formData.append('slug', $("input[name='slug']").val())
    formData.append('savedColors', JSON.stringify(savedColors));
    formData.append('file', modelFile.files[0]);
    formData.append('brand_id', $("input[name='brand_id']").val());
    formData.append('thumbnail', thumbnail.files[0]);

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
        url: BASE_URL + '/product/earring/add',
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
