let camera;
let last_render = Date.now();

// Stars properties
let n_stars = 64;
let star_color = [1,1,1,1]
let star_size = 2.0
let stars = {x: [], y: [], z: []}

// Solar system properties
let orbit_angle = 0.0;
let orbit_duration = 15000; // ms
let orbit_n_segments = 64;
let orbit_color = [1,1,1,1]
let orbit_size = 1

// Planet properties
let sphereIFS;
let sphere_file = "sphere.obj"
let planet_texture_file = "planet_texture.jpg"
let planet_texture_offset = 0;
let planete_day_duration = 5000; // ms
let planete_angle = 0;

// Satellite properties
let satelliteIFS;
let satellite_file = "satellite.obj"
let satellite_orbit_duration = 3000; // ms
let satellite_orbit_angle = 0;
let satellite_orbit_color = [0,1,0,1]

//Generates randoms coordinates for stars
function generate_randomStars() {
    for (let i = 0; i < n_stars; i++) {
        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;
        let z = Math.random() * 2 - 1;
        let length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        length = length / (1 + Math.random());
        stars.x[i] = x / length;
        stars.y[i] = y / length;
        stars.z[i] = z / length;
    }
}

//Generates the pyramid IFS object
function generate_pyramid_IFS(){
    let model = {};
    model.vertex = [
        Math.sqrt(8/9), 0, -1/3,
        -Math.sqrt(2/9), Math.sqrt(2/3), -1/3,
        -Math.sqrt(2/9), -Math.sqrt(2/3), -1/3,
        0,0,1
    ];
    model.faces = [
        0,1,2,
        1,3,2,
        0,3,1,
        0,2,3
    ];
    model.normals = [
        //Face 0
        (model.vertex[model.faces[0 * 3 + 0] * 3 + 0] + model.vertex[model.faces[0 * 3 + 1] * 3 + 0] + model.vertex[model.faces[0 * 3 + 2] * 3 + 0]) / 3,
        (model.vertex[model.faces[0 * 3 + 0] * 3 + 1] + model.vertex[model.faces[0 * 3 + 1] * 3 + 1] + model.vertex[model.faces[0 * 3 + 2] * 3 + 1]) / 3,
        (model.vertex[model.faces[0 * 3 + 0] * 3 + 2] + model.vertex[model.faces[0 * 3 + 1] * 3 + 2] + model.vertex[model.faces[0 * 3 + 2] * 3 + 2]) / 3,
        //Face 1
        (model.vertex[model.faces[1 * 3 + 0] * 3 + 0] + model.vertex[model.faces[1 * 3 + 1] * 3 + 0] + model.vertex[model.faces[1 * 3 + 2] * 3 + 0]) / 3,
        (model.vertex[model.faces[1 * 3 + 0] * 3 + 1] + model.vertex[model.faces[1 * 3 + 1] * 3 + 1] + model.vertex[model.faces[1 * 3 + 2] * 3 + 1]) / 3,
        (model.vertex[model.faces[1 * 3 + 0] * 3 + 2] + model.vertex[model.faces[1 * 3 + 1] * 3 + 2] + model.vertex[model.faces[1 * 3 + 2] * 3 + 2]) / 3,
        //Face 2
        (model.vertex[model.faces[2 * 3 + 0] * 3 + 0] + model.vertex[model.faces[2 * 3 + 1] * 3 + 0] + model.vertex[model.faces[2 * 3 + 2] * 3 + 0]) / 3,
        (model.vertex[model.faces[2 * 3 + 0] * 3 + 1] + model.vertex[model.faces[2 * 3 + 1] * 3 + 1] + model.vertex[model.faces[2 * 3 + 2] * 3 + 1]) / 3,
        (model.vertex[model.faces[2 * 3 + 0] * 3 + 2] + model.vertex[model.faces[2 * 3 + 1] * 3 + 2] + model.vertex[model.faces[2 * 3 + 2] * 3 + 2]) / 3,
        //Face 3
        (model.vertex[model.faces[3 * 3 + 0] * 3 + 0] + model.vertex[model.faces[3 * 3 + 1] * 3 + 0] + model.vertex[model.faces[3 * 3 + 2] * 3 + 0]) / 3,
        (model.vertex[model.faces[3 * 3 + 0] * 3 + 1] + model.vertex[model.faces[3 * 3 + 1] * 3 + 1] + model.vertex[model.faces[3 * 3 + 2] * 3 + 1]) / 3,
        (model.vertex[model.faces[3 * 3 + 0] * 3 + 2] + model.vertex[model.faces[3 * 3 + 1] * 3 + 2] + model.vertex[model.faces[3 * 3 + 2] * 3 + 2]) / 3,
    ];
    return model
}

