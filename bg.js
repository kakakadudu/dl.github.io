const cw = window.innerWidth;
const ch = window.innerHeight;

// 创建场景
const scene = new THREE.Scene();
// 透视投影 会根据远近距离缩放物体
const camera = new THREE.PerspectiveCamera(45, cw / ch, 1, 10000);
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
  alpha: true,
});
// 相机位置
camera.position.set(0, 0, 500);

// 设置渲染器的尺寸
renderer.setSize(cw, ch);
document.querySelector('.wrap').appendChild(renderer.domElement);
scene.background = new THREE.TextureLoader().load('./2k_stars_milky_way.jpg', tex => {
  tex.colorSpace = THREE.SRGBColorSpace;
})

const stars = new THREE.Object3D();
const ball = new THREE.SphereGeometry(1, 36, 36);
function createStars(count) {
  for (let i = 0; i < count; i++) {
    sphere = ball.clone();
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(Math.random() * 0xffffff),
      transparent: true,
      opacity: Math.random()
    });
    // 网格模型 几何体和材质结合
    const mesh = new THREE.Mesh(sphere, material);
    mesh.position.set(Math.random() * cw - cw / 2, Math.random() * ch - ch / 2, Math.random() * 1000 - 500);
    const scale = Math.random() * 0.5 + 0.2;
    mesh.scale.set(scale, scale, scale);
    stars.add(mesh);
    scene.add(stars);
  }
}

// 
function initial() {
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  createStars(10);
  renderer.render(scene, camera);
}
initial();


let timer = null;
window.addEventListener('resize', function () {
  clearTimeout(timer);
  timer = setTimeout(() => {
    onWindowResize();
  }, 500)
}, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

let count = 0;
function rotate() {
  count++;
  stars.rotation.y += 0.001;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  if (count % 10 === 0 && stars.children.length < 1000) {
    createStars(1);
  }
  // 渲染到屏幕
  renderer.render(scene, camera);
  requestAnimationFrame(rotate)
}
requestAnimationFrame(rotate)