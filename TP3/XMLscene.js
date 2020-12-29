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

		this.selectedCamera = 0;
		this.selectedTheme = "Christmas Room";

		this.timeout = 10;

		this.initCameras();

		this.enableTextures(true);

		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.axis = new CGFaxis(this);

		this.lastTime = new Date().getTime();

		this.defaultAppearance = new CGFappearance(this);

		this.gameOrchestrator = new MyGameOrchestrator(this);
		this.playerCameras = {
			1: 'firstPlayerView',
			2: 'secondPlayerView'
		};

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

		for (var key in this.graph[this.selectedTheme].lights) {
			if (i >= 8) break; // Only eight lights allowed by WebCGF on default shaders.

			if (this.graph[this.selectedTheme].lights.hasOwnProperty(key)) {
				var graphLight = this.graph[this.selectedTheme].lights[key];

				this.lights[i].setPosition(...graphLight[1]);
				this.lights[i].setAmbient(...graphLight[2]);
				this.lights[i].setDiffuse(...graphLight[3]);
				this.lights[i].setSpecular(...graphLight[4]);

				if(key == "Christmas Tree Light")
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

	updateCameraGUI() {
		let index = 0, x;
		for (x in this.graph[this.selectedTheme].cameras) {
			if (index == this.selectedCamera) {
				this.performCameraAnimation(x, 2);
				break;
			} else index++;
		}
	}

	performCameraAnimation(x, timeForAnimation) {
		this.newCamera = this.graph[this.selectedTheme].cameras[x];
		this.animationCamera = new CameraAnimation(this, "cameraAnimation", this.camera, this.newCamera, timeForAnimation);
		this.camera = this.newCamera;
		this.animationCamera.apply();
	}

	/** Handler called when the graph is finally loaded.
	 * As loading is asynchronous, this may be called already after the application has started the run loop
	 */
	onGraphLoaded() {

		if(this.gui) {
			this.gui.destroy();
			this.gui = new dat.GUI();
		}

		// Gui SetUp -> Cameras	
		
		this.cameraIds = {};
		let index = 0, x;
		let setCamera = false;
		for (x in this.graph[this.selectedTheme].cameras) {
			if (x == this.graph[this.selectedTheme].defaultCamera) {
				setCamera = true;
				this.selectedCamera = index;
			}
			this.cameraIds[x] = index;
			index++;
		}
		
		this.gui
			.add(this, "selectedCamera", this.cameraIds)
			.name("Camera")
			.onChange(this.updateCameraGUI.bind(this)); // Bind creates a new function that will force the this inside the function to be the parameter passed to bind().


		this.gui
			.add(this, "selectedTheme", ["Christmas Room", "Bedroom"])
			.name("Theme")
			.onChange(this.changeScene.bind(this));

		this.gui
			.add(this, "timeout", 5, 120)
			.name("Timeout");

		this.axis = new CGFaxis(this, this.graph[this.selectedTheme].referenceLength);

		this.gl.clearColor(...this.graph[this.selectedTheme].background);

		this.setGlobalAmbientLight(...this.graph[this.selectedTheme].ambient);

		// Gui SetUp -> Lights - Done in initLights().
		this.initLights();

		this.sceneInited = true;


		this.setUpdatePeriod(1000 / 60);
	}

	changeScene() {
		console.log(`Selected theme: ${this.selectedTheme}`);
		this.onGraphLoaded();
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

		for (let spriteSheetAnim of this.spriteSheetAnim) 
			spriteSheetAnim.update(timeInSeconds);
		
		if (this.animationCamera != null) 
			this.animationCamera.update(timeInSeconds);
			
		if (this.menu.choseAll) {
			this.gameOrchestrator.timeout = this.timeout;
			this.gameOrchestrator.update(timeInSeconds);
		}
			
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

			// this.axis.display();
			this.defaultAppearance.apply();

			// Displays the scene and game
			this.gameOrchestrator.display();
			this.graph[this.selectedTheme].displayScene();
		} else {

			// Show Menu
			this.menu.display();
		}

		this.popMatrix();
		// ---- END Background, camera and axis setup
	}
}
