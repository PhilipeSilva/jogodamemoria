// 
let objects = ['beer', 'beer', 'cannabis', 'cannabis', 'star', 'star', 'rocket', 'rocket', 'piggy-bank', 'piggy-bank', 'gamepad', 'gamepad', 'hand-peace', 'hand-peace', 'skull', 'skull'],

    // Seletores
    $container = $('.container'),
    $scorePanel = $('.score-panel'),
    $rating = $('.fa-star'),
    $moves = $('.moves'),
    $timer = $('.timer'),
    $restart = $('.restart'),
    $deck = $('.deck'),

    // Variáveis
    nowTime,
    allOpen = [],
    match = 0,
    second = 0,
    moves = 0,
    wait = 420,
    totalCard = objects.length / 2,

    // Sistema de pontos
    stars3 = 20,
    stars2 = 21,
    star1 = 30;

// Misturar cartas
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Iniciar Jogo
function init() {

    // misturar
    let allCards = shuffle(objects);
    $deck.empty();

    // start
    match = 0;
    moves = 0;
    $moves.text('0');

    // Loop de 16 "class" com tag "card"
    for (let i = 0; i < allCards.length; i++) {
        $deck.append($('<li class="card"><i class="fa fa-' + allCards[i] + '"></i></li>'))
    }
    addCardListener();

    // resetar 0 quando for reiniciado
    resetTimer(nowTime);
    second = 0;
    $timer.text(`${second}`)
    initTime();
}

//pontuação conforme movimentos(linha 22 function init)
function rating(moves) {
    let rating = 3;
    if (moves > stars3 && moves < stars2) {
        $rating.eq(3).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > stars2 && moves < star1) {
        $rating.eq(2).removeClass('fa-star').addClass('fa-star-o');
    } else if (moves > star1) {
        $rating.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return { score: rating };
}

// Mensagem de vencedor
function gameOver(moves, score) {
    $('#winnerText').text(`Em ${second} segundos, você fez um total de ${moves} movimentos, você marcou ${score}pontos em um total total de 3 pontos. isso é ótimo!`);
    $('#winnerModal').modal('toggle');
}

//resetar jogo no botão 
$restart.on('click', function (confirmed) {
    if (confirmed) {
        $rating.removeClass('fa-star-o').addClass('fa-star');
        init();
    }
});

// Validar Cartões

// se não forem iguais, viram novamente
let addCardListener = function () {

    //o cartão clicado é invertido
    $deck.find('.card').on('click', function () {
        let $this = $(this);

        if ($this.hasClass('show') || $this.hasClass('match')) { return true; }

        let card = $this.context.innerHTML;
        $this.addClass('open show');
        allOpen.push(card);

        // Comparar cards
        if (allOpen.length > 1) {
            if (card === allOpen[0]) {
                $deck.find('.open').addClass('match');
                setTimeout(function () {
                    $deck.find('open').removeClass('open show');
                }, wait);
                match++;

                //se nao forem iguais, dão uma pausa e voltam a virar
            } else {
                $deck.find('.open').addClass('notmatch');
                setTimeout(function () {
                    $deck.find('.open').removeClass('open show');
                }, wait / 1);
            }

            // quando todos estiverem abertos
            allOpen = [];

            // cada open gera um move
            moves++;

            // adicionar pontuacao para calcular numero de estrelas
            rating(moves);

            // numéro de movimentos para exibir
            $moves.html(moves);
        }

        // jogo termina quando todos cards derem "match"
        if (totalCard === match) {
            rating(moves);
            let score = rating(moves).score;
            setTimeout(function () {
                gameOver(moves, score);
            }, 500);
        }
    });
}

// iniciar temporizador
function initTime() {
    nowTime = setInterval(function () {
        $timer.text(`${second}`)
        second = second + 1
    }, 1000);
}

// redefinir
function resetTimer(timer) {
    if (timer) {
        clearInterval(timer);
    }
}

init();