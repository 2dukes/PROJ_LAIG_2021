% purple(1).
% purple(2).
% green(0).
% wow(7).
% orange(3).
% purple(4).

% execute(Function, Args) :-
%     Run =.. [Function | Args], 
%     Run.


% checkReached([Atual|RestoDoNivel], Predicate) :-
%     execute(Predicate, [Atual]).

% checkReached([Atual|RestoDoNivel], Predicate) :-
%     checkReached(RestoDoNivel, Predicate).

adjacent(0, 1).
adjacent(2, 1).
adjacent(1, 2).

adjacent(5, 4).
adjacent(6, 8).
adjacent(8, 4).
adjacent(12, 4).

validAdjacent(Nivel, Result) :-
    member(Ponto, Nivel),
    adjacent(Result, Ponto).