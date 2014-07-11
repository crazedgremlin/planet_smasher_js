SpaceObject = function() {
    // properties
    this.mass = 1;

    // positions
    this.x = 0;
    this.y = 0;
    this.z = 0;

    // velocities
    this.v_x = 0;
    this.v_y = 0;
    this.v_z = 0;


    this.stepTime = function() {
        this.x += this.v_x;
        this.y += this.v_y;
        this.z += this.v_z;
    }

    this.updateMesh = function(mesh) {
        mesh.position.x = this.x;
        mesh.position.y = this.y;
        mesh.position.z = this.z;
    }
}
