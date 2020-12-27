
class MyGameSequence {
    constructor(scene) {
		this.scene = scene;

		this.moves = [];
    }
    
    addMove(move) {
        this.moves.push(move);
    }

    getPreviousBoard() {
        if(this.moves.length == 0) {
            let empty = "empty";
            return [
                [                                         empty,    empty],                            
                [                                     empty,   empty,   empty],                         
                [                                empty,    empty,   empty,  empty],                    
                [                           empty,    empty,    empty,   empty,   empty],              
                [                      empty,    empty,    empty,   empty,   empty,   empty],          
                [                          empty,     empty,   empty,   empty,    empty],              
                [                      empty,    empty,    empty,   empty,   empty,   empty],           
                [                 empty,   empty,     empty,   empty,   empty,    empty,   empty],     
                [                      empty,    empty,    empty,   empty,  empty,   empty],           
                [                 empty,   empty,     empty,    empty,   empty,    empty,   empty],      
                [                      empty,    empty,    empty,   empty,  empty,   empty],           
                [                 empty,   empty,     empty,   empty,     empty,    empty,   empty],      
                [                      empty,    empty,    empty,   empty,  empty,   empty],           
                [                 empty,   empty,     empty,   empty,     empty,    empty,   empty],      
                [                      empty,    empty,    empty,   empty,   empty,   empty],           
                [                 empty,   empty,     empty,   empty,     empty,    empty,   empty],      
                [                      empty,    empty,    empty,   empty,   empty,   empty],           
                [                           empty,    empty,   empty,    empty,   empty],               
                [                      empty,    empty,    empty,   empty,   empty,   empty],           
                [                           empty,    empty,   empty,   empty,   empty],                
                [                                empty,    empty,   empty,   empty],                    
                [                                     empty,   empty,   empty],                         
                [                                          empty,   empty]                              
                ];
        } else {
            return this.undo().board;
        }
    }

    getPreviousPlayerScore(playerNum) {
        if(this.moves.length == 0) {
            return ['FALSE', 'FALSE', 'FALSE'];
        } else {
            if(playerNum == 1)
                return this.undo().player1Score;
            else
                return this.undo().player2Score;
        }
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