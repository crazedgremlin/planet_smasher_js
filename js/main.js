var TIME_COEFF = 0.005;

var camera, scene, renderer;
var geometry, material, mesh;
var time = 0;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true 
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    var particleCount = 1800;
    var particles = new THREE.Geometry();
    var pMaterial = new THREE.ParticleBasicMaterial({
          color: 0xFFFF99,
          size: 4 
    });
   
    for (var p=0; p<particleCount; p++) {

        function randVal(min, max) {
            return Math.random() * (max-min) + min;
        }

        var pX = randVal(-500, 500);
        var pY = randVal(-500, 500);
        var pZ = randVal(-500, 500);
        var particle = new THREE.Vector3(pX, pY, pZ);

        particles.vertices.push(particle);
    }

    var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
    scene.add(particleSystem);


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

function animate() {
    time++;
    
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);

    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

    camera.position.x = Math.cos(time*TIME_COEFF) * 1000;
    camera.position.z = Math.sin(time*TIME_COEFF) * 1000;
    camera.lookAt( new THREE.Vector3(0,0,0) );

    renderer.render(scene, camera);

}
