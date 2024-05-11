const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
let materialsEdit = []; // Array to store materials
let savedColorsEdit = [];
let savedImagesEdit = [];
let viewerDivEdit, sceneEdit, cameraEdit, rendererEdit;
let savedCameraPositionEdit;
let _material_list_template_edit = ``;

viewerDivEdit = document.getElementById('viewerEdit');
rendererEdit = new THREE.WebGLRenderer({ antialias: true });
sceneEdit = new THREE.Scene();
rendererEdit.outputEncoding = THREE.sRGBEncoding;

let rgbeLoaderEdit = new THREE.RGBELoader();
rgbeLoaderEdit.setDataType(THREE.UnsignedByteType);

rgbeLoaderEdit.load(
    BASE_URL + '/assets/others/hotel_room_1k.hdr',
    function (texture) {
        let pmremGenerator = new THREE.PMREMGenerator(rendererEdit);
        sceneEdit.environment = pmremGenerator.fromEquirectangular(texture).texture;
        texture.dispose();
        pmremGenerator.dispose();
    },
    undefined,
    function (error) {
        console.error('Error loading HDR texture:', error);
    }
);

viewerDivEdit.appendChild(rendererEdit.domElement);

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
        url: BASE_URL + '/product/bracelet/get-item/'+ id,
        method: 'GET',
        success: function (response) {
            let data = response.fullUrl+response.data.base_folder+'/'+response.data.filename;
            let savedImages = JSON.parse(response.data.saved_images);
            savedColorsEdit = JSON.parse(response.data.color);
            materialsEdit = [];
            _material_list_template_edit = ``;
            $('#materialColorListEdit').html('');


            $("input[name='name_edit']").val(response.data.name);

            // restruktur array saved Image
            savedColorsEdit.forEach(function (colors, material) {
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
                    savedImagesEdit = [];
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
                            console.log(model)

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

                                    // assign name to materials
                                    materialsEdit[i].name = materialsEdit[i].name ||'Material ' + (materialsEdit.length - 1);

                                    _material_list_template_edit += `
                                                        <li>
                                                            ${materialName}
                                                            <input class="form-check-input ms-3" name="material-select-edit" data-default-color="${'#'+child.material.color.getHexString()}" type="checkbox" value="${i}" id="materialsListEdit${i}" ${(savedColorsEdit.length > 0 && savedColorsEdit[i] != undefined) ? "checked" : ""}>
                                                        </li>
                                                    `

                                    $('#materialListEdit').html(_material_list_template_edit);

                                    // render card
                                    if(savedColorsEdit.length > 0 && savedColorsEdit[i] != undefined) {
                                        // assing color to materials
                                        materialsEdit[i].savedColors = materialsEdit[i].savedColors || (savedColorsEdit.length > 0 && savedColorsEdit[i] != undefined) ? savedColorsEdit[i] : [];
                                        createCardEdit(i);
                                    }

                                    child.material.roughness = 0.05;
                                    child.material.metalness = 0.950;

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
                    rendererEdit.render(sceneEdit, cameraEdit);
                    controls.update();
                }
                animate();
            });
        }
    });
})