//Draws a pyramid
function draw_pyramid(model, posX, posZ, rotation, scale, color) {
    glPushMatrix();
    glRotatef(rotation, 0, 1, 0);
    glTranslated(posX,0,posZ);
    glScalef(scale, scale, scale);
    glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, color);
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, color);
    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, model.sommets);
    glEnableClientState(GL_NORMAL_ARRAY);
    glNormalPointer(GL_FLOAT, 0, model.normales);
    glDrawElements(GL_TRIANGLES, model.faces.length, GL_UNSIGNED_BYTE, model.faces);
    glDisableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_NORMAL_ARRAY);
    glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, [0, 0, 0, 0]);
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, [0, 0, 0, 0]);
    glPopMatrix();
}

//Draws the sun
function draw_sun(model, scale) {
    glPushMatrix();
    glScalef(scale, scale, scale);
    glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, [1, 0.7, 0, 1]);
    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, model.vertexPositions);
    glEnableClientState(GL_NORMAL_ARRAY);
    glNormalPointer(GL_FLOAT, 0, model.vertexNormals);
    glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glTexCoordPointer(2, GL_FLOAT, 0, model.texturePositions);
    glDrawElements(GL_TRIANGLES, model.parts["Sphere_Sphere.001"].length, GL_UNSIGNED_BYTE, model.parts["Sphere_Sphere.001"]);
    glDisableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_NORMAL_ARRAY);
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);
    glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, [0, 0, 0, 0]);
    glPopMatrix();
}

//Draws the earth's orbit, its satellite and then the earth itself
function draw_earth(model, rotation, scale) {
    draw_orbit(orbit_color, 24, orbit_size, 0, 0);
    glPushMatrix();
    glRotatef(planete_angle, 0, 1, 0);
    glTranslated(orbit_size,0,0);
    draw_satellite(satelliteIFS,0.3, 0.02);
    glEnable(GL_TEXTURE_2D);
    glMatrixMode(GL_TEXTURE);
    glPushMatrix();
    glLoadIdentity();
    glTranslated(planet_texture_offset / 512,0,0);
    glPopMatrix();
    glMatrixMode(GL_MODELVIEW);
    glScalef(scale, scale, scale);
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, [1, 1, 1, 0.1]);
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, [1, 1, 1, 0.1]);
    glMaterialf(GL_FRONT_AND_BACK, GL_SHININESS, 0);
    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, model.vertexPositions);
    glEnableClientState(GL_NORMAL_ARRAY);
    glNormalPointer(GL_FLOAT, 0, model.vertexNormals);
    glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glTexCoordPointer(2, GL_FLOAT, 0, model.texturePositions);
    glDrawElements(GL_TRIANGLES, model.parts["Sphere_Sphere.001"].length, GL_UNSIGNED_BYTE, model.parts["Sphere_Sphere.001"]);
    glDisableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_NORMAL_ARRAY);
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, [0, 0, 0, 0]);
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, [0, 0, 0, 0]);
    glMaterialf(GL_FRONT_AND_BACK, GL_SHININESS, 0);
    glLightfv(GL_LIGHT0, GL_POSITION, [-1,0,0,0]);
    glPopMatrix();
    glDisable(GL_TEXTURE_2D);
}

//Draws all stars in the stars array
function draw_stars() {
    glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, star_color);
    glBegin(GL_POINTS);
    glPointSize(star_size);
    for (let i = 0; i < stars.x.length; i++) {
        glVertex3f(stars.x[i],stars.y[i],stars.z[i]);
    }
    glEnd();
    glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, [0, 0, 0, 1]);
}

//Draws an orbit
function draw_orbit(color, nbSegments, radius, posX, posZ){
    glPushMatrix();
    glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, color);
    glBegin(GL_LINE_STRIP);
    for(let i = 0; i < orbit_n_segments; i++) {
        let theta = i * Math.PI / nbSegments;
        glVertex3f(posX + radius * Math.cos(theta), orbit_angle, posZ + radius * Math.sin(theta));
    }
    glEnd();
    glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, [0, 0, 0, 1]);
    glPopMatrix();
}

