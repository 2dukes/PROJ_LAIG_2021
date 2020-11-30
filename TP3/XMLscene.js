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

        this.loadingProgressObject=new MyRectangle(this, -1, -0.1, 1, 0.1);
        
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);

        // Testing purposes
        this.gameBoard = new MyGameBoard(this, 0.25);

        // enable picking
		this.setPickEnabled(true);

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.75, 0.75, 550, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.

        let lights = this.gui.addFolder('Lights');
        lights.open();

        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                lights.add(this.lights[i], 'enabled').name(key);
                i++;
                this.numLights = i; // Used in display function.

            }
        }
    }

    // JUST FOR TESTING:

    logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
						var customId = this.pickResults[i][1];
						console.log("Picked object: " + obj + ", with pick id " + customId);						
					}
				}
				this.pickResults.splice(0, this.pickResults.length);
			}
		}
	}

    updateCamera() {

        let index = 0, x;
        for(x in this.graph.cameras) {
            if(index == this.selectedCamera) {
                this.camera = this.graph.cameras[x];
                this.interface.setActiveCamera(this.camera);
                break;
            }
            else
                index++;
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
        this.cameraIds = { };
        let index = 0, x;
        let setCamera = false;
        for (x in this.graph.cameras) {
            if(x == this.graph.defaultCamera) {
                setCamera = true;
                this.selectedCamera = index;
            }

            this.cameraIds[x] = index;
            index++;
        }
        
        // console.log(this.cameraIds);
        if(setCamera) {
            this.gui.add(this, 'selectedCamera', this.cameraIds).name('Camera').onChange(this.updateCamera.bind(this)); // Bind creates a new function that will force the this inside the function to be the parameter passed to bind().
            this.updateCamera();
        }        

        // Gui SetUp -> Lights - Done in initLights().
        
        this.setUpdatePeriod(100);
    }

    /**
     * Update function for each Period of Time
     */
    update(currentTime) {

        let timeInterval = currentTime - this.lastTime;
        this.lastTime = currentTime;

        let timeInSeconds = timeInterval / 1000;
        
        for(let keyframeAnimation of this.animations) {
            keyframeAnimation.update(timeInSeconds);
        }

        // cosole.log(this.spriteSheetAnim);
        for(let spriteSheetAnim of this.spriteSheetAnim) {
            spriteSheetAnim.update(timeInSeconds);
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // PICKING TESTING
        this.logPicking();
		this.clearPickRegistration();


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
        
        // this.mPlane = new Plane(this, 5, 5);
        //this.patch = new MyPatch(this, 3, 2, 20, 20, [[-2,-2,0,1],[-2,2,0,1],[0,-2,2,1],[0,2,2,1],[2,-2,0,1],[2,2,0,1]]);
        //this.barrel = new Barrel(this, 0.25, 0.3, 1, 10, 10);

        if (this.sceneInited) {
            // Draw axis

            this.pushMatrix();

            this.translate(4.7,0.8,4.0);
            this.scale(0.5,1,0.5);
            this.rotate(-Math.PI / 2, 1, 0, 0);

            this.gameBoard.display();

            this.popMatrix();

            this.axis.display();
 
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
            
            //this.barrel.display();
            //this.patch.display();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();
            
            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
} 