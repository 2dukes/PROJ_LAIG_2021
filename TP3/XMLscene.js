/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
	/**
	 * @constructor
	 * @param {MyInterface} myinterface
	 */
	constructor(myinterface) {
		super();

		this.interface = myinterface;
	}

	/**
	 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
	 * @param {CGFApplication} application
	 */
	init(application) {
		super.init(application);

		this.sceneInited = false;

		this.initCameras();

		this.enableTextures(true);

		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this);

		this.lastTime = new Date().getTime();

		this.loadingProgressObject = new MyRectangle(this, -1, -0.1, 1, 0.1);

		this.loadingProgress = 0;

		this.defaultAppearance = new CGFappearance(this);

		this.gameOrchestrator = new MyGameOrchestrator(this);

		this.menuOptionSelected = false;
		this.menu = new MyMenu(this);
		this.animationCamera = null;

		// enable picking
		this.setPickEnabled(true);
	}

	/**
	 * Initializes the scene cameras.
	 */
	initCameras() {
		this.camera = new CGFcamera(
			2.0,
			0.1,
			100,
			vec3.fromValues(1.5, 1, 1.5),
			vec3.fromValues(1.5, 1, -1.5)
		);

		this.interface.setActiveCamera(this.camera);
		this.newCamera = this.camera;
	}
	/**
	 * Initializes the scene lights with the values read from the XML file.
	 */
	initLights() {
		var i = 0;
		// Lights index.

		// Reads the lights from the scene graph.

		let lights = this.gui.addFolder("Lights");
		lights.open();

		for (var key in this.graph.lights) {
			if (i >= 8) break; // Only eight lights allowed by WebCGF on default shaders.

			if (this.graph.lights.hasOwnProperty(key)) {
				var graphLight = this.graph.lights[key];

				this.lights[i].setPosition(...graphLight[1]);
				this.lights[i].setAmbient(...graphLight[2]);
				this.lights[i].setDiffuse(...graphLight[3]);
				this.lights[i].setSpecular(...graphLight[4]);

				this.lights[i].setVisible(true);

				if (graphLight[0]) this.lights[i].enable();
				else this.lights[i].disable();

				this.lights[i].update();

				lights.add(this.lights[i], "enabled").name(key);
				i++;
				this.numLights = i; // Used in display function.
			}
		}
	}

	updateCamera() {
		let index = 0, x;
		for (x in this.graph.cameras) {
			if (index == this.selectedCamera) {
				this.newCamera = this.graph.cameras[x];
				this.animationCamera = new CameraAnimation(this, "cameraAnimation", this.camera, this.newCamera, 2);
				this.camera = this.newCamera;
				this.animationCamera.apply();
				break;
			} else index++;
		}
	}
	/** Handler called when the graph is finally loaded.
	 * As loading is asynchronous, this may be called already after the application has started the run loop
	 */
	onGraphLoaded() {
		this.axis = new CGFaxis(this, this.graph.referenceLength);

		this.gl.clearColor(...this.graph.background);

		this.setGlobalAmbientLight(...this.graph.ambient);

		this.initLights();

		this.sceneInited = true;

		// Gui SetUp -> Cameras
		

		this.selectedCamera = 0;
		this.cameraIds = {};
		let index = 0, x;
		let setCamera = false;
		for (x in this.graph.cameras) {
			if (x == this.graph.defaultCamera) {
				setCamera = true;
				this.selectedCamera = index;
			}
			this.cameraIds[x] = index;
			index++;
		}

	
		this.gui
			.add(this, "selectedCamera", this.cameraIds)
			.name("Camera")
			.onChange(this.updateCamera.bind(this)); // Bind creates a new function that will force the this inside the function to be the parameter passed to bind().


		// Gui SetUp -> Lights - Done in initLights().

		this.setUpdatePeriod(1000 / 60);
	}

	/**
	 * Update function for each Period of Time
	 */
	update(currentTime) {
		let timeInterval = currentTime - this.lastTime;
		this.lastTime = currentTime;

		let timeInSeconds = timeInterval / 1000;

		for (let keyframeAnimation of this.animations) 
			keyframeAnimation.update(timeInSeconds);

		// console.log(this.spriteSheetAnim);
		for (let spriteSheetAnim of this.spriteSheetAnim) 
			spriteSheetAnim.update(timeInSeconds);
		
		if (this.animationCamera != null) 
			this.animationCamera.update(timeInSeconds);
			

		this.gameOrchestrator.update(timeInSeconds);
	}

	/**
	 * Displays the scene.
	 */
	display() {
		// ---- BEGIN Background, camera and axis setup

		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Initialize Model-View matrix as identity (no transformation
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		this.pushMatrix();

		for (var i = 0; i < this.numLights; i++) {
			this.lights[i].update();
		}

		if (this.animationCamera != null) {
			this.animationCamera.apply();
		}


		if (this.sceneInited && this.menu.choseAll) {
			// Draw axis

			this.gameOrchestrator.display();

			this.axis.display();

			this.defaultAppearance.apply();

			// Displays the scene (MySceneGraph function).
			this.graph.displayScene();
		} else {
			// Show Menu

			this.menu.display();
			// this.defaultAppearance.apply();

			// this.rotate(-this.loadingProgress / 10.0, 0, 0, 1);

			// this.loadingProgressObject.display();
			// this.loadingProgress++;
		}

		this.popMatrix();
		// ---- END Background, camera and axis setup
	}
}
