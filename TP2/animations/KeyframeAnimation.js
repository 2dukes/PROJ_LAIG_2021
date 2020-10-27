class KeyFrameAnimation extends Animation {
    constructor(keyFrameList) { // Array de keyframes (instante, transformations) -> Transformations
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