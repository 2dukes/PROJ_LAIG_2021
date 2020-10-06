const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) { // Result allocated in this.cameras
        var children = viewsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);
        
        let perspectiveIndexes = [];
        let orthogonalIndexes = [];

        let index = 0, vIndex = 0, lastIndex = 0;

        while(true) {
            vIndex = nodeNames.indexOf("perspective", lastIndex);
            if(vIndex != -1) {
                perspectiveIndexes[index] = vIndex;
                lastIndex = vIndex + 1;
            }
            else
                break;
            index++;
        } 

        index = 0;
        vIndex = 0;
        lastIndex = 0;

        while(true) {
            vIndex = nodeNames.indexOf("ortho", lastIndex);
            if(vIndex != -1) {
                orthogonalIndexes[index] = vIndex;
                lastIndex = vIndex + 1;
            }
            else
                break;
            index++;
        } 

        if(perspectiveIndexes.length == -1)
            return "No Perspective Cameras defined for scene.";
        if(orthogonalIndexes.length == -1)
            return "No Orthogonal Cameras defined for scene.";

        this.cameras = [];

        // Perspective cameras

        for (index = 0; index < perspectiveIndexes.length; index++) {
            let camera = children[perspectiveIndexes[index]];
            
            let id = this.reader.getString(camera, 'id');
            let near = this.reader.getFloat(camera, 'near');
            let far = this.reader.getFloat(camera, 'far');
            let angle = this.reader.getFloat(camera, 'angle');

            if (id == null || near == null || far == null || angle == null)
                return "No id | near | far | angle defined in <perspective> tag!";
            
            // Ainda é preciso trabalhar no "position" e no "target".
            
            let props = camera.children;
            nodeNames = [];
            for (var i = 0; i < props.length; i++) 
                nodeNames.push(props[i].nodeName);
            
            // From - <perspective>    
            let fromIndex = nodeNames.indexOf("from");
            let x_from = 30, y_from = 15, z_from = 30;

            if(fromIndex == -1)
                this.onXMLMinorError("no <from> tag defined for scene; assuming 'x = 30, y = 15, z = 30'");
            else {
                x_from = this.reader.getFloat(props[fromIndex], 'x');
                y_from = this.reader.getFloat(props[fromIndex], 'y');
                z_from = this.reader.getFloat(props[fromIndex], 'z');

                if(x_from == null || y_from == null || z_from == null)
                    return 'No x | y | z coordinate found on <from> tag!';
            }

            // To - <perspective>

            let toIndex = nodeNames.indexOf("to");
            let x_to = 0, y_to = -2, z_to = 0;

            if(toIndex == -1)
                this.onXMLMinorError("no <to> tag defined for scene; assuming 'x = 0, y = -2, z = 0'");
            else {
                x_to = this.reader.getFloat(props[toIndex], 'x');
                y_to = this.reader.getFloat(props[toIndex], 'y');
                z_to = this.reader.getFloat(props[toIndex], 'z');

                if(x_to == null || y_to == null || z_to == null)
                    return 'No x | y | z coordinate found on <to> tag!';
            }
            
            this.cameras[id] = new CGFcamera(angle, near, far, vec3.fromValues(x_from, y_from, z_from), vec3.fromValues(x_to, y_to, z_to));
        }

        // Orthogonal cameras

        for (index = 0; index < orthogonalIndexes.length; index++) {
            let camera = children[orthogonalIndexes[index]];
            
            let id = this.reader.getString(camera, 'id');
            let near = this.reader.getFloat(camera, 'near');
            let far = this.reader.getFloat(camera, 'far');
            let left = this.reader.getFloat(camera, 'left');
            let right = this.reader.getFloat(camera, 'right');
            let top = this.reader.getFloat(camera, 'top');
            let bottom = this.reader.getFloat(camera, 'bottom');

            if (id == null || near == null || far == null || left == null || right == null || top == null || bottom == null)
                return "No id | near | far | left | right | top | bottom defined in <perspective> tag!";
                        
            let props = camera.children;
            nodeNames = [];
            for (var i = 0; i < props.length; i++)
                nodeNames.push(props[i].nodeName);
            
            // From - <ortho>    

            let fromIndex = nodeNames.indexOf("from");
            let x_from = 5, y_from = 0, z_from = 10;

            if(fromIndex == -1)
                this.onXMLMinorError("no <from> tag defined for scene; assuming 'x = 5, y = 0, z = 10'");
            else {
                x_from = this.reader.getFloat(props[fromIndex], 'x');
                y_from = this.reader.getFloat(props[fromIndex], 'y');
                z_from = this.reader.getFloat(props[fromIndex], 'z');

                if(x_from == null || y_from == null || z_from == null)
                    return 'No x | y | z coordinate found on <from> tag!';
            }

            // To - <ortho>

            let toIndex = nodeNames.indexOf("to");
            let x_to = 5, y_to = 0, z_to = 0;

            if(toIndex == -1)
                this.onXMLMinorError("no <to> tag defined for scene; assuming 'x = 5, y = 0, z = 0'");
            else {
                x_to = this.reader.getFloat(props[toIndex], 'x');
                y_to = this.reader.getFloat(props[toIndex], 'y');
                z_to = this.reader.getFloat(props[toIndex], 'z');

                if(x_to == null || y_to == null || z_to == null)
                    return 'No x | y | z coordinate found on <to> tag!';
            }
            
            // Up - <ortho>

            let upIndex = nodeNames.indexOf("up");
            let x_up = 0, y_up = 1, z_up = 0;

            if(upIndex == -1)
                this.onXMLMinorError("no <up> tag defined for scene; assuming 'x = 0, y = 1, z = 0'");
            else {
                x_to = this.reader.getFloat(props[upIndex], 'x');
                y_to = this.reader.getFloat(props[upIndex], 'y');
                z_to = this.reader.getFloat(props[upIndex], 'z');

                if(x_to == null || y_to == null || z_to == null)
                    return 'No x | y | z coordinate found on <to> tag!';
            }
            
            this.cameras[id] = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(x_from, y_from, z_from), vec3.fromValues(x_to, y_to, z_to), vec3.fromValues(x_up, y_up, z_up));
        }
        // console.log(this.cameras);
        this.log("Parsed Views.");

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {
        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        if(ambientIndex == -1) {
            this.onXMLMinorError("<ambient> tag not set, assuming 'r = 1.0, g = 0.2, b = 0.2, a = 1.0'");
            this.ambient = [1.0, 0.2, 0.2, 1.0];
        }
        else {
            var color = this.parseColor(children[ambientIndex], "ambient");
            if (!Array.isArray(color))
                return color;
            else
                this.ambient = color;
        }

        if(backgroundIndex == -1) {
            this.onXMLMinorError("<background> tag not set, assuming 'r = 0.0, g = 0.0, b = 0.0, a = 1.0'");
            this.background = [0.0, 0.0, 0.0, 1.0];
        }
        else {
            color = this.parseColor(children[backgroundIndex], "background");
            if (!Array.isArray(color))
                return color;
            else 
                this.background = color;
        }
        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;

            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        var children = texturesNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        this.textures = [];

        for (let index = 0; index < nodeNames.length; index++) {
            let texture = children[index];
            
            let textureId = this.reader.getString(texture, 'id');
            let path = this.reader.getString(texture, 'path');
            if(textureId == null || path == null)
                return "No id | path defined in <texture> tag!";
            
            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";
            
            this.textures[textureId] = new CGFtexture(this.scene, path);
        }
        // console.log(this.textures);

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];
        
        var attributeNames = [];
        var attributeTypes = [];
        var colorArray = [];

        attributeNames.push(...["shininess", "ambient", "diffuse", "specular", "emissive"]);
        attributeTypes.push(...["float", "color", "color", "color", "color"]);
        colorArray = [{ }, { }, { }, { }]; // [ambientColor, diffuseColor, specularColor, emissiveColor]

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            // Continue here
            grandChildren = children[i].children;
            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            
            let sValue;

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "float") {
                        sValue = this.reader.getFloat(grandChildren[attributeIndex], 'value') || 0.5;
                        if (sValue == null)
                            this.onXMLMinorError("Undefined float in 'value' field. Assuming <shininess value='0.5' />");
                    }
                    else { // j - 1 is always > 0, because the first computed element is shininess.
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " texture for ID" + materialID);
                        if (typeof aux === 'string')
                            return aux;

                        colorArray[j - 1].red = aux[0];
                        colorArray[j - 1].green = aux[1];
                        colorArray[j - 1].blue = aux[2];
                        colorArray[j - 1].alpha = aux[3];
                    }
                }
                else
                    return "material " + attributeNames[i] + " undefined for ID = " + materialID;
            }

            this.materials[materialID] = new CGFappearance(this.scene);
            this.materials[materialID].setAmbient(colorArray[0].red, colorArray[0].green, colorArray[0].blue, colorArray[0].alpha); // Ambient RGB
            this.materials[materialID].setDiffuse(colorArray[1].red, colorArray[1].green, colorArray[1].blue, colorArray[1].alpha); // Diffuse RGB
            this.materials[materialID].setSpecular(colorArray[2].red, colorArray[2].green, colorArray[2].blue, colorArray[2].alpha); // Specular RGB
            this.materials[materialID].setEmission(colorArray[3].red, colorArray[3].green, colorArray[3].blue, colorArray[3].alpha); // Emissive RGB
            this.materials[materialID].setShininess(sValue); 
        }

        // console.log(this.materials);
        this.log("Parsed materials");
        return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            
            // Transformations
            // let transformations = []; // [ { transformation: "Scale", matrix: [1.0, 0.0, 0.5] }, ...]
            
            grandgrandChildren = grandChildren[transformationsIndex].children;
            let transMatrix = mat4.create(); // Creates a new Identity matrix.

            for (let k = 0; k < grandgrandChildren.length; k++) {
                if(grandgrandChildren[k].nodeName == "translation") {
                    var aux = this.parseCoordinates3D(grandgrandChildren[k], "Translation");
                    if(typeof aux === "string") {
                        this.onXMLMinorError(aux + "The transformation won't be considered.");
                        continue;
                    }
                    
                    mat4.translate(transMatrix, transMatrix, vec3.fromValues(aux[0], aux[1], aux[2]));
                    // transformations.push({ transformation: "translation", matrix: aux});
                } else if(grandgrandChildren[k].nodeName == "scale") {
                    var aux = this.parseScalingCoordinates(grandgrandChildren[k], "Scale");
                    if(typeof aux === "string") {
                        this.onXMLMinorError(aux + "The transformation won't be considered.");
                        continue;
                    }
                    
                    mat4.scale(transMatrix, transMatrix, vec3.fromValues(aux[0], aux[1], aux[2]));
                    // transformations.push({ transformation: "scale", matrix: aux});
                } else if(grandgrandChildren[k].nodeName == "rotation") {
                    let rotationAxis = this.reader.getString(grandgrandChildren[k], "axis");
                    let rotationAngle = this.reader.getFloat(grandgrandChildren[k], "angle");
                    if(rotationAxis == null || rotationAngle == null) {
                        this.onXMLMinorError("Undefined rotation axis | angle. The transformation won't be considered.");
                        continue;
                    }
                    
                    let axisVec = vec3.fromValues(rotationAxis == 'x', rotationAxis == 'y', rotationAxis == 'z'); 
                    mat4.rotate(transMatrix, transMatrix, DEGREE_TO_RAD * rotationAngle, axisVec);  
                    // transformations.push({ transformation: "rotation", matrix: [DEGREE_TO_RAD * rotationAngle, rotationAxis == "x", rotationAxis == "y", rotationAxis == "z"]}); // this.rotate(Math.PI / 2, 0, 0, 1);
                }                
            }
            console.log(transMatrix);
            // console.log(transformations);

            // Material - Name | NULL
            let materialID = this.reader.getString(grandChildren[materialIndex], 'id'); 
            if(materialID == null) 
                return "no ID defined for materialID";
            else if(this.materials[materialID] == null && materialID != "null")
                return "Material with ID: " + materialID + " not defined!";

            console.log(materialID);

            // Texture - Name | NULL | Clear
            let textureID = this.reader.getString(grandChildren[textureIndex], 'id');
            let afs = -1.0, aft = -1.0; // Negative values initialized for "clear" case => No texture => No amplification.
            if(textureID == null)
                return "no ID defined for textureID";
            else if(this.textures[textureID] == null && !(textureID == "null" || textureID == "clear"))
                return "Texture with ID: " + textureID + " not defined!";
            else if(textureID != "clear") {
                grandgrandChildren = grandChildren[textureIndex].children;
                if(grandgrandChildren.length > 1) 
                    this.onXMLMinorError('Found more than one tag inside <texture>');
                
                let amplificationIndex = 0;
                afs = this.reader.getFloat(grandgrandChildren[amplificationIndex], "afs") || 1.0;
                aft = this.reader.getFloat(grandgrandChildren[amplificationIndex], "aft") || 1.0;

                if(afs == null || aft == null)
                    this.onXMLMinorError("No afs | aft defined. Assuming afs = 1.0, aft = 1.0");
                
            } 
            
            console.log(textureID, "afs=" + afs, "aft=" + aft);

            // Descendants
            let descendants = [];
            grandgrandChildren = grandChildren[descendantsIndex].children; 
            for (let j = 0; j < grandgrandChildren.length; j++) {
                let nodeName = grandgrandChildren[j].nodeName;
                if(nodeName == "leaf") { // <leaf>
                    continue; // TEMPORARY - ONLY BECAUSE SOME PRIMITIVES AREN'T COMPLETE

                    let type = this.reader.getString(grandgrandChildren[j], 'type');
                    let leaf;

                    if(type == "rectangle") {
                        let x1 = this.reader.getFloat(grandgrandChildren[j], 'x1');
                        let y1 = this.reader.getFloat(grandgrandChildren[j], 'y1');
                        let x2 = this.reader.getFloat(grandgrandChildren[j], 'x2');
                        let y2 = this.reader.getFloat(grandgrandChildren[j], 'y2');

                        leaf = new MyRectangle(this.scene, x1, y1, x2, y2);
                    }
                    else if(type == "triangle") {
                        let x1 = this.reader.getFloat(grandgrandChildren[j], 'x1');
                        let y1 = this.reader.getFloat(grandgrandChildren[j], 'y1');
                        let x2 = this.reader.getFloat(grandgrandChildren[j], 'x2');
                        let y2 = this.reader.getFloat(grandgrandChildren[j], 'y2');

                        leaf = new MyTriangle(this.scene, x1, x2, y1, y2);
                    }
                    else if(type == "cylinder") {
                        let height = this.reader.getFloat(grandgrandChildren[j], 'height');
                        let topRadius = this.reader.getFloat(grandgrandChildren[j], 'topRadius');
                        let bottomRadius = this.reader.getFloat(grandgrandChildren[j], 'bottomRadius');
                        let stacks = this.reader.getFloat(grandgrandChildren[j], 'stacks');
                        let slices = this.reader.getFloat(grandgrandChildren[j], 'slices');

                        leaf = new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks);
                    }
                    else if(type == "sphere") {
                        let radius = this.reader.getFloat(grandgrandChildren[j], 'radius');
                        let slices = this.reader.getFloat(grandgrandChildren[j], 'slices');
                        let stacks = this.reader.getFloat(grandgrandChildren[j], 'stacks');

                        leaf = new MyCylinder(this.scene, radius, slices, stacks);
                    }
                    else if(type == 'torus') {
                        let inner = this.reader.getFloat(grandgrandChildren[j], 'inner');
                        let outer = this.reader.getFloat(grandgrandChildren[j], 'outer');
                        let slices = this.reader.getFloat(grandgrandChildren[j], 'slices');
                        let loops = this.reader.getFloat(grandgrandChildren[j], 'loops');

                        leaf = new MyTorus(this.scene, outer, inner, slices, loops); 
                    }
                    descendants.push(leaf);
                } else {
                    let noderefID = this.reader.getString(grandgrandChildren[j], 'id'); // <noderef>
                    descendants.push(noderefID);
                }

                // if(this.nodes[noderefID] == null)
                //     return "Node with ID: " + noderefID + " not defined!"; 
            }

            // Commented lines can be only done at the end of the parsing of the XML file.
            console.log(descendants);
            this.nodes[nodeID] = new MyNode(materialID, { textureID: textureID, afs: afs, aft: aft }, transMatrix, descendants);
        }

        // Check for Undefined nodes
        this.nodes.forEach(node => {
            node.descendants.forEach(descendant => {
                if(this.nodes[descendant] == null && typeof descendant == "string") // Only compares noderef nodes
                    return "Caught unreferenced node " + descendant;
            });
        });
        
        return null;
    }

    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 1;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseScalingCoordinates(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'sx');
        if (!(x != null && !isNaN(x)))
            return "unable to parse sx-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'sy');
        if (!(y != null && !isNaN(y)))
            return "unable to parse sy-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'sz');
        if (!(z != null && !isNaN(z)))
            return "unable to parse sz-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);
        
        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() { // Recursive - Initial call, descendants...
        
        //To do: Create display loop for transversing the scene graph, calling the root node's display function
        
        //this.nodes[this.idRoot].display()
    }
}