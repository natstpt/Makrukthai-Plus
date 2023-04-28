$(function() {
	var board,
		game = new Chess(),
		statusEl = $('#status'),
		boardEl = $('#board'),
		// fenEl = $('#fen'),
		pgnEl = $('#pgn');

	game.load_pgn(pgnString);

	var piece_theme, promote_to, promoting, promotion_dialog;
	promoting = false;
	piece_theme = '/images/chesspieces/newimg/{piece}.png';
	promotion_dialog = $('#promotion-dialog');
	var moveAudio = $("#moveAudio")[0];

	// do not pick up pieces if the game is over
	// only pick up pieces for the side to move
	var onDragStart = function(source, piece, position, orientation) {
		if (game.game_over() === true ||
			(game.turn() === 'w' && piece.search(/^b/) !== -1) ||
			(myColor.slice(0, 1) !== game.turn()) ||
			(game.turn() === 'b' && piece.search(/^w/) !== -1)) {
			return false;
		}
	};

	var onDrop = function(source, target) {
		move_cfg = {
			from: source,
			to: target,
			promotion: 'q'
		};

		// check we are not trying to make an illegal pawn move to the 8th or 1st rank,
		// so the promotion dialog doesn't pop up unnecessarily
		// e.g. (p)d7-f8
		var move = game.move(move_cfg);
		// illegal move
		if (move === null) {
			return 'snapback';
		} else {
			game.undo(); //move is ok, now we can go ahead and check for promotion
		}

		
		// no promotion, go ahead and move
		makeMove(game, move_cfg);

	};

	// update the board position after the piece snap
	// for castling, en passant, pawn promotion
	var onSnapEnd = function() {
		if (promoting) return; //if promoting we need to select the piece first
		updateBoard(board);
	};

	//gets url of piece image from piece_theme
	function getImgSrc(piece) {
		return piece_theme.replace('{piece}', game.turn() + piece.toLocaleUpperCase());
	}

	function updateBoard(board) {
		board.position(game.fen());
		updateStatus();
		promoting = false;
	}

	var updateStatus = function() {
		var status = '';

		var moveColor = 'White';
		if (game.turn() === 'b') {
			moveColor = 'Black';
		}

		// checkmate?
		if (game.in_checkmate() === true) {
			status = 'Game over, ' + moveColor + ' is in checkmate.';
		}

		// draw?
		else if (game.in_draw() === true) {
			status = 'Game over, drawn position';
		}

		// game still on
		else {
			status = moveColor + ' to move';

			// check?
			if (game.in_check() === true) {
				status += ', ' + moveColor + ' is in check';
			}
		}

		statusEl.html(status);
		// fenEl.html(game.fen());
		var pgnArr = game.pgn().split(" ");
		var pglhtml = "";
		for (var i = 0; i < pgnArr.length; i++) {
			if (i % 3 === 0) {
				pglhtml += "<tr>";
			}
			pglhtml += "<td>" + pgnArr[i] + "</td>";
			if (i % 3 === 2) {
				pglhtml += "</tr>";
			}
		}
		pgnEl.html(pglhtml);
	};

	// Promote the piece to the selected piece from selectable then make the move
	var onDialogClose = function() {
		move_cfg.promotion = promote_to;
		makeMove(game, move_cfg);
	}

	function makeMove(game, cfg) {
		// see if the move is legal
		var move = game.move(cfg);
		// illegal move
		if (move === null) return 'snapback';

		// Update the highlighted square
		boardEl.find('.square-55d63').removeClass('highlight-square');
		boardEl.find('.square-' + cfg.from).addClass('highlight-square');
		boardEl.find('.square-' + cfg.to).addClass('highlight-square');
		moveAudio.play();

		socket.emit('ai move', 4, cfg.from, cfg.to, cfg.promotion);

		updateStatus();
	}

	updateStatus();
	var cfg = {
		pieceTheme: piece_theme,
		orientation: myColor,
		position: game.fen(),
		draggable: true,
		onDragStart: onDragStart,
		onDrop: onDrop,
		onSnapEnd: onSnapEnd
	};
	var board = ChessBoard('board', cfg);

	

	// On receiveing own move from server
	socket.on('own ai move', function(source, target, promotion) {
		// Make that move
		game.move({
			from: source,
			to: target,
			promotion: promotion
		});

		// Update the highlighted square
		boardEl.find('.square-55d63').removeClass('highlight-square');
		boardEl.find('.square-' + source).addClass('highlight-square');
		boardEl.find('.square-' + target).addClass('highlight-square');
		moveAudio.play();

		updateStatus();

		// Update Chessboard UI
		board.position(game.fen());
	});

	// On receiveing move from server
	socket.on('ai moved', function(move) {
		// Make that move
		console.log(move);
		var res = game.move(move, {
			sloppy: true
		});

		console.log(res);

		// Update the highlighted square
		boardEl.find('.square-55d63').removeClass('highlight-square');
		boardEl.find('.square-' + res.from).addClass('highlight-square');
		boardEl.find('.square-' + res.to).addClass('highlight-square');
		moveAudio.play();

		updateStatus();

		// Update Chessboard UI
		board.position(game.fen());
	});

	$('#nav_forfeit').on("click", function() {
		// console.log('AI Game to start');
		socket.emit('forfeit ai');
		$(location).attr('href', '/dashboard');
	});
});
