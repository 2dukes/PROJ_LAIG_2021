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
        this.setUpdatePeriod(100);

        this.loadingProgressObject=new MyRectangle(this, -1, -0.1, 1, 0.1);
        
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);

        // ------------------ test desplay ------------------
        this.rectangle = new MyRectangle(this, 1, 2, 3, 4);
        this.sphere = new MySphere(this, 1, 10, 10);
        this.cylinder = new MyCylinder(this, 1, 2, 3, 10, 10);
        this.triangle = new MyTriangle(this, 1, 0, 0, 1);
        this.circle = new MyCircle(this, 50, 2);
        this.torus = new MyTorus(this, 1, 0.3, 50, 50);
        // --------------------------------------------------

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.1, 0.5, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
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

                i++;
            }
        }
    }

    updateCamera() {
        // console.log(this.selectedCamera);
        // console.log(this.graph.cameras);

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

        // console.log(this.graph.cameras);
        // console.log(len);

        this.selectedCamera = 0;
        this.cameraIds = { };
        let index = 0, x;
        for (x in this.graph.cameras) {
            // console.log(x);
            if(x == this.graph.defaultCamera)
                this.selectedCamera = index;

            this.cameraIds[x] = index;
            index++;
        }
        
        // console.log(this.cameraIds);
        this.gui.add(this, 'selectedCamera', this.cameraIds).name('Camera').onChange(this.updateCamera.bind(this)); // Bind creates a new function that will force the this inside the function to be the parameter passed to bind().
        this.updateCamera();
         
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

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
 
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();
            
            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;


            // ------------------ test desplay ------------------
            //this.rectangle.display();
            //this.sphere.display();
            //this.cylinder.display();
            //this.triangle.display();
            //this.circle.display();
            //this.torus.display();
            // --------------------------------------------------
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}