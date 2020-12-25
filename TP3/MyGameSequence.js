
class MyGameSequence {
    constructor(scene) {
		this.scene = scene;

		this.moves = [];
    }
    
    addMove(move) {
        this.moves.push(move);
    }

    undo() {
        if (this.moves.length == 0) return null;
        return this.moves[this.moves.length - 1];
    }

    pop() {
        if (this.moves.length != 0)
            this.moves.pop();
    }
}