function createCardEdit(index) {
    let _material_card_list = ``;
    let _material_card_list_container = ``;
    let _left_arrow = `<div class="arrow left-arrow-${index} left-arrow">&lt;</div>`;
    let _right_arrow = `<div class="arrow right-arrow-${index} right-arrow">&gt;</div>`;
    let _card_list_container = `<div class="container-cardlist container-cardlist-${index}"></div>`;

    // add card list container
    if (!$('div').hasClass('container-cardlist-' + index)) {
        $('#materialColorListEdit').append(_card_list_container);
    }

    //iterate color
    materialsEdit[index].savedColors.forEach(function (color, key) {
        if (savedImagesEdit[index][key] !== null) {
            let image = null;

            if (typeof savedImagesEdit[index][key] == 'string') {
                image = savedImagesEdit[index][key]
                _material_card_list += `
                                            <img src="${image}" alt="icon" class="card-item-edit card-item-${index} card-item-${index}-${key}  ${(savedColorsEdit[index].length === 1 ? 'card-item-active' : '')}" data-material-index="${index}" data-current-material="${key}" data-color="${color}"/>
                                         `
            }

            if (typeof savedImagesEdit[index][key] == 'object') {
                image = URL.createObjectURL(savedImagesEdit[index][key])
                _material_card_list += `
                                            <img src="${image}" alt="icon" class="card-item-edit card-item-${index} card-item-${index}-${key}  ${(savedColorsEdit[index].length === 1 ? 'card-item-active' : '')}" data-material-index="${index}" data-current-material="${key}" data-color="${color}"/>
                                         `
            }
        } else {
            _material_card_list += `
                                        <div class="card-item-edit card-item-${index} card-item-${index}-${key} ${(savedColorsEdit[index].length === 1 ? 'card-item-active' : '')}" data-material-index="${index}" data-current-material="${key}" data-color="${color}" style="background-color: ${hexToRgb(color)};">${materialsEdit[index].name}</div>
                                    `
        }
    })

    // gabungkan semua
    _material_card_list_container = `
                                <div class="card shadow-lg position-absolute  start-50 translate-middle-x border control control-container-${index}">
                                    <div class="card-body p-2 position-relative">
                                        <button type="button" class="position-absolute position-absolute btn-close-edit-control btn btn-danger border border-light rounded-circle bg-danger p-1 close-control" data-material-index="${index}"><i class='bx bx-x fs-4'></i></button>
                                        <div class="row">
                                            <div class="col-sm-6 d-flex align-items-center">
                                                <label for="colorSelect" class="col-form-label me-1">Color:</label>
                                                <input type="color" name="color-edit-${index}" data-material-index="${index}"  id="colorEditSelect" class="col-2 form-control form-control-color me-2" value="#${materialsEdit[index].color.getHexString()}">
                                                <label for="thumbnailEditSelect" class="col-form-label me-1 ">Icon:</label>
                                                <button type="button" class="btn-edit-icon btn btn-outline-primary p-1" data-material-index="${index}"><i class='bx bx-image-alt fs-4'></i></button>
                                                <input type="file" name="icon-file-edit-${index}" id="icon-file-edit-${index}" class="me-1 d-none">
                                            </div>
                                            <div class="col-sm-6 d-flex align-items-center justify-content-center">
                                                <button type="button" class="btn btn-edit-save btn-success p-1 mx-3 border border-light rounded-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="Save" data-material-index="${index}"><i class='bx bx-check fs-4'></i></button>
                                                <button type="button" class="btn btn-edit-add btn-outline-dark p-1 mx-3 border border-light rounded-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="Add" data-material-index="${index}"><i class='bx bx-plus fs-4'></i></button>
                                                <button type="button" class="btn btn-edit-delete btn-danger p-1 mx-3 border border-light rounded-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" data-material-index="${index}"><i class='bx bx-trash fs-4' ></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h5 class="mt-5">${materialsEdit[index].name}</h5>
                                ${_left_arrow}
                                <div class="card-list d-flex justify-content-start">
                                    ${_material_card_list}
                                </div>
                                ${_right_arrow}
                            `

    // append all
    $('.container-cardlist-' + index).html(_material_card_list_container);

    // check container if exist then hide
    if ($('div').hasClass('control-container-' + index)) {
        $('.control-container-' + index).hide();
    }

    // buat fungsi scroll
    $(document).on('click', '.left-arrow-' + index, function () {
        $(this).next().next().scrollLeft($(this).next().next().scrollLeft() - 200);
    })

    // buat fungsi scroll
    $(document).on('click', '.right-arrow-' + index, function () {
        $(this).prev().scrollLeft($(this).prev().scrollLeft() + 200);
    })

    // buat listener untuk perubahan warna
    $(document).on('change', 'input[name="color-edit-' + index + '"]', function () {
        let materialIndex = $(this).data('material-index');
        //ubah warna
        materialsEdit[materialIndex].color.setStyle($(this).val());

        // re render
        rendererEdit.render(sceneEdit, cameraEdit);

    });

}

//fungsi uplaod icon
$(document).on('click', '.btn-edit-icon', function() {
    let materialIndex = $(this).data('material-index');
    $('#icon-file-edit-'+materialIndex).click();
})

// buat fungsi menutup control
$(document).on('click', '.btn-close-edit-control', function() {
    let materialIndex = $(this).data('material-index');
    $('.control-container-'+materialIndex).hide();
    $('#icon-file-edit-'+materialIndex).val();
})

