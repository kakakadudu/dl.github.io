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

const list = [];
const spheres = new THREE.Object3D();
const ball = new THREE.SphereGeometry(1, 36, 36);
function createSpheres(count) {
  for (let i = 0; i < count; i++) {
    const sphere = ball.clone();
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(Math.random() * 0xffffff),
      transparent: true,
      opacity: Math.random()
    });
    // 网格模型 几何体和材质结合
    const mesh = new THREE.Mesh(sphere, material);
    mesh.position.set(Math.random() * cw - cw / 2, Math.random() * ch - ch / 2, Math.random() * 1000 - 500);
    const scale = Math.random() * 0.5 + 0.2;
    mesh.scale.set(scale, scale, scale);
    spheres.add(mesh);
    list.push(mesh);
    scene.add(spheres);
  }
}

const stars = new THREE.Object3D();
const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * 3), 3));
function createStars(count) {
  for (let i = 0; i < count; i++) {
    const material = new THREE.PointsMaterial({
      color: Math.random() * 0xffffff,
      transparent: true,
      opacity: Math.random(),
      size: Math.random() * 0.5 + 0.2,
    });
    const mesh = new THREE.Points(bufferGeometry, material);
    mesh.position.set(Math.random() * cw - cw / 2, Math.random() * ch - ch / 2, Math.random() * 1000 - 500);
    stars.add(mesh);
    list.push(mesh);
    scene.add(stars);
  }
}

// 
function initial() {
  createSpheres(10);
  createStars(5000);
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
  let n = Math.random() * 0.001 - 0.001;
  stars.rotation.y += n;
  spheres.rotation.y += n;
  list.forEach(star => {
    let n = Math.random() * 0.01 - 0.01;
    star.rotation.x += n;
    star.position.x += n;
    star.position.y += n;
    star.position.z += n;
  })
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  if (count % 10 === 0 && spheres.children.length < 1000) {
    createSpheres(1);
  }
  // 渲染到屏幕
  renderer.render(scene, camera);
  requestAnimationFrame(rotate)
}
requestAnimationFrame(rotate)