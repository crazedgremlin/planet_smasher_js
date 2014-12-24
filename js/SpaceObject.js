SpaceObject = function() {
    // properties
    this.mass = 1;
    this.radius = 1;

    // positions
    this.pos = new THREE.Vector3(0,0,0);
    this.vel = new THREE.Vector3(0,0,0);

    this.getPosVec = function() {
        return this.pos.clone();
    }
    this.getVelVec = function() {
        return this.vel.clone();
    }

    this.stepTime = function() {
        this.pos.add(this.vel);
    }

    this.updateMesh = function(mesh) {
        // copy the value of this.pos to the specified mesh
        mesh.position.copy(this.pos);
    }
}
