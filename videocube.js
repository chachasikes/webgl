

			var container, stats;

			var camera, scene, renderer;

			var cube, plane;

			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;

			var mouseX = 0;
			var mouseXOnMouseDown = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
      var video;

      var videoTexture;
      var material;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = 'Drag to spin the cube';
				container.appendChild( info );



				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.x = 150;
				camera.position.y = 150;
				camera.position.z = 400;
				scene.add( camera );

				// Cube

				var materials = [];



        video = document.createElement('video');
        video.width = 320;
        video.height    = 240;
        video.autoplay  = true;
        video.src = "http://erunways.com/html5/WebM_VP8_video/html5_Video_VP8.webm";
        videoTexture = new THREE.Texture( video );
        
        videoTexture.minFilter = THREE.LinearFilter;
			   videoTexture.magFilter = THREE.LinearFilter;
				videoTexture.format = THREE.RGBFormat;
        
        material    = new THREE.MeshLambertMaterial({
          map : videoTexture, 
         color: 0xffffff
        });
        if( video.readyState === video.HAVE_ENOUGH_DATA ){
            videoTexture.needsUpdate = true;
        }
       // container.appendChild(video);

				for ( var i = 0; i < 6; i ++ ) {
					materials.push( material);   
				}

				cube = new THREE.Mesh( new THREE.CubeGeometry( 400, 200, 300, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );

				cube.position.y = 150;
				scene.add( cube );

				// Plane

				plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 200 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );
				plane.rotation.x = - 90 * ( Math.PI / 180 );
				scene.add( plane );

				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );

				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
			}

			//

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'mouseout', onDocumentMouseOut, false );

				mouseXOnMouseDown = event.clientX - windowHalfX;
				targetRotationOnMouseDown = targetRotation;
			}

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;

				targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
			}

			function onDocumentMouseUp( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
			}

			function onDocumentMouseOut( event ) {

				document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
				document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
				document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
					targetRotationOnMouseDown = targetRotation;

				}
			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

				}
			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				plane.rotation.z = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
				renderer.render( scene, camera );

        if( video.readyState === video.HAVE_ENOUGH_DATA ){
            if (videoTexture) videoTexture.needsUpdate = true;
        }

			}

