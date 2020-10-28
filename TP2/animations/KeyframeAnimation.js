class KeyFrameAnimation extends Animation {
    constructor(scene, keyFrameList, animationID) { // Array de keyframes (instante, transformations) -> Transformations
        super(scene, animationID);
        this.keyFrames = keyFrameList;
        this.currentKeyFrame = 0;
    }
    

    update() { 
        // Update currentState -> Called on every update() of the Scene.
        
    }

    apply() {
        // Apply matrix -> Called on every display().
    }
}