//Draws the satellite's orbit then the satellite itself
function draw_satellite(model, position, scale){
    draw_orbit(satellite_orbit_color, 24, orbit_size/8, position, 0);
    glPushMatrix();
    glTranslated(position,0,0);
    glRotatef(satellite_orbit_angle, 0, 1, 0);
    glTranslated(-orbit_size/8,0,0);
    glRotatef(90, 1, 0, 0);
    glScalef(scale, scale, scale);
    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3, GL_FLOAT, 0, model.vertexPositions);
    glEnableClientState(GL_NORMAL_ARRAY);
    glNormalPointer(GL_FLOAT, 0, model.vertexNormals);
    glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glTexCoordPointer(2, GL_FLOAT, 0, model.texturePositions);
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, [0.5, 0.5, 0.5, 1]);
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, [1, 1, 1, 1]);
    glDrawElements(GL_TRIANGLES, model.parts["Corps_Cube"].length, GL_UNSIGNED_BYTE, model.parts["Corps_Cube"]);
    glDrawElements(GL_TRIANGLES, model.parts["Joint1_Cylinder"].length, GL_UNSIGNED_BYTE, model.parts["Joint1_Cylinder"]);
    glDrawElements(GL_TRIANGLES, model.parts["Joint2_Cylinder.001"].length, GL_UNSIGNED_BYTE, model.parts["Joint2_Cylinder.001"]);
    glDrawElements(GL_TRIANGLES, model.parts["Coupole_Sphere"].length, GL_UNSIGNED_BYTE, model.parts["Coupole_Sphere"]);
    glDrawElements(GL_TRIANGLES, model.parts["Antenne_Cylinder.002"].length, GL_UNSIGNED_BYTE, model.parts["Antenne_Cylinder.002"]);
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, [0, 0, 1, 0.1]);
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, [1, 1, 1, 0.1]);
    glDrawElements(GL_TRIANGLES, model.parts["Panneau1_Cube.001"].length, GL_UNSIGNED_BYTE, model.parts["Panneau1_Cube.001"]);
    glDrawElements(GL_TRIANGLES, model.parts["Panneau2_Cube.002"].length, GL_UNSIGNED_BYTE, model.parts["Panneau2_Cube.002"]);
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, [0, 0, 0, 0]);
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, [0, 0, 0, 0]);
    glDisableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_NORMAL_ARRAY);
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);
    glPopMatrix();
}

//Draws the scene
function draw() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    camera.apply();
    draw_stars();
    draw_sun(sphereIFS, 0.1);
    draw_earth(sphereIFS, planete_angle, 0.05);
    draw_pyramid(pyramidIFS, 0.7, 0, 0 + planete_angle, 0.025, [1,0,0,1]);
    draw_pyramid(pyramidIFS, 1.3, 0, 0 + planete_angle, 0.025, [0,1,0,1]);
    draw_pyramid(pyramidIFS, 1, 0, 180 + planete_angle, 0.025, [0,0,1,1]);
    draw_pyramid(pyramidIFS, 1, 0, 60 + planete_angle,  0.025, [1,1,0,1]);
    draw_pyramid(pyramidIFS, 1, 0, -60 + planete_angle, 0.025, [0,1,1,1]);
    last_render = Date.now();
}

//Updates the scene
function update() {
    let dt = Date.now() - last_render; // ms
    //Earth's texture offset
    planet_texture_offset += (dt / planete_day_duration) * 512;
    while (planet_texture_offset > 512) {
        planet_texture_offset -= 512;
    }
    //Earth's angle
    planete_angle += (dt / orbit_duration) * 360;
    while(planete_angle > 360) {
        planete_angle -= 360;
    }
    //Satellite's angle
    satellite_orbit_angle += (dt / satellite_orbit_duration) * 360;
    while (orbit_angle > 360) {
        orbit_angle -= 360;
    }
    draw();
    requestAnimationFrame(update);
}

//Initiates the scene
function init() {
    try {
        glsimUse("canvas");
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML="<p><b>Sorry, an error occurred:<br>" +
            e + "</b></p>";
        return;
    }
    //OpenGL states
    glEnable(GL_POINT_SMOOTH);
    glEnable(GL_LIGHTING);
    glEnable(GL_NORMALIZE);
    glEnable(GL_DEPTH_TEST);
    glClearColor(0,0,0,1);
    glEnable(GL_LIGHT0);
    //Pyramid IFS
    pyramidIFS = generate_pyramid_IFS();
    //Sphere IFS
    sphereIFS = loadOBJFile(sphere_file);
    //Satellite IFS
    satelliteIFS = loadOBJFile(satellite_file);
    //Planet's texture loading
    image = new Image();
    image.level = 0;
    image.onload = function () {
        glTexImage2D(GL_TEXTURE_2D, this.level, GL_RGBA, this.width, this.height,
            0, GL_RGBA, GL_UNSIGNED_BYTE, this);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    };
    image.src = planet_texture_file;
    //Stars positions
    generate_randomStars()
    //Camera
    camera = new Camera();
    camera.setScale(0.75);
    camera.lookAt(0,1,5);
    camera.installTrackball(draw);
    //First update() call
    update();
}