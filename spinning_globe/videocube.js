var container, stats;
var camera, scene, renderer;
var surface, plane;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var video;

var videoTexture;
var material;
var imageContext;

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
	info.innerHTML = 'Drag to spin the video';
	container.appendChild( info );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 600;
	scene.add( camera );

	// Cube, which plays a video (open format video files only - not sure if vimeo will be possible)
	
	var materials = [];
  video = document.createElement('video');
  
  video.width = 637;
  video.height = 264;
  video.autoplay = true;
  video.src = "http://video-js.zencoder.com/oceans-clip.mp4";
  
  videoTexture = new THREE.Texture( video );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
	videoTexture.format = THREE.RGBFormat;  

  image = document.createElement( 'canvas' );
	image.width = 630;
	image.height = 264;
	
	imageContext = image.getContext( '2d' );
	imageContext.fillStyle = '#000000';
	imageContext.fillRect( 0, 0, 637, 264 );
	
	texture = new THREE.Texture( image );
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;

  var parameters = { color: 0xffffff, map: texture,  overdraw: true},
	material_base = new THREE.MeshBasicMaterial( parameters );
  material = new THREE.MeshBasicMaterial(parameters);

	for ( var i = 0; i < 6; i ++ ) {
		materials.push( material );   
	}

  // radius <Number>, segmentsWidth <Number>, segmentsHeight <Number>
	surface = new THREE.Mesh( new THREE.SphereGeometry( 300, 50, 50 ), material);
	scene.add( surface );

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );
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
}

function render() {
	surface.rotation.x += ( targetRotation - surface.rotation.x ) * 0.05;
	surface.rotation.y += ( targetRotation - surface.rotation.x ) * 0.05;

	renderer.render( scene, camera );

  if( video.readyState === video.HAVE_ENOUGH_DATA ){
      if (texture) texture.needsUpdate = true;
      imageContext.drawImage( video, 0, 0 );
  }
}


