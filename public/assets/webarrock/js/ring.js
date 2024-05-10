// load asset list
$.ajax({
  url: 'file_loader_ring.php',
  type: 'GET',
  success: function(result) {
    const data = JSON.parse(result);

    const NNPath = 'webarrock/neuralNets/';
    const NNRingVersion = '14';
    const ringModesCommonSettings = {
      threshold: 0.97, // detection sensitivity, between 0 and 1

      poseLandmarksLabels: ["ringBack", "ringLeft", "ringRight", "ringPalm", "ringPalmTop", "ringBackTop",
        "ringBase0", "ringBase1", "ringMiddleFinger", "ringPinkyFinger", "ringBasePalm"], //*/

      isPoseFilter: true,

      // Occluder parameters:
      occluderType: "MODEL",
      // ubah jika perlu
      occluderModelURL: 'webarrock/assets/occluders/ringOccluder2.glb',
      occluderScale: 1,

      objectPointsPositionFactors: [1.0, 1.0, 1.0],

      landmarksStabilizerSpec: {
        minCutOff: 0.001,
        beta: 30,
      }
    };

    let ringModelCommonSettings = [];

    let _settings = {
      VTOModes: {

      },
      models: {

      },
      initialRing: 'ring0',
      initialStone: 'stone0',

      // debug flags:
      debugDisplayLandmarks: false,
      debugMeshMaterial: false,
      debugOccluder: false,
      debugWholeHand: false
    };

    let _html_ring_list = ``;
    let _html_stone_list = ``;

    let previousRingModel = '';
    let previousStoneModel = '';
    
    data.body.rings.forEach(function (model, key) {
      let ringModel = {
        URL: model[0],

        scale: 0.421,
        offset: [-1.66, -11.91, 0.26],
        quaternion: [0.258, 0.016, -0.005, 0.966],
      }

      // assign vtomodes name and model
      let vtoModesName = 'ring' + key;

      ringModelCommonSettings[vtoModesName] = ringModel

      _settings.VTOModes[vtoModesName]= Object.assign({
        NNsPaths: [NNPath + 'NN_RING_' + NNRingVersion + '.json']
      }, ringModesCommonSettings);

      _settings.models[vtoModesName] = Object.assign({
        VTOMode: vtoModesName
      }, ringModelCommonSettings[vtoModesName])

      // write html to show entire model list image thumbnail
      _html_ring_list += `
        <div class="model-ring change-ring-model ${key === 0 ? 'model-ring-active' : ''}" data-key="${key}">
            <img src="${model[1]}" class="model-thumbnail" alt="...">
        </div>
      `
    })
    data.body.stones.forEach(function (model, key) {
      let stoneModel = {
        URL: model[0],

        scale: 0.421,
        offset: [-1.66, -11.91, 0.26],
        quaternion: [0.258, 0.016, -0.005, 0.966],
      }

      // assign vtomodes name and model
      let vtoModesName = 'stone' + key;

      ringModelCommonSettings[vtoModesName] = stoneModel

      _settings.VTOModes[vtoModesName]= Object.assign({
        NNsPaths: [NNPath + 'NN_RING_' + NNRingVersion + '.json']
      }, ringModesCommonSettings);

      _settings.models[vtoModesName] = Object.assign({
        VTOMode: vtoModesName
      }, ringModelCommonSettings[vtoModesName])


      // write html to show entire model list image thumbnail
      _html_stone_list += `
        <div class="model-stone change-stone-model ${key === 0 ? 'model-stone-active' : ''}" data-key="${key}">
            <img src="${model[1]}" class="model-thumbnail" alt="...">
        </div>
      `
    })

    //add html template to view
    $('.model-stone-list-item').html(_html_stone_list)
    $('.model-ring-list-item').html(_html_ring_list)

    //run owl
    $('.carousel-ring').owlCarousel({
      loop:false,
      margin:10,
      nav:true,
      navText: ["<i class='prev bx bx-chevron-left'></i>", "<i class='next bx bx-chevron-right' ></i>"],
      responsive:{
        0:{
          items:4
        },
        600:{
          items:4
        },
        1000:{
          items:4
        }
      }
    })

    $('.carousel-stone').owlCarousel({
      loop:false,
      margin:10,
      nav:true,
      navText: ["<i class='prev bx bx-chevron-left'></i>", "<i class='next bx bx-chevron-right' ></i>"],
      responsive:{
        0:{
          items:4
        },
        600:{
          items:4
        },
        1000:{
          items:4
        }
      }
    })

    //click event handle change model
    $(document).on('click', '.change-ring-model' ,function() {
      $('.change-ring-model').removeClass('model-ring-active')
      $(this).addClass('model-ring-active');
      let modelId = 'ring'+$(this).data('key')
      load_ring_model(modelId);
    })

    $(document).on('click', '.change-stone-model' ,function() {
      $('.change-stone-model').removeClass('model-stone-active')
      $(this).addClass('model-stone-active');
      let modelId = 'stone'+$(this).data('key')
      load_stone_model(modelId);
    })

    let _VTOMode = null;
    let _VTOModel = null;

    const _states = {
      notLoaded: -1,
      loading: 0,
      idle: 1,
      running: 2,
      busy: 3
    };
    let _state = _states.notLoaded;
    let _isSelfieCam = true;
    let _isInstructionsHidden = false;

    function setFullScreen(cv){
      const pixelRatio = window.devicePixelRatio || 1;
      cv.width = pixelRatio * window.innerWidth;
      cv.height = pixelRatio * window.innerHeight;
    }

    function is_mobileOrTablet(){
      let check = false;
      // from https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
          || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
        check = true;
      }
      return check;
    }

    // entry point:
    function main(){
      _state = _states.loading;

      console.log(_settings)
      console.log(ringModelCommonSettings)
      // get canvases and size them:
      const handTrackerCanvas = document.getElementById('handTrackerCanvas');
      const VTOCanvas = document.getElementById('VTOCanvas');

      // initial VTO mode:
      let initialModelSettings = _settings.models[_settings.initialRing];
      _VTOMode = initialModelSettings.VTOMode; // "ring" or "wrist"
      let VTOModeSettings = _settings.VTOModes[_VTOMode];

      setFullScreen(handTrackerCanvas);
      setFullScreen(VTOCanvas);
      set_canvasMirroring(!is_mobileOrTablet());

      // initialize Helper:
      HandTrackerThreeHelper.init({
        stabilizationSettings: {
        },
        scanSettings: {
          translationScalingFactors: [0.3, 0.3, 1]
        },
        videoSettings: get_videoSettings(),
        landmarksStabilizerSpec: VTOModeSettings.landmarksStabilizerSpec,
        objectPointsPositionFactors: VTOModeSettings.objectPointsPositionFactors,
        poseLandmarksLabels: VTOModeSettings.poseLandmarksLabels,
        poseFilter: (VTOModeSettings.isPoseFilter) ? PoseFlipFilter.instance({}) : null,
        NNsPaths: VTOModeSettings.NNsPaths,
        threshold: VTOModeSettings.threshold,
        VTOCanvas: VTOCanvas,
        callbackTrack: callbackTrack,
        handTrackerCanvas: handTrackerCanvas,
        debugDisplayLandmarks: _settings.debugDisplayLandmarks,
      }).then(start).catch(function(err){
        throw new Error(err);
      });
    }

    function setup_lighting(three){
      const scene = three.scene;

      // TODO: customize
      const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 2 );
      scene.add(hemiLight);

      const pointLight = new THREE.PointLight( 0xffffff, 2 );
      pointLight.position.set(0, 100, 0);
      scene.add(pointLight);
    }

    /*
    * Never realy change vto so dont need VTO_MODE
    * */
    function load_ring_model(modelId, threeLoadingManager){
      const modelSettings = _settings.models[modelId];

      // delet object if not empty
      if (previousRingModel !== '') {
        HandTrackerThreeHelper.clear_threeNameObjects(false, previousRingModel);
      }

      // load new model:
      new THREE.GLTFLoader(threeLoadingManager).load(modelSettings.URL, function(model){
        const me = model.scene.children[0]; // instance of THREE.Mesh
        previousRingModel = me.name;
        me.scale.set(1, 1, 1);

        // tweak the material:
        if (_settings.debugMeshMaterial){
          me.traverse(function(child){
            if (child.material){
              child.material = new THREE.MeshNormalMaterial();
            }});
        }

        // tweak position, scale and rotation:
        if (modelSettings.scale){
          me.scale.multiplyScalar(modelSettings.scale);
        }
        if (modelSettings.offset){
          const d = modelSettings.offset;
          const displacement = new THREE.Vector3(d[0], d[2], -d[1]); // inverse Y and Z
          me.position.add(displacement);
        }
        if (modelSettings.quaternion){
          const q = modelSettings.quaternion;
          me.quaternion.set(q[0], q[2], -q[1], q[3]);
        }

        // add to the tracker:
        HandTrackerThreeHelper.add_threeObject(me);
        _state = _states.running;

      });
    }

    function load_stone_model(modelId, threeLoadingManager){
      const modelSettings = _settings.models[modelId];

      if (previousStoneModel !== '') {
        HandTrackerThreeHelper.clear_threeNameObjects(false, previousStoneModel);
      }

      // load new model:
      new THREE.GLTFLoader(threeLoadingManager).load(modelSettings.URL, function(model){
        const me = model.scene.children[0]; // instance of THREE.Mesh
        previousStoneModel = me.name;
        me.scale.set(1, 1, 1);

        // tweak the material:
        if (_settings.debugMeshMaterial){
          me.traverse(function(child){
            if (child.material){
              child.material = new THREE.MeshNormalMaterial();
            }});
        }

        // tweak position, scale and rotation:
        if (modelSettings.scale){
          me.scale.multiplyScalar(modelSettings.scale);
        }
        if (modelSettings.offset){
          const d = modelSettings.offset;
          const displacement = new THREE.Vector3(d[0], d[2], -d[1]); // inverse Y and Z
          me.position.add(displacement);
        }
        if (modelSettings.quaternion){
          const q = modelSettings.quaternion;
          me.quaternion.set(q[0], q[2], -q[1], q[3]);
        }

        // add to the tracker:
        HandTrackerThreeHelper.add_threeObject(me);
        _state = _states.running;
      });
    }

    function start(three){
      VTOCanvas.style.zIndex = 3; // fix a weird bug on iOS15 / safari

      setup_lighting(three);

      three.loadingManager.onLoad = function(){
        console.log('INFO in main.js: All THREE.js stuffs are loaded');
        hide_loading();
        _state = _states.running;
      }

      if (_settings.debugWholeHand){
        add_wholeHand(three.loadingManager);
      }

      set_occluder().then(function(){
        _state = _states.idle;
      }).then(function(){
        // load dua model
        load_ring_model(_settings.initialRing, three.loadingManager);
        load_stone_model(_settings.initialStone, three.loadingManager);
      });
    }

    function add_wholeHand(threeLoadingManager){
      new THREE.GLTFLoader(threeLoadingManager).load('assets/debug/debugHand.glb', function(model){
        const debugHandModel = model.scene.children[0];
        debugHandModel.traverse(function(threeStuff){
          if (threeStuff.material){
            threeStuff.material = new THREE.MeshNormalMaterial();
          }
        })
        HandTrackerThreeHelper.add_threeObject(debugHandModel);
      });
    }

    function set_occluder(){
      const VTOModeSettings = _settings.VTOModes[_VTOMode];

      if (VTOModeSettings.occluderType === 'SOFTCYLINDER'){
        return add_softOccluder(VTOModeSettings);
      } else if (VTOModeSettings.occluderType === 'MODEL'){
        return add_hardOccluder(VTOModeSettings);
      } else { // no occluder specified
        return Promise.resolve();
      }
    }

    function add_hardOccluder(VTOModeSettings){
      return new Promise(function(accept, reject){
        new THREE.GLTFLoader().load(VTOModeSettings.occluderModelURL, function(model){
          const me = model.scene.children[0]; // instance of THREE.Mesh
          me.scale.multiplyScalar(VTOModeSettings.occluderScale);

          if (_settings.debugOccluder){
            me.material = new THREE.MeshNormalMaterial();
            return;
          }
          HandTrackerThreeHelper.add_threeOccluder(me);
          accept();
        });
      });
    }

    function add_softOccluder(VTOModeSettings){
      // add a soft occluder (for the wrist for example):
      const occluderRadius = VTOModeSettings.occluderRadiusRange[1];
      const occluderMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(occluderRadius, occluderRadius, VTOModeSettings.occluderHeight, 32, 1, true),
          new THREE.MeshNormalMaterial()
      );
      const dr = VTOModeSettings.occluderRadiusRange[1] - VTOModeSettings.occluderRadiusRange[0];
      occluderMesh.position.fromArray(VTOModeSettings.occluderOffset);
      occluderMesh.quaternion.fromArray(VTOModeSettings.occluderQuaternion);
      occluderMesh.scale.set(1.0, 1.0, VTOModeSettings.occluderFlattenCoeff);
      HandTrackerThreeHelper.add_threeSoftOccluder(occluderMesh, occluderRadius, dr, _settings.debugOccluder);
      return Promise.resolve();
    }

    function get_videoSettings(){
      return {
        facingMode: (_isSelfieCam) ? 'environment' : 'user'
      };
    }

    function flip_camera(){
      if (_state !== _states.running || !is_mobileOrTablet()){
        return;
      }
      _state = _states.busy;
      WEBARROCKSHAND.update_videoSettings(get_videoSettings()).then(function(){
        _isSelfieCam = !_isSelfieCam;
        _state = _states.running;
        // mirror canvas using CSS in selfie cam mode:
        set_canvasMirroring(_isSelfieCam);
        console.log('INFO in main.js: Camera flipped successfully');
      }).catch(function(err){
        console.log('ERROR in main.js: Cannot flip camera -', err);
      });
    }

    function set_canvasMirroring(isMirror){
      document.getElementById('canvases').style.transform = (isMirror) ? 'rotateY(180deg)' : '';
    }

    function hide_loading(){
      // remove loading:
      const domLoading = document.getElementById('loading');
      domLoading.style.opacity = 0;
      setTimeout(function(){
        domLoading.parentNode.removeChild(domLoading);
      }, 800);
    }

    function callbackTrack(detectState){
      if (detectState.isDetected) {
        if (!_isInstructionsHidden){
          hide_instructions();
        }
      }
    }

    window.addEventListener('load', main);
  }
});

// dont move
function hide_instructions(){
  const domInstructions = document.getElementById('instructions');
  if (!domInstructions){
    return;
  }
  domInstructions.style.opacity = 0;
  _isInstructionsHidden = true;
  setTimeout(function(){
    domInstructions.parentNode.removeChild(domInstructions);
  }, 800);
}



