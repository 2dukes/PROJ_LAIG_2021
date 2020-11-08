class KeyFrameAnimation extends Animation {
    constructor(scene, keyFrameList, animationID) { // Array de keyframes (instant, KeyFrames) -> KeyFrames
        super(scene, animationID);
        this.keyFrames = keyFrameList;
        this.currentKeyFrame = 0;
    }
    

    update(timeIncrement) { // Comes in seconds
        // Update currentState -> Called on every update() of the Scene.

        if(!this.animationEnded) {
            super.update(timeIncrement);

            /*
            t = 10.1
            Keyframe 0 -> Instante 2  
            KeyFrame 1 -> Instante 10
            Length = 2
            */

            if(this.keyFrames[this.currentKeyFrame].instant <= this.elapsedTime) {
                this.currentKeyFrame++;
                this.animationStarted = true;
            }

            if(!this.animationStarted)
                return;
            
            if(this.currentKeyFrame == this.keyFrames.length) {
                this.currentKeyFrame--; // Para o caso final
                this.animationEnded = true;
            }

            let currentKeyFrame = this.keyFrames[this.currentKeyFrame];

            let formerKeyFrame;

            if (this.currentKeyFrame == 0)
                formerKeyFrame = new Transformation(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
            else 
                formerKeyFrame = this.keyFrames[this.currentKeyFrame - 1];

            let cpuDiff = (this.elapsedTime - formerKeyFrame.instant);
            let keyFrameDiff = (currentKeyFrame.instant - formerKeyFrame.instant);

            let percentageTime;
            if(cpuDiff - keyFrameDiff > 0)
                percentageTime = 1.0;
            else
                percentageTime =  cpuDiff / keyFrameDiff;

            let auxMatrix = mat4.create();
            
            // lerp(out, a, b, t) 
            // out -> receiving vector - vec3
            // a -> vec3 initial
            // b -> vec3 final
            // t -> interpolation amount, in the range [0-1], between the two inputs 
            
            // Translation - Interpolation
            let translation = vec3.create(); // vec3

            vec3.lerp(
                translation,
                vec3.fromValues(formerKeyFrame.translation[0], formerKeyFrame.translation[1], formerKeyFrame.translation[2]),
                vec3.fromValues(currentKeyFrame.translation[0], currentKeyFrame.translation[1], currentKeyFrame.translation[2]),
                percentageTime
            );

            mat4.translate(auxMatrix, auxMatrix, translation);


            // Rotation - Interpolation
            let rotation = vec3.create(); // vec3
            vec3.lerp(
                rotation,
                vec3.fromValues(formerKeyFrame.rotation[0], formerKeyFrame.rotation[1], formerKeyFrame.rotation[2]),
                vec3.fromValues(currentKeyFrame.rotation[0], currentKeyFrame.rotation[1],currentKeyFrame.rotation[2]),
                percentageTime
            );

            mat4.rotateX(auxMatrix, auxMatrix, DEGREE_TO_RAD * rotation[0]);
            mat4.rotateY(auxMatrix, auxMatrix, DEGREE_TO_RAD * rotation[1]);
            mat4.rotateZ(auxMatrix, auxMatrix, DEGREE_TO_RAD * rotation[2]);

            // Scaling - Interpolation
            let scaling = vec3.create(); // vec3
            vec3.lerp(
                scaling,
                vec3.fromValues(formerKeyFrame.scaling[0], formerKeyFrame.scaling[1], formerKeyFrame.scaling[2]),
                vec3.fromValues(currentKeyFrame.scaling[0], currentKeyFrame.scaling[1], currentKeyFrame.scaling[2]),
                percentageTime
            );
            
            mat4.scale(auxMatrix, auxMatrix, scaling);
            
            this.currentState = auxMatrix;
        }   
    }

    apply() {
        // multMatrix matrix -> Called on every display().  
        this.scene.multMatrix(this.currentState);
    }
}