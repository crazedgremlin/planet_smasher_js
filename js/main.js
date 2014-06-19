var MIN_COORD = -1000;
var MAX_COORD = 1000;
var TIME_COEFF = 0.005;

var camera, scene, renderer, controls;
var geometry, material, mesh;

var time = 0;
var planetArr = createPlanets();
var projectile = new SpaceObject();


init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    (function createRedBox() {
        geometry = new THREE.BoxGeometry(50,50,50);
        material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true 
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    })();

    (function createStarfield() {
        var particleCount = 1800;
        var particles = new THREE.Geometry();
        var pMaterial = new THREE.ParticleBasicMaterial({
              color: 0xFFFF99,
              size: 4 
        });

        for (var p=0; p<particleCount; p++) {

            var extra = 1.5;
            var pX = randVal(extra*MIN_COORD, extra*MAX_COORD);
            var pY = randVal(extra*MIN_COORD, extra*MAX_COORD);
            var pZ = randVal(extra*MIN_COORD, extra*MAX_COORD);
            var particle = new THREE.Vector3(pX, pY, pZ);

            particles.vertices.push(particle);
        }

        var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
        scene.add(particleSystem);
    })();
   
    (function makePlanets() {
        for (var i=0; i<planetArr.length; i++) {
            var thisPlanet = planetArr[i];
            
            var planetMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ddff,
                wireframe: true 
            });
            var planetGeometry = new THREE.BoxGeometry(100, 100, 100);
            planetGeometry.applyMatrix(
                new THREE.Matrix4().makeTranslation(thisPlanet.x, thisPlanet.y, thisPlanet.z)
            );
            var planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

            scene.add(planetMesh);
        }
    })();



    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);


    (function setUpCamera() {
        controls = new THREE.TrackballControls( camera );

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        controls.keys = [ 65, 83, 68 ];

        controls.addEventListener( 'change', renderer.render );
    })();

    document.body.appendChild(renderer.domElement);
}

function animate() {
    time++;
    
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);

    // Rotate projectile
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    // Rotate camera
    function rotateCam() {
        camera.position.x = Math.cos(time*TIME_COEFF) * 1000;
        camera.position.z = Math.sin(time*TIME_COEFF) * 1000;
        camera.position.y = Math.cos(time*TIME_COEFF) * 1000;
        camera.lookAt( new THREE.Vector3(0,0,0) );
    }
    //rotateCam();

    renderer.render(scene, camera);
    controls.update();
}


function randVal(min, max) {
    return Math.random() * (max-min) + min;
}

function createPlanets() {
    var planets = []; // pirate code?
    var numPlanets = Math.floor(randVal(3, 7));

    console.log(MIN_COORD + "; " + MAX_COORD);
    for (var i=0; i<numPlanets; i++) {
        var thisSpaceObj = new SpaceObject();

        // X and Z are evenly dispersed
        thisSpaceObj.x = randVal(MIN_COORD, MAX_COORD);
        thisSpaceObj.z = randVal(MIN_COORD, MAX_COORD);
        // Y is artifically limited to a small range, keeping planets generally on a plane
        thisSpaceObj.y = randVal(MIN_COORD, MAX_COORD)/20;

        planets[i] = thisSpaceObj;
    }

    return planets;
}
