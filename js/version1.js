var App = (function() {
    'use strict';
                    var a = 0;

    var scene,
        renderer,
        light,
        controls,
        camera,
        tween;

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
        atom2_brake_material;

    var radius = 100, theta = 0;

    var raycaster = new THREE.Raycaster(),
		projector = new THREE.Projector(),
		directionVector = new THREE.Vector3();
	
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

        var box_geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
        var material_for_box = new THREE.MeshLambertMaterial( { color: 'white' } );
        var box = new THREE.Mesh( box_geometry, material_for_box );
        box.name = 'box';
        scene.add( box );

        // create the geometry sphere
        stars_geometry  = new THREE.SphereGeometry(300, 120, 120);
        // create the material, using a texture of startfield
        stars_material  = new THREE.MeshBasicMaterial();
        stars_material.map   = THREE.ImageUtils.loadTexture('assets/stars.png');
        stars_material.side  = THREE.BackSide;
        // create the mesh based on geometry and material
        stars_mesh = new THREE.Mesh(stars_geometry, stars_material);
        stars_mesh.name = 'stars';
        scene.add(stars_mesh);

		// var geometry = new THREE.BoxGeometry( 20, 20, 20 );
		// var material = new THREE.MeshLambertMaterial( { color: 'green' } );
		// var material2 = new THREE.MeshLambertMaterial( { color: 'red' } );
		// var cube = new THREE.Mesh( geometry, material );

		// cube.position.y = 0;
		// cube.position.z = -150;
		// cube.name = "zalias kubas";

		// info_group.add( cube );
		// scene.add( info_group );
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
                                        scene.add(dna_group);
                                    });
                                });
                            });
                        });
                    });
                });
            });

        });

        //=============
        // TWEEN
        // ============
        tween = new TWEEN.Tween( { a: 0, b: 0, c: 0 } )
        .to( {a: 200, b: 200, c:200}, 2000 )
        .easing( TWEEN.Easing.Back.Out )
        .onUpdate( function() {
            var deze = scene.getObjectByName( "box" );
            deze.scale.set( this.a,this.b,this.c );
        } );

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

    var render = function() {
        // dna_group.rotation.y += 0.005;
        dna_group.rotation.x += 0.005;
        stars_mesh.rotation.y += 0.0005;
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
                if(target.name == 'stars') {
                    console.log('stars');
                }else{
                    // target.position.x += 50;
                    // var b = scene.getObjectByName( "box" );
                    // a += 2;
                    // b.scale.set(a,a,a);
                    // console.log(a);
                    tween.start();
                }
			}
        }
        renderer.render( scene, camera );
        requestAnimationFrame( render );//call render() function itself

		TWEEN.update();
    };

    return {
        initScene: initScene
    }

})();