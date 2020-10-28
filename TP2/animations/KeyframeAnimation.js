class KeyFrameAnimation extends Animation {
    constructor(scene, keyFrameList, animationID) { // Array de keyframes (instant, transformations) -> Transformations
        super(scene, animationID);
        this.keyFrames = keyFrameList;
        this.currentKeyFrame = 0;
    }
    

    update(timeIncrement) { // Comes in seconds
        // Update currentState -> Called on every update() of the Scene.

        if(!this.animationEnded) {
            super.update(timeIncrement);

            if(!animationStarted)
                return;

            /*
            t = 10.1
            Keyframe 0 -> Instante 2  
            KeyFrame 1 -> Instante 10
            Length = 2
            */
            if(this.keyFrames[this.currentKeyFrame].instant <= this.currentTime) {
                this.currentKeyFrame++;
                animationStarted = true;
            }

            if(this.currentKeyFrame == this.keyFrames.length) { // 
                this.currentKeyFrame--; // 
                this.animationEnded = true;
            }

            let currentTransformation = this.keyFrames[this.currentKeyFrame];

            let formerTransformation;

            if (this.currentKeyFrame == 0)
                formerTransformation = new Transformation(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
            else 
                formerTransformation = this.keyFrames[this.currentKeyFrame - 1];

            let cpuDiff = (this.timeElapsed - formerTransformation.endInstant);
            let keyFrameDiff = (currentTransformation.endInstant - formerTransformation.endInstant);

            let percentageTime;
            if(cpuDiff - keyFrameDiff > 0)
                percentageTime = 1.0;
            else
                percentageTime =  cpuDiff / keyFrameDiff;

            // Make Interpolation
            // lerp   

        }
        
    }

    apply() {
        // multMatrix matrix -> Called on every display(). 
    }
}