// buat fungsi card click
$(document).on('click', '.card-item-edit', function() {
    let color = $(this).data('color');
    let materialIndex = $(this).data('material-index');
    let currentMaterial = $(this).data('current-material');

    //menampilkan control
    $('.control-container-'+materialIndex).show();

    //ubah warna
    materialsEdit[materialIndex].color.setStyle(color);

    // re render
    rendererEdit.render(sceneEdit, cameraEdit);

    //set data metarial list yang sekarang
    $('.control-container-'+materialIndex).attr('data-current-material', currentMaterial);

    // set input color
    $('input[name="color-edit-'+materialIndex+'"').val(savedColorsEdit[materialIndex][currentMaterial]);

    //remove card active
    $('.card-item-'+materialIndex).removeClass('card-item-active');

    // set card active baru
    $('.card-item-'+materialIndex+'-'+currentMaterial).addClass('card-item-active');
})

//buat fungsi save warna
$(document).on('click', '.btn-edit-save', function() {
    let materialIndex = $(this).data('material-index');
    let currentMaterial = $('.control-container-'+materialIndex).data('current-material');

    // set warna
    materialsEdit[materialIndex].savedColors[currentMaterial] = $('input[name="color-edit-'+materialIndex+'"]').val();
    savedColorsEdit[materialIndex][currentMaterial] = $('input[name="color-edit-'+materialIndex+'"]').val();

    if ($('#icon-file-edit-'+materialIndex)[0].files.length > 0) {
        savedImagesEdit[materialIndex][currentMaterial] = $('#icon-file-edit-'+materialIndex)[0].files[0];
        console.log(savedImagesEdit);
    } else {
        savedImagesEdit[materialIndex][currentMaterial] = null;
        console.log(savedImagesEdit);
    }

    // redner ulang card
    createCardEdit(materialIndex);

    $('.control-container-'+materialIndex).hide();
})

// buat fungsi tambah warna
$(document).on('click', '.btn-edit-add', function() {
    console.log('add')
    let materialIndex = $(this).data('material-index');

    // tambah warna
    materialsEdit[materialIndex].savedColors.push($('input[name="color-edit-'+materialIndex+'"]').val());
    savedColorsEdit[materialIndex].push($('input[name="color-edit-'+materialIndex+'"]').val());

    let currentActive = savedColorsEdit[materialIndex].length - 1;

    if ($('#icon-file-edit-'+materialIndex)[0].files.length > 0) {
        savedImagesEdit[materialIndex].push($('#icon-file-edit-'+materialIndex)[0].files[0]);
        console.log(savedImagesEdit);
    } else {
        savedImagesEdit[materialIndex].push(null)
        console.log(savedImagesEdit);
    }

    // render card baru
    createCardEdit(materialIndex);

    //remove card active
    $('.card-item-'+materialIndex).removeClass('card-item-active');

    // set card active baru
    $('.card-item-'+materialIndex+'-'+ currentActive).addClass('card-item-active');

    $('.control-container-'+materialIndex).hide();
})

//buat fungsi hapus warna
$(document).on('click', '.btn-edit-delete', function() {
    let materialIndex = $(this).data('material-index');
    let currentMaterial = $('.control-container-'+materialIndex).data('current-material');

    // tambah warna
    materialsEdit[materialIndex].savedColors.splice(currentMaterial, 1);
    savedColorsEdit[materialIndex].splice(currentMaterial, 1);
    savedImagesEdit[materialIndex].splice(currentMaterial,1);

    console.log(materialsEdit)
    console.log(savedColorsEdit)
    console.log(savedImagesEdit);

    // render card baru
    createCardEdit(materialIndex);

    $('.control-container-'+materialIndex).hide();
})

$('#editProductModal').on('hidden.bs.modal', function () {
    savedCameraPositionEdit = cameraEdit.position.clone();
    $("input[name='name_edit']").val('');
    $("input[name='modelFileEdit']").val('');
    $("#modelFileEdit").val('');
    $('#materialListEdit').html('');
    $('#materialColorListEdit').html('');
    savedImagesEdit = [];
    savedColorsEdit = [];
    materialsEdit = [];
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
        url: '/product/bracelet/edit',
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
