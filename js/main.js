var MIN_STAR_DIST = 5000;
var MAX_STAR_DIST = 10000;

var MIN_COORD = -1500;
var MAX_COORD = 1500;

var MIN_MASS = 10;
var MAX_MASS = 100;

var INITIAL_PROJECTILE_VELOCITY = 10;

var TIME_COEFF = 0.015;

var camera, scene, renderer, controls;
var geometry, material, mesh;

var time = 0;
var planetArr = createPlanets();
var projectile = new SpaceObject();
var arrowHelper;


init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 2000, 10000);


    (function setUpArrow() {
        var dir = new THREE.Vector3( 1, 0, 0 );
        var origin = new THREE.Vector3( 0, 0, 0 );
        var length = 100;
        var hex = 0x00ff00;

        //arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        //scene.add( arrowHelper );
    })();


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

        function doRandomParticles(num, color, size) {
            var particles = new THREE.Geometry();

            var pMaterial = new THREE.ParticleSystemMaterial({
                  color: color,
                  size: size,
                  fog: true
            });

            for (var p=0; p<num; p++) {
                var minCoord = MIN_COORD;
                var maxCoord = MAX_COORD;
                var pX = randVal(minCoord,maxCoord);
                var pY = 0.2 * randVal(minCoord,maxCoord);
                var pZ = randVal(minCoord,maxCoord);
                var particle = new THREE.Vector3(pX, pY, pZ);

                var starDist = randVal(MIN_STAR_DIST, MAX_STAR_DIST);
                particle.setLength(starDist);
                particles.vertices.push(particle);
            }

            var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
            scene.add(particleSystem);
        }

        // small yeller stars
        doRandomParticles(100, 0xFFFF99, 20);
        // big yeller stars
        doRandomParticles(100, 0xFFFF99, 40);
        // red giants 
        doRandomParticles(5, 0xFF4444, 70);
        // blue giants
        doRandomParticles(5, 0xAAAAFF, 70);

    })();
   
    (function makePlanets() {
        for (var i=0; i<planetArr.length; i++) {
            var thisPlanet = planetArr[i];
            
            var planetMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ddff,
                wireframe: true 
            });
            var planetGeometry = new THREE.TetrahedronGeometry(thisPlanet.radius, 3);
            planetGeometry.applyMatrix(
                new THREE.Matrix4().makeTranslation(thisPlanet.pos.x, 
                                                    thisPlanet.pos.y, 
                                                    thisPlanet.pos.z)
            );
            var planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

            scene.add(planetMesh);
        }
    })();



    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);


    document.body.appendChild(renderer.domElement);
}

function animate() {
    time++;
    updateProjectileVelocities();
    
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);


    // Rotate camera
    function rotateCam() {
        camera.position = mesh.position.clone();
        camera.position.x += Math.cos(time*TIME_COEFF) * 1000;
        camera.position.z += Math.sin(time*TIME_COEFF) * 1000;
        camera.position.y += Math.cos(time*TIME_COEFF) * 1000;

        camera.lookAt( new THREE.Vector3() );
    }
    

    // Create a normalized vector pointing in the direction of motion
    var velocityVec = projectile.getVelVec();
    var speed = velocityVec.length();
    velocityVec.setLength(1);


    // Rotate projectile
    mesh.rotation.x += 0.001 * speed;
    mesh.rotation.y += 0.002 * speed;

    // Elongate that vector
    var longVelocityVec = velocityVec.clone();
    longVelocityVec.setLength(100 / speed*speed );

    var forwardPos = mesh.position.clone();
    forwardPos = forwardPos.add(longVelocityVec);

    var backwardPos = mesh.position.clone();
    backwardPos.sub(longVelocityVec);

    camera.position = backwardPos.clone();
    camera.lookAt(forwardPos);
    camera.updateProjectionMatrix();

    //arrowHelper.position = backwardPos.clone();
    //arrowHelper.setDirection(velocityVec);

    projectile.stepTime();
    projectile.updateMesh(mesh);
    //rotateCam();
 

    renderer.render(scene, camera);
    controls.update();
}

function updateProjectileVelocities() {
    var planetPosVec = new THREE.Vector3();
    var forceScalar;
    var forceVec = new THREE.Vector3();
    var thisForceVec = new THREE.Vector3();

    for (var i=0; i<planetArr.length; i++) {
        var thisPlanet = planetArr[i];
        planetPosVec = thisPlanet.getPosVec();
        forceScalar = thisPlanet.mass / Math.pow(mesh.position.distanceTo(planetPosVec), 2);   
    
        thisForceVec = planetPosVec.clone();
        thisForceVec.sub( mesh.position );
        thisForceVec.setLength(forceScalar * 100);

        forceVec.add(thisForceVec);
    }

    projectile.vel.add(forceVec);
}


function randVal(min, max) {
    return Math.random() * (max-min) + min;
}

function createPlanets() {
    var planets = []; 
    var numPlanets = Math.floor(randVal(3, 7));

    for (var i=0; i<numPlanets; i++) {
        var thisSpaceObj = new SpaceObject();
        thisSpaceObj.mass = randVal(MIN_MASS, MAX_MASS);
        thisSpaceObj.radius = 2*thisSpaceObj.mass;

        // X and Z are evenly dispersed
        thisSpaceObj.pos.x = randVal(MIN_COORD, MAX_COORD);
        thisSpaceObj.pos.z = randVal(MIN_COORD, MAX_COORD);
        // Y is artifically limited to a small range, keeping planets generally on a plane
        thisSpaceObj.pos.y = randVal(MIN_COORD, MAX_COORD)/20;

        planets[i] = thisSpaceObj;
    }

    return planets;
}

window.onkeydown = function(e) {

    // Spacebar
    if (e.keyCode == 32) {

        // Set velocity of projectile

        // get direction camera is looking
        var vector = new THREE.Vector3( 0, 0, -1 );
        vector.applyQuaternion( camera.quaternion );
        //angle = vector.angleTo( mesh.position );

        console.log(vector);

        projectile.v_x = vector.x * INITIAL_PROJECTILE_VELOCITY;
        projectile.v_y = vector.y * INITIAL_PROJECTILE_VELOCITY;
        projectile.v_z = vector.z * INITIAL_PROJECTILE_VELOCITY;
    }
}
