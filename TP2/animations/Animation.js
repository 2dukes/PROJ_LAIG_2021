class Animation {
    constructor(scene, elapsedTime, animationID) {
        this.scene = scene;
        
        this.elapsedTime = elapsedTime;
        this.animationEnded = false;
        this.currentState = mat4.create();
        this.animationID = animationID;
    }

    update(currentTime) {
        this.elapsedTime += currentTime;
    }

    apply() {
        
    }
}

// time
// animationHasEnded?
// currentState
// id Animação