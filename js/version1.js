var App = (function() {
    'use strict';

    var scene,
        renderer,
        light,
        controls,
        camera;

    var info_group;

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

        controls = new THREE.FirstPersonControls(camera);
        controls.constrainVertical = true;
        controls.movementSpeed = 60;
        controls.lookSpeed = 0.05;

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
        info_group = new THREE.Object3D();

		var geometry = new THREE.BoxGeometry( 20, 20, 20 );
		var material = new THREE.MeshLambertMaterial( { color: 'green' } );
		var material2 = new THREE.MeshLambertMaterial( { color: 'red' } );
		var cube = new THREE.Mesh( geometry, material );

		cube.position.y = 0;
		cube.position.z = -150;
		cube.name = "zalias kubas";

		info_group.add( cube );
		scene.add( info_group );



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
		var delta = clock.getDelta();
		// controls.update(delta);
		theta += 0.1;

		info_group.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
		info_group.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
		info_group.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
		// camera.lookAt( scene.position );

		info_group.updateMatrixWorld();

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
				target.position.x += 50;
				console.log(target);

			}
        }
        renderer.render( scene, camera );
        requestAnimationFrame( render );//call render() function itself

		
    };

    return {
        initScene: initScene
    }

})();