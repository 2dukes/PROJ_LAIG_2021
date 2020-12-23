:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).
:- consult('src/alliances.pl').

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

% Receives a number and provides a color (text)
parse_input(color(C), Res) :- color(C,Res).

% Example of how a game might be started, and how Prolog may provide important game information
parse_input(startgame(Type,Level1,Level2), Res) :-
	validate_type_of_game(Type,Resp),
	Res = {
		'"success"': true,
		'"typeOfGame"': Resp,
		'"currentPlayer"': [1, Level1],
		'"nextPlayer"': [2, Level2],
		'"board"': [[0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
		[0, 1, 0, 1, 0, 1, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[2, 0, 2, 0, 2, 0, 2, 0],
		[0, 2, 0, 2, 0, 2, 0, 2],
		[2, 0, 2, 0, 2, 0, 2, 0]],
		'"countPlayer1"': 0,
		'"countPlayer2"': 0,
        '"nTurns"': 0
	}.

% ------------------------ Alliances ------------------------

% Gets Game Modes

parse_input(getGameModes, Res) :-
	Res = {
		'"sucess"': true,
		'"gameModes"': ['"random"', '"greddy"', '"greddy_hard"'] 
	}.


% PvP

parse_input(userMove(GameState, selectedMove(Row-Diagonal-Colour), Nplayer), Res) :-
	userPlay_LAIG(GameState, Row-Diagonal-Colour, Nplayer-p, Res).	

% Computer Move

parse_input(computerMove(GameState, Nplayer, Level), Res) :-
	computerPlay_LAIG(GameState, Nplayer-(c-Level), Res).

% ------------------------ Alliances ------------------------

% Available options for color
color(0, Res):- Res = {'"success"':true,'"color"':'"red"'}.
color(1, Res):- Res = {'"success"':true,'"color"':'"blue"'}.
color(_, Res):-  Res = {'"success"': false}.

% Available options for validating a type of game (defined by the user)
validate_type_of_game(0, Res):- Res = '"PvP"'.
validate_type_of_game(1, Res):- Res = '"PvC"'.
validate_type_of_game(2, Res):- Res = '"CvC"'.


test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
	
% ------------------------ Alliances ------------------------

codeString(empty, '"empty"').
codeString(orange, '"orange"').
codeString(purple, '"purple"').
codeString(green, '"green"').
codeString('FALSE', false).
codeString('TRUE', true).

addJSONQuotesToBoard([], ListResult, ListResult).
addJSONQuotesToBoard([H | T], Aux, ListResult) :-
	codeString(H, H_String),
	append(Aux, [H_String], NewAux),
	addJSONQuotesToBoard(T, NewAux, ListResult).

addJSONQuotesToBoard_Global([], Result, Result).
addJSONQuotesToBoard_Global([First | Rest], Aux, Result) :-
	addJSONQuotesToBoard(First, [], ListResult),
	append(Aux, [ListResult], NewAux),
	addJSONQuotesToBoard_Global(Rest, NewAux, Result).

userPlay_LAIG(GameState, Row-Diagonal-Colour, Nplayer-p, Res) :-
	checkValidPlay(GameState, [Row, Diagonal, Colour]),
	move(GameState, [Row, Diagonal, Colour], NewGameStateBoard),
	updateColours(NewGameStateBoard, NewGameState, Nplayer),
	check_over_LAIG(NewGameState, Winner),

	print_move([Row, Diagonal, Colour]),

	NextPlayer is mod(Nplayer, 2) + 1,

	Board-(Purple_1-Orange_1-Green_1-Purple_2-Orange_2-Green_2) = NewGameState,
	addJSONQuotesToBoard_Global(Board, [], NewBoard),

	buildResult(true, Nplayer, NextPlayer, NewBoard, Row-Diagonal-Colour, Purple_1-Orange_1-Green_1,
		Purple_2-Orange_2-Green_2, Winner, Res).	

userPlay_LAIG(_, _, Nplayer-p, Res) :-
	buildResult(false, Nplayer, Res).

% Computer Move

computerPlay_LAIG(GameState, Nplayer-(c-Level), Res) :-
	choose_move(GameState, Nplayer, Level, Move),
    move(GameState, Move, NewGameStateBoard),
    updateColours(NewGameStateBoard, NewGameState, Nplayer),
	check_over_LAIG(NewGameState, Winner),

	print_move(Move),
	nth1(1, Move, Row),
	nth1(2, Move, Diagonal),
	nth1(3, Move, Colour),

	NextPlayer is mod(Nplayer, 2) + 1,
	Board-(Purple_1-Orange_1-Green_1-Purple_2-Orange_2-Green_2) = NewGameState,

	addJSONQuotesToBoard_Global(Board, [], NewBoard),

	buildResult(true, Nplayer, NextPlayer, NewBoard, Row-Diagonal-Colour, Purple_1-Orange_1-Green_1,
		Purple_2-Orange_2-Green_2, Winner, Res).

% Check Game Over

check_over_LAIG(GameState, Winner) :-
    game_over(GameState, Winner),
    display_game(GameState, 0),
    write('Player '), write(Winner), write(' won!'), nl.

check_over_LAIG(_, 0). 

% Response - Success

buildResult(true, Nplayer, NextPlayer, Board, Row-Diagonal-Colour, Purple_1-Orange_1-Green_1,
	Purple_2-Orange_2-Green_2, Winner, Res) :-

	codeString(Colour, PlayedColour),
	codeString(Purple_1, Purple1),
	codeString(Orange_1, Orange1),
	codeString(Green_1, Green1),
	codeString(Purple_2, Purple2),
	codeString(Orange_2, Orange2),
	codeString(Green_2, Green2),

		Res = {
		'"success"': true,
		'"currentPlayer"': Nplayer,
		'"nextPlayer"': NextPlayer,
		'"board"': Board,
		'"playedRow"': Row,
		'"playedDiagonal"': Diagonal,
		'"playedColour"': PlayedColour,
		'"currentPlayerColours"': {
			'"purple"': Purple1,
			'"orange"': Orange1,
			'"green"': Green1
		},
		'"nextPlayerColours"': {
			'"purple"': Purple2,
			'"orange"': Orange2,
			'"green"': Green2
		},
		'"winner"': Winner
	}.	

% Response - Failure

buildResult(false, Nplayer, Res) :-
	Res = {
		'"success"': false,
		'"currentPlayer"': Nplayer
	}.

% ------------------------ Alliances ------------------------
