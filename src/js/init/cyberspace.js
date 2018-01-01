const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');

const ForcePerspectiveCamera = require('../modules/common/ForcePerspectiveCamera').default;
const loadTexs = require('../modules/common/loadTexs').default;

const CameraController = require('../modules/sketch/cyberspace/CameraController').default;
const GUI = require('../modules/sketch/cyberspace/GUI').default;
const Beam = require('../modules/sketch/cyberspace/Beam').default;
const Node = require('../modules/sketch/cyberspace/Node').default;
const FloatPoints = require('../modules/sketch/cyberspace/FloatPoints').default;
const Bg = require('../modules/sketch/cyberspace/Bg').default;
const BgLine = require('../modules/sketch/cyberspace/BgLine').default;

export default function() {
  const resolution = new THREE.Vector2();
  const mousemove = new THREE.Vector2();
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new ForcePerspectiveCamera();
  const cameraController = new CameraController(camera);
  const clock = new THREE.Clock();

  camera.far = 50000;
  camera.setFocalLength(24);

  //
  // process for this sketch.
  //

  const gui = new GUI();
  const beam = new Beam();
  const node = new Node();
  const floatPoints = new FloatPoints();
  const bg = new Bg();
  const bgLine1 = new BgLine();
  const bgLine2 = new BgLine();

  const texs = {
    gui1: '../img/sketch/cyberspace/tex_gui01.png',
    gui2: '../img/sketch/cyberspace/tex_gui02.png',
    gui3: '../img/sketch/cyberspace/tex_gui03.png',
  };

  //
  // common process
  //
  const render = () => {
    const time = clock.getDelta();

    gui.render(time);
    beam.render(time);
    node.render(time);
    floatPoints.render(time);
    bg.render(time);
    bgLine1.render(time, 0.1, 0.1, 0.3);
    bgLine2.render(time, -0.2, 0.02, -0.8);

    cameraController.render(time, mousemove);
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();
  };
  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setSize(resolution.x, resolution.y);
  };
  const on = () => {
    window.addEventListener('resize', debounce(resizeWindow), 1000);
    window.addEventListener('mousemove', (event) => {
      mousemove.set(
        event.clientX / resolution.x * 2.0 - 1.0,
        event.clientY / resolution.y * 2.0 - 1.0
      );
    });
    window.addEventListener('mouseout', (event) => {
      mousemove.set(0, 0);
    });
  };

  const init = () => {
    loadTexs(texs, (loadedTexs) => {
      gui.createObj(
        [loadedTexs.gui1, loadedTexs.gui2, loadedTexs.gui3]
      );
      beam.createObj();
      node.createObj();
      floatPoints.createObj();
      bg.createObj();
      bgLine1.createObj(1200, 284.1, 398.6, 601.2, 828.4);
      bgLine2.createObj(2400, 222.6, 412.4, 683.9, 961.2);

      scene.add(gui.obj);
      scene.add(beam.obj);
      scene.add(node.obj);
      scene.add(node.objWire);
      scene.add(node.objPoints);
      scene.add(floatPoints.obj);
      scene.add(bg.obj);
      scene.add(bgLine1.obj);
      scene.add(bgLine2.obj);

      bg.obj.position.set(0, 0, -2000);

      renderer.setClearColor(0x000000, 1.0);
      cameraController.init([0, 0, 1000], [0, 0, 0]);

      clock.start();

      on();
      resizeWindow();
      renderLoop();
    });
  }
  init();
}