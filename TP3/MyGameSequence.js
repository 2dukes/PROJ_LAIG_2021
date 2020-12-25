
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
        let undoMove = this.moves[this.moves.length - 1];
        this.moves.pop();
        return undoMove;
    }
}