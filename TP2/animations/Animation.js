class Animation {
    constructor(scene, animationID) {
        this.scene = scene;
        
        this.elapsedTime = 0;
        this.animationEnded = false;
        this.animationStarted = false;
        this.currentState = mat4.create();
        this.animationID = animationID;
    }

    update(timeIncrement) {
        this.elapsedTime += timeIncrement;
    }

    apply() {
        
    }
}

// time
// animationHasEnded?
// currentState
// id Animação