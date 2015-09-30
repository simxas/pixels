var App = (function() {
    'use strict';
                    var a = 0;

    var scene,
        renderer,
        light,
        controls,
        camera,
        tween_id_out,
        tween_id_in,
        tween_summary_out,
        tween_summary_in,
        tween_skills_in,
        tween_skills_out;

    var dna_group,
        stars_geometry,
        stars_mesh,
        stars_material,
        balls1_mesh,
        balls1_brake_mesh,
        balls2_mesh,
        balls2_brake_mesh,
        atom1_mesh,
        atom1_brake_mesh,
        atom2_mesh,
        atom2_brake_mesh,
        //materials
        balls1_material,
        balls1_brake_material,
        balls2_material,
        balls2_brake_material,
        atom1_material,
        atom1_brake_material,
        atom2_material,
        atom2_brake_material,
        //sticks and info
        id_stick_material,
        id_stick_mesh,
        summary_stick_material,
        summary_stick_mesh,
        skills_stick_material,
        skills_stick_mesh,
        //images
        id_bump,
        id_smap,
        summary_bump,
        summary_smap,
        skills_bump,
        skills_smap,
        id_texture,
        id_texture_material,
        id_texture_mesh,
        summary_texture,
        summary_texture_material,
        summary_texture_mesh,
        skills_texture,
        skills_texture_material,
        skills_texture_mesh,
        //broken parts
        red_parts_broken,
        blue_parts_broken;

    var radius = 100, theta = 0;

    var stars_object;

    var raycaster = new THREE.Raycaster(),
		projector = new THREE.Projector(),
		directionVector = new THREE.Vector3(),
        INTERSECTED,
        mouse = { x: 0, y: 0 };
	
	var clock = new THREE.Clock();

	var clickInfo = {
		x: 0,
		y: 0,
		userHasClicked: false
	};

    var initScene = function() {
        scene = new THREE.Scene();
		window.addEventListener('click', function (evt) {
			// The user has clicked; let's note this event
			// and the click's coordinates so that we can
			// react to it in the render loop
			clickInfo.userHasClicked = true;
			clickInfo.x = evt.clientX;
			clickInfo.y = evt.clientY;
		}, false);
        window.addEventListener( 'mousemove', onDocumentMouseMove, false );
        function onDocumentMouseMove( event ) {
            // the following line would stop any other event handler from firing
            // (such as the mouse's TrackballControls)
            // event.preventDefault();

            // update the mouse variable
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }

        //=============
        // LIGHTS
        // ============
        scene.add( new THREE.AmbientLight( '#DDDDDD' ) );
        light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.x = -100;
        light.position.y = 150;
        scene.add(light);

        //=============
        // CAMERA
        // ============
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );

        camera.position.z = 200;
        camera.position.y = 0;
        camera.lookAt( { x:0,y:0,z:0 } );
        scene.add( camera );

        // controls = new THREE.FirstPersonControls(camera);
        // controls.constrainVertical = true;
        // controls.movementSpeed = 60;
        // controls.lookSpeed = 0.05;

        //=============
        // RENDERER
        // ============
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor( "#DDDDDD", 1 );
        document.body.appendChild( renderer.domElement );
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFar = camera.far;
        renderer.shadowCameraFov = 50;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;

        //=============
        // OBJECTS
        // ============
        dna_group = new THREE.Object3D();
        id_stick_mesh = new THREE.Mesh();
        summary_stick_mesh = new THREE.Mesh();
        skills_stick_mesh = new THREE.Mesh();
        red_parts_broken = new THREE.Mesh();
        blue_parts_broken = new THREE.Mesh();

        // create the geometry sphere
        stars_geometry  = new THREE.SphereGeometry(300, 120, 120);
        // create the material, using a texture of startfield
        stars_material  = new THREE.MeshBasicMaterial();
        stars_material.map   = THREE.ImageUtils.loadTexture('assets/stars.png');
        stars_material.side  = THREE.BackSide;
        // create the mesh based on geometry and material
        stars_mesh = new THREE.Mesh(stars_geometry, stars_material);
        stars_mesh.name = 'stars';

        stars_object = scene.getObjectByName( "stars" );
        scene.add(stars_mesh);

		// var geometry = new THREE.BoxGeometry( 250, 150, 20 );
		// var material = new THREE.MeshLambertMaterial( { color: 'green' } );
		// var material2 = new THREE.MeshLambertMaterial( { color: 'red' } );
		// var cube = new THREE.Mesh( geometry, material );
  //       cube.position.z = -350;
  //       cube.name = "id";
  //       scene.add(cube);

		// cube.position.y = 0;
		// cube.position.z = -150;
		// cube.name = "zalias id";

		// info_group.add( cube );
		// scene.add( info_group );
        /* Textures */
        THREE.crossOrigin = "";
        id_bump =  THREE.ImageUtils.loadTexture("assets/ID_bump.jpg", {}, function(){});
        id_smap =  THREE.ImageUtils.loadTexture("assets/ID_smap.jpg", {}, function(){});
        summary_bump =  THREE.ImageUtils.loadTexture("assets/summary_bump.jpg", {}, function(){});
        summary_smap =  THREE.ImageUtils.loadTexture("assets/summary_smap.jpg", {}, function(){});
        skills_bump =  THREE.ImageUtils.loadTexture("assets/skills_bump.jpg", {}, function(){});
        skills_smap =  THREE.ImageUtils.loadTexture("assets/skills_smap.jpg", {}, function(){});



        var loader = new THREE.JSONLoader();
        loader.load('assets/atom1.json', function(geometry) {
            // atom1_material = new THREE.MeshLambertMaterial( { color: '#FE2E2E' } );
            atom1_material = new THREE.MeshPhongMaterial( { 
                color: 'green', 
                specular: '#FE2E2E',
                shininess: 20
            } );
            atom1_mesh = new THREE.Mesh(geometry, atom1_material);

            loader.load('assets/atom2.json', function(geometry) {
                // atom2_material = new THREE.MeshLambertMaterial( { color: '#F4FA58' } );
                atom2_material = new THREE.MeshPhongMaterial( { 
                    color: '#FFBF00', 
                    specular: '#F4FA58',
                    shininess: 20
                } );
                atom2_mesh = new THREE.Mesh(geometry, atom2_material);

                loader.load('assets/balls1.json', function(geometry) {
                    // balls_material = new THREE.MeshLambertMaterial( { color: '#0080FF' } );
                    //BLUE
                    balls1_material = new THREE.MeshPhongMaterial( { 
                    color: '#08298A', 
                    specular: '#0431B4',
                    shininess: 70
                    } );
                    balls1_mesh = new THREE.Mesh(geometry, balls1_material);

                    loader.load('assets/balls2.json', function(geometry) {
                        // balls_material = new THREE.MeshLambertMaterial( { color: '#0080FF' } );
                        balls2_material = new THREE.MeshPhongMaterial( { 
                        color: '#8A0808', 
                        specular: '#FE2E2E',
                        shininess: 70
                        } );
                        balls2_mesh = new THREE.Mesh(geometry, balls2_material);

                        loader.load('assets/atom1_brake.json', function(geometry) {
                            atom1_brake_material = new THREE.MeshPhongMaterial( { 
                            color: 'green', 
                            specular: '#FE2E2E',
                            shininess: 20
                            } );
                            atom1_brake_mesh = new THREE.Mesh(geometry, atom1_brake_material);

                            loader.load('assets/atom2_brake.json', function(geometry) {
                                atom2_brake_material = new THREE.MeshPhongMaterial( { 
                                color: '#FFBF00', 
                                specular: '#F4FA58',
                                shininess: 20
                                } );
                                atom2_brake_mesh = new THREE.Mesh(geometry, atom2_brake_material);

                                loader.load('assets/balls1_brake.json', function(geometry) {
                                    balls1_brake_material = new THREE.MeshPhongMaterial( { 
                                    color: '#08298A', 
                                    specular: '#0431B4',
                                    shininess: 70
                                    } );
                                    balls1_brake_mesh = new THREE.Mesh(geometry, balls1_brake_material);

                                    //===============
                                    // BROKEN PARTS
                                    //===============
                                    loader.load('assets/red_parts_broken.json', function(geometry) {
                                            var material = new THREE.MeshLambertMaterial( { color: '#8A0808' } );
                                            red_parts_broken = new THREE.Mesh( geometry, material );
                                            red_parts_broken.scale.set(30, 30, 30);
                                            scene.add(red_parts_broken);

                                    });
                                    loader.load('assets/blue_parts_broken.json', function(geometry) {
                                        var material = new THREE.MeshLambertMaterial( { color: '#08298A' } );
                                        blue_parts_broken = new THREE.Mesh( geometry, material );
                                        blue_parts_broken.scale.set(30, 30, 30);
                                        scene.add(blue_parts_broken);

                                    });

                                    //IMAGES PART==============
                                    //ID_image
                                    loader.load('assets/ID_image.json', function(geometry) {
                                        // id_texture = THREE.ImageUtils.loadTexture( 'assets/ID.jpg' );
                                        // id_texture.anisotropy = renderer.getMaxAnisotropy();

                                        var oldMaterial = new THREE.MeshPhongMaterial({
                                          color      :  new THREE.Color("white"),
                                          emissive   :  new THREE.Color("rgb(7,3,5)"),
                                          specular   :  new THREE.Color("rgb(255,113,0)"),
                                          // shininess  :  20,
                                          bumpMap    :  id_bump,
                                          map        :  id_smap,
                                          bumpScale  :  0.45,
                                        });
                                        // var oldWall = new THREE.Mesh( new THREE.PlaneGeometry(4000,400,32,8), oldMaterial );

                                        // id_texture_material = new THREE.MeshBasicMaterial( { map: id_texture } );
                                        id_texture_mesh = new THREE.Mesh(geometry, oldMaterial);
                                        id_texture_mesh.scale.set(5, 5, 5);
                                        id_texture_mesh.position.z = -350;
                                        id_texture_mesh.name = 'id';
                                        scene.add(id_texture_mesh);

                                    });
                                    //summary_image
                                    loader.load('assets/summary_image.json', function(geometry) {
                                        // id_texture = THREE.ImageUtils.loadTexture( 'assets/ID.jpg' );
                                        // id_texture.anisotropy = renderer.getMaxAnisotropy();

                                        var oldMaterial = new THREE.MeshPhongMaterial({
                                          color      :  new THREE.Color("white"),
                                          emissive   :  new THREE.Color("rgb(7,3,5)"),
                                          specular   :  new THREE.Color("rgb(255,113,0)"),
                                          // shininess  :  20,
                                          bumpMap    :  summary_bump,
                                          map        :  summary_smap,
                                          bumpScale  :  0.45,
                                        });
                                        // var oldWall = new THREE.Mesh( new THREE.PlaneGeometry(4000,400,32,8), oldMaterial );

                                        // id_texture_material = new THREE.MeshBasicMaterial( { map: id_texture } );
                                        summary_texture_mesh = new THREE.Mesh(geometry, oldMaterial);
                                        summary_texture_mesh.scale.set(5, 5, 5);
                                        summary_texture_mesh.position.z = -350;
                                        summary_texture_mesh.name = 'summary';
                                        scene.add(summary_texture_mesh);

                                    });
                                    //skills_image
                                    loader.load('assets/skills_image.json', function(geometry) {
                                        // id_texture = THREE.ImageUtils.loadTexture( 'assets/ID.jpg' );
                                        // id_texture.anisotropy = renderer.getMaxAnisotropy();

                                        var oldMaterial = new THREE.MeshPhongMaterial({
                                          color      :  new THREE.Color("white"),
                                          emissive   :  new THREE.Color("rgb(7,3,5)"),
                                          specular   :  new THREE.Color("rgb(255,113,0)"),
                                          // shininess  :  20,
                                          bumpMap    :  skills_bump,
                                          map        :  skills_smap,
                                          bumpScale  :  0.45,
                                        });
                                        // var oldWall = new THREE.Mesh( new THREE.PlaneGeometry(4000,400,32,8), oldMaterial );

                                        // id_texture_material = new THREE.MeshBasicMaterial( { map: id_texture } );
                                        skills_texture_mesh = new THREE.Mesh(geometry, oldMaterial);
                                        skills_texture_mesh.scale.set(4, 4, 4);
                                        skills_texture_mesh.position.z = -350;
                                        skills_texture_mesh.name = 'skills';
                                        scene.add(skills_texture_mesh);

                                    });

                                    //STICKS PART==============
                                    //ID
                                    loader.load('assets/id_stick.json', function(geometry) {
                                        id_stick_material = new THREE.MeshPhongMaterial( { 
                                            color: 'white', 
                                            specular: '#FE2E2E',
                                            shininess: 70
                                        } );
                                        id_stick_mesh = new THREE.Mesh(geometry, id_stick_material);
                                        id_stick_mesh.scale.set(30, 30, 30);
                                        id_stick_mesh.name = 'id_stick';
                                        scene.add(id_stick_mesh);

                                    });
                                    //SUMMARY
                                    loader.load('assets/summary_stick.json', function(geometry) {
                                        summary_stick_material = new THREE.MeshPhongMaterial( { 
                                            color: 'white', 
                                            specular: '#FE2E2E',
                                            shininess: 70
                                        } );
                                        summary_stick_mesh = new THREE.Mesh(geometry, summary_stick_material);
                                        summary_stick_mesh.scale.set(30, 30, 30);
                                        summary_stick_mesh.name = 'summary_stick';
                                        scene.add(summary_stick_mesh);

                                    });
                                    //SKILLS
                                    loader.load('assets/skills_stick.json', function(geometry) {
                                        skills_stick_material = new THREE.MeshPhongMaterial( { 
                                            color: 'white', 
                                            specular: '#FE2E2E',
                                            shininess: 70
                                        } );
                                        skills_stick_mesh = new THREE.Mesh(geometry, skills_stick_material);
                                        skills_stick_mesh.scale.set(30, 30, 30);
                                        skills_stick_mesh.name = 'skills_stick';
                                        scene.add(skills_stick_mesh);

                                    });
                                    // ========================
                                    loader.load('assets/balls2_brake.json', function(geometry) {
                                        balls2_brake_material = new THREE.MeshPhongMaterial( { 
                                        color: '#8A0808', 
                                        specular: '#FE2E2E',
                                        shininess: 70
                                        } );
                                        balls2_brake_mesh = new THREE.Mesh(geometry, balls2_brake_material);

                                        atom1_mesh.scale.set(30, 30, 30);
                                        atom2_mesh.scale.set(30, 30, 30);
                                        atom1_brake_mesh.scale.set(30, 30, 30);
                                        atom2_brake_mesh.scale.set(30, 30, 30);
                                        balls1_mesh.scale.set(30, 30, 30);
                                        balls2_mesh.scale.set(30, 30, 30);
                                        balls1_brake_mesh.scale.set(30, 30, 30);
                                        balls2_brake_mesh.scale.set(30, 30, 30);

                                        atom1_mesh.castShadow = true;
                                        atom1_mesh.receiveShadow = false;
                                        atom1_brake_mesh.castShadow = true;
                                        atom1_brake_mesh.receiveShadow = false;
                                        atom2_mesh.castShadow = true;
                                        atom2_mesh.receiveShadow = false;
                                        atom2_brake_mesh.castShadow = true;
                                        atom2_brake_mesh.receiveShadow = false;
                                        balls1_mesh.castShadow = true;
                                        balls1_mesh.receiveShadow = false;
                                        balls1_brake_mesh.castShadow = true;
                                        balls1_brake_mesh.receiveShadow = false;
                                        balls2_mesh.castShadow = true;
                                        balls2_mesh.receiveShadow = false;
                                        balls2_brake_mesh.castShadow = true;
                                        balls2_brake_mesh.receiveShadow = false;

                                        dna_group.add(atom1_mesh, atom2_mesh, balls1_mesh, balls2_mesh, atom1_brake_mesh, atom2_brake_mesh, balls1_brake_mesh, balls2_brake_mesh);
                                        // dna_group.rotateY(0.5);
                                        // dna_group.rotateX(0.5);
                                        scene.add(dna_group);
                                    });
                                });
                            });
                        });
                    });
                });
            });

        });

        controls = new THREE.OrbitControls( camera, renderer.domElement );
        //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = false;


        //On Image upload
        $( "#userImage" ).change( function() {

        });



        // initiate
        light.castShadow = true;
        light.shadowDarkness = 0.1;
        render();
        window.addEventListener( 'resize', onWindowResize, false );
    };

    var onWindowResize = function() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    };


    var update = function() {
        // find intersections

        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        projector.unprojectVector( vector, camera );
        var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( scene.children );

        // INTERSECTED = the object in the scene currently closest to the camera 
        //      and intersected by the Ray projected from the mouse position    
        
        // if there is one (or more) intersections
        if ( intersects.length > 0 ) {
            // if the closest object intersected is not the currently stored intersection object
            if ( intersects[ 0 ].object != INTERSECTED ) {
                // restore previous intersection object (if it exists) to its original color
                if ( INTERSECTED ) {
                    INTERSECTED.material.color.setHex( INTERSECTED.currentHex ); 
                } 
                // store reference to closest object as current intersection object
                INTERSECTED = intersects[ 0 ].object;
                // store color of closest object (for later restoration)
                INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                // set a new color for closest object
                if(INTERSECTED.name == 'id_stick' || INTERSECTED.name == 'summary_stick' || INTERSECTED.name == 'skills_stick') {
                    INTERSECTED.material.color.setHex( 0xffff00 );

                }

            }
        } 
        else // there are no intersections
        {
            // restore previous intersection object (if it exists) to its original color
            if ( INTERSECTED ) 
                INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            // remove previous intersection object reference
            //     by setting current intersection object to "nothing"
            // if(INTERSECTED.objektas == "id_stick") {
                
            // }
            INTERSECTED = null;
        }
    }

    var render = function() {
        // dna_group.rotation.y += 0.005;
        // dna_group.rotation.x += 0.0005;
        // id_stick_mesh.rotation.x += 0.0005;
        // summary_stick_mesh.rotation.x += 0.0005;
        // skills_stick_mesh.rotation.x += 0.0005;
        stars_mesh.rotation.y += 0.0005;
        red_parts_broken.rotation.x += 0.0005;
        red_parts_broken.rotation.y += 0.00005;
        blue_parts_broken.rotation.x += -0.0005;
        blue_parts_broken.rotation.y += -0.00005;
        controls.update();

		// var delta = clock.getDelta();
		// // controls.update(delta);
		// theta += 0.1;

		// info_group.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
		// info_group.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
		// info_group.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
		// // camera.lookAt( scene.position );

		// info_group.updateMatrixWorld();

    	if (clickInfo.userHasClicked) {
            clickInfo.userHasClicked = false;
            var x = ( clickInfo.x / window.innerWidth ) * 2 - 1;
			var y = -( clickInfo.y / window.innerHeight ) * 2 + 1;

			// Now we set our direction vector to those initial values
            directionVector.set(x, y, 1);

			// Unproject the vector
			projector.unprojectVector(directionVector, camera);

			// Substract the vector representing the camera position
			directionVector.sub(camera.position);

			// Normalize the vector, to avoid large numbers from the
			// projection and substraction
			directionVector.normalize();

			// Now our direction vector holds the right numbers!
			raycaster.set(camera.position, directionVector);
			// Ask the raycaster for intersects with all objects in the scene:
			// (The second arguments means "recursive")
			var intersects = raycaster.intersectObjects(scene.children, true);

			if (intersects.length) {
				// intersections are, by default, ordered by distance,
				// so we only care for the first one. The intersection
				// object holds the intersection point, the face that's
				// been "hit" by the ray, and the object to which that
				// face belongs. We only care for the object itself.
				var target = intersects[0].object;
                if(target.name == 'id_stick') {
                    // tween_text_out.start();
                    // tween_id_cube_in.start();
                    tween_id_in = new TWEEN.Tween( { z: -350 } )
                    .to( {z: 50}, 2000 )
                    .easing( TWEEN.Easing.Quartic.Out)
                    .onUpdate( function() {
                        var id_cube = scene.getObjectByName( "id" );
                        id_cube.position.z = this.z;
                    } );
                    tween_id_in.start();
                    tween_id_in = null;
                }else if(target.name == 'summary_stick') {
                    tween_summary_in = new TWEEN.Tween( { z: -350 } )
                    .to( {z: 50}, 2000 )
                    .easing( TWEEN.Easing.Quartic.Out)
                    .onUpdate( function() {
                        var id_cube = scene.getObjectByName( "summary" );
                        id_cube.position.z = this.z;
                    } );
                    tween_summary_in.start();
                    tween_summary_in = null;

                }else if(target.name == 'summary') {
                    tween_summary_out = new TWEEN.Tween( { z: 50 } )
                    .to( {z: 350}, 2000 )
                    .easing( TWEEN.Easing.Quartic.Out )
                    .onUpdate( function() {
                        var id_cube = scene.getObjectByName( "summary" );
                        id_cube.position.z = this.z;
                    } );
                    tween_summary_out.start();
                    tween_summary_out = null;
                }else if(target.name == 'skills_stick') {
                    tween_skills_in = new TWEEN.Tween( { z: -350 } )
                    .to( {z: 50}, 2000 )
                    .easing( TWEEN.Easing.Quartic.Out)
                    .onUpdate( function() {
                        var id_cube = scene.getObjectByName( "skills" );
                        id_cube.position.z = this.z;
                    } );
                    tween_skills_in.start();
                    tween_skills_in = null;
                }else if(target.name == 'skills'){
                    tween_skills_out = new TWEEN.Tween( { z: 50 } )
                    .to( {z: 350}, 2000 )
                    .easing( TWEEN.Easing.Quartic.Out )
                    .onUpdate( function() {
                        var id_cube = scene.getObjectByName( "skills" );
                        id_cube.position.z = this.z;
                    } );
                    tween_skills_out.start();
                    tween_skills_out = null;
                }else if(target.name == 'id'){
                    // tween_id_cube_out.start();
                    tween_id_out = new TWEEN.Tween( { z: 50 } )
                    .to( {z: 350}, 2000 )
                    .easing( TWEEN.Easing.Quartic.Out )
                    .onUpdate( function() {
                        var id_cube = scene.getObjectByName( "id" );
                        id_cube.position.z = this.z;
                    } );
                    tween_id_out.start();
                    tween_id_out = null;
                }else{
                    // target.position.x += 50;
                    // var b = scene.getObjectByName( "box" );
                    // a += 2;
                    // b.scale.set(a,a,a);
                    // console.log(a);
                    // tween_text_out.start();
                }
			}
        }//end of click event
        renderer.render( scene, camera );
        requestAnimationFrame( render );//call render() function itself
        update();
		TWEEN.update();
    };

    return {
        initScene: initScene
    }

})();