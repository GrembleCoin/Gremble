/* =========================================================
   GREMBLE COIN CATCH
   GAME + SUPABASE LEADERBOARD
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://tffzjqeckoezursrvcpw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_MFdYqNoOg1FEx-6PSjJwjQ_oCIo94ME";

const SCORES_API =
    `${SUPABASE_URL}/rest/v1/scores`;



/* =========================================================
   GAME ELEMENTS
========================================================= */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const startButton =
    document.getElementById("startGame");

const scoreElement =
    document.getElementById("gameScore");

const livesElement =
    document.getElementById("gameLives");

const gameMessage =
    document.getElementById("gameMessage");

const leftButton =
    document.getElementById("moveLeft");

const rightButton =
    document.getElementById("moveRight");



/* =========================================================
   CANVAS
========================================================= */

const GAME_WIDTH = 900;
const GAME_HEIGHT = 560;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;



/* =========================================================
   FLOOR
========================================================= */

const FLOOR_Y =
    GAME_HEIGHT - 72;



/* =========================================================
   GAME STATE
========================================================= */

let gameRunning = false;

let score = 0;
let lives = 3;

let fallingCoins = [];

let lastSpawn = 0;

let spawnInterval = 1000;

let fallSpeed = 2.8;

let animationFrameId = null;

let scoreSubmitted = false;



/* =========================================================
   CONTROLS
========================================================= */

const keys = {
    left: false,
    right: false
};



/* =========================================================
   PLAYER
========================================================= */

const player = {

    x:
        GAME_WIDTH / 2 - 40,

    y:
        FLOOR_Y - 115,

    width:
        80,

    height:
        115,

    speed:
        10
};



/* =========================================================
   IMAGES
========================================================= */

const images = {};



/* PLAYER */

images.player = new Image();

images.player.src =
    "gremble3.png";



/* GREMBLECOIN */

images.gremblecoin =
    new Image();

images.gremblecoin.src =
    "gremblecoin.png";



/* BAD COINS */

images.bitcoin =
    new Image();

images.bitcoin.src =
    "bitcoin.png";


images.ethereum =
    new Image();

images.ethereum.src =
    "ethereum.png";


images.solana =
    new Image();

images.solana.src =
    "solana.png";


images.dogecoin =
    new Image();

images.dogecoin.src =
    "dogecoin.png";


images.pepe =
    new Image();

images.pepe.src =
    "pepe.png";


images.shiba =
    new Image();

images.shiba.src =
    "shiba.png";



/* =========================================================
   COIN TYPES
========================================================= */

const goodCoin = {

    name:
        "GREMBLE",

    image:
        images.gremblecoin,

    good:
        true
};



const badCoins = [

    {
        name:
            "BITCOIN",

        image:
            images.bitcoin,

        good:
            false
    },


    {
        name:
            "ETHEREUM",

        image:
            images.ethereum,

        good:
            false
    },


    {
        name:
            "SOLANA",

        image:
            images.solana,

        good:
            false
    },


    {
        name:
            "DOGECOIN",

        image:
            images.dogecoin,

        good:
            false
    },


    {
        name:
            "PEPE",

        image:
            images.pepe,

        good:
            false
    },


    {
        name:
            "SHIBA",

        image:
            images.shiba,

        good:
            false
    }

];



/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        const key =
            event.key.toLowerCase();


        if (
            event.key === "ArrowLeft" ||
            key === "a"
        ) {

            keys.left = true;

            event.preventDefault();

        }


        if (
            event.key === "ArrowRight" ||
            key === "d"
        ) {

            keys.right = true;

            event.preventDefault();

        }

    }
);



document.addEventListener(
    "keyup",
    (event) => {

        const key =
            event.key.toLowerCase();


        if (
            event.key === "ArrowLeft" ||
            key === "a"
        ) {

            keys.left = false;

        }


        if (
            event.key === "ArrowRight" ||
            key === "d"
        ) {

            keys.right = false;

        }

    }
);



/* =========================================================
   MOBILE CONTROLS
========================================================= */

function pressLeft(event) {

    if (event) {

        event.preventDefault();

    }

    keys.left = true;

}



function releaseLeft(event) {

    if (event) {

        event.preventDefault();

    }

    keys.left = false;

}



function pressRight(event) {

    if (event) {

        event.preventDefault();

    }

    keys.right = true;

}



function releaseRight(event) {

    if (event) {

        event.preventDefault();

    }

    keys.right = false;

}



if (leftButton) {

    leftButton.addEventListener(
        "touchstart",
        pressLeft,
        {
            passive: false
        }
    );


    leftButton.addEventListener(
        "touchend",
        releaseLeft,
        {
            passive: false
        }
    );


    leftButton.addEventListener(
        "mousedown",
        pressLeft
    );


    leftButton.addEventListener(
        "mouseup",
        releaseLeft
    );


    leftButton.addEventListener(
        "mouseleave",
        releaseLeft
    );

}



if (rightButton) {

    rightButton.addEventListener(
        "touchstart",
        pressRight,
        {
            passive: false
        }
    );


    rightButton.addEventListener(
        "touchend",
        releaseRight,
        {
            passive: false
        }
    );


    rightButton.addEventListener(
        "mousedown",
        pressRight
    );


    rightButton.addEventListener(
        "mouseup",
        releaseRight
    );


    rightButton.addEventListener(
        "mouseleave",
        releaseRight
    );

}



/* =========================================================
   SPAWN COIN
========================================================= */

function spawnCoin() {

    const chance =
        Math.random();


    let coinType;


    /*
       60% GREMBLECOIN
       40% OTHER COINS
    */

    if (
        chance < 0.60
    ) {

        coinType =
            goodCoin;

    }

    else {

        const randomBad =
            Math.floor(
                Math.random() *
                badCoins.length
            );


        coinType =
            badCoins[randomBad];

    }



    const size =
        coinType.good
            ? 64
            : 60;



    fallingCoins.push({

        x:
            Math.random() *
            (
                GAME_WIDTH -
                size
            ),

        y:
            -size - 120,

        width:
            size,

        height:
            size,

        speed:
            fallSpeed +
            Math.random() *
            1.3,

        type:
            coinType

    });

}



/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updatePlayer() {

    if (
        keys.left
    ) {

        player.x -=
            player.speed;

    }


    if (
        keys.right
    ) {

        player.x +=
            player.speed;

    }



    if (
        player.x < 0
    ) {

        player.x = 0;

    }



    if (
        player.x +
        player.width >
        GAME_WIDTH
    ) {

        player.x =
            GAME_WIDTH -
            player.width;

    }

}



/* =========================================================
   COLLISION
========================================================= */

function collision(
    player,
    coin
) {

    /*
       Smaller player hitbox
       so collisions feel fair.
    */

    const playerHitbox = {

        x:
            player.x + 14,

        y:
            player.y + 18,

        width:
            player.width - 28,

        height:
            player.height - 24
    };


    const coinPadding =
        7;



    return (

        playerHitbox.x <
        coin.x +
        coin.width -
        coinPadding

        &&

        playerHitbox.x +
        playerHitbox.width >
        coin.x +
        coinPadding

        &&

        playerHitbox.y <
        coin.y +
        coin.height -
        coinPadding

        &&

        playerHitbox.y +
        playerHitbox.height >
        coin.y +
        coinPadding

    );

}



/* =========================================================
   LOSE LIFE
========================================================= */

function loseLife(
    message
) {

    lives--;


    livesElement.textContent =
        lives;


    flashDamage();


    gameMessage.innerHTML =
        message;


    if (
        lives <= 0
    ) {

        endGame();

        return true;

    }


    return false;

}



/* =========================================================
   UPDATE COINS
========================================================= */

function updateCoins() {

    for (
        let i =
            fallingCoins.length - 1;

        i >= 0;

        i--
    ) {

        const coin =
            fallingCoins[i];


        coin.y +=
            coin.speed;



        /* =================================================
           PLAYER CATCHES COIN
        ================================================= */

        if (
            collision(
                player,
                coin
            )
        ) {


            /* GREMBLECOIN */

            if (
                coin.type.good
            ) {

                score++;


                scoreElement.textContent =
                    score;


                increaseDifficulty();


                gameMessage.innerHTML =
                    `
                    Nice!
                    <strong>+1 GrembleCoin</strong>
                    `;

            }


            /* BAD COIN */

            else {

                const gameEnded =
                    loseLife(
                        `
                        Wrong coin!
                        <strong>-1 LIFE</strong>
                        `
                    );


                fallingCoins.splice(
                    i,
                    1
                );


                if (
                    gameEnded
                ) {

                    return;

                }


                continue;

            }



            fallingCoins.splice(
                i,
                1
            );


            continue;

        }



        /* =================================================
           GREMBLECOIN WAS MISSED
        ================================================= */

        if (
            coin.type.good &&
            coin.y >
            FLOOR_Y + 15
        ) {

            fallingCoins.splice(
                i,
                1
            );


            const gameEnded =
                loseLife(
                    `
                    You missed GrembleCoin!
                    <strong>-1 LIFE</strong>
                    `
                );


            if (
                gameEnded
            ) {

                return;

            }


            continue;

        }



        /* =================================================
           BAD COIN FALLS PAST PLAYER

           GOOD!
           Player correctly avoided it.
        ================================================= */

        if (
            !coin.type.good &&
            coin.y >
            GAME_HEIGHT + 80
        ) {

            fallingCoins.splice(
                i,
                1
            );

        }

    }

}



/* =========================================================
   DIFFICULTY
========================================================= */

function increaseDifficulty() {

    /*
       Every 5 score:
       faster falling
       faster spawning
    */

    if (
        score > 0 &&
        score % 5 === 0
    ) {

        fallSpeed +=
            0.35;


        spawnInterval =
            Math.max(
                330,
                spawnInterval - 65
            );

    }

}



/* =========================================================
   DAMAGE EFFECT
========================================================= */

function flashDamage() {

    canvas.classList.add(
        "damage"
    );


    setTimeout(
        () => {

            canvas.classList.remove(
                "damage"
            );

        },
        200
    );

}



/* =========================================================
   BACKGROUND
========================================================= */

function drawBackground() {

    ctx.clearRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );



    /* DARK BACKGROUND */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );


    gradient.addColorStop(
        0,
        "#010907"
    );


    gradient.addColorStop(
        0.48,
        "#021c13"
    );


    gradient.addColorStop(
        1,
        "#001008"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );



    /* CENTER GREEN GLOW */

    const centerGlow =
        ctx.createRadialGradient(
            GAME_WIDTH / 2,
            GAME_HEIGHT * 0.60,
            20,

            GAME_WIDTH / 2,
            GAME_HEIGHT * 0.60,
            420
        );


    centerGlow.addColorStop(
        0,
        "rgba(0,255,110,0.09)"
    );


    centerGlow.addColorStop(
        0.45,
        "rgba(0,160,80,0.04)"
    );


    centerGlow.addColorStop(
        1,
        "rgba(0,100,50,0)"
    );


    ctx.fillStyle =
        centerGlow;


    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );



    /* STARS */

    for (
        let i = 0;
        i < 90;
        i++
    ) {

        const x =
            (
                i * 137 +
                23
            ) %
            GAME_WIDTH;


        const y =
            (
                i * 83 +
                41
            ) %
            (
                GAME_HEIGHT -
                95
            );


        ctx.fillStyle =
            i % 5 === 0
                ? "rgba(110,255,150,0.70)"
                : "rgba(255,255,255,0.20)";


        const starSize =
            i % 7 === 0
                ? 2
                : 1;


        ctx.fillRect(
            x,
            y,
            starSize,
            starSize
        );

    }



    /* BRIGHT STARS */

    const brightStars = [

        [75, 120],

        [185, 265],

        [320, 95],

        [450, 180],

        [610, 110],

        [760, 255],

        [850, 150]

    ];


    brightStars.forEach(
        (star) => {

            const x =
                star[0];

            const y =
                star[1];


            ctx.save();


            ctx.shadowColor =
                "#73ff9e";


            ctx.shadowBlur =
                10;


            ctx.fillStyle =
                "#d8ffe3";


            ctx.fillRect(
                x - 1,
                y - 1,
                3,
                3
            );


            ctx.restore();

        }
    );



    /* FLOOR GLOW */

    const floorGlow =
        ctx.createLinearGradient(
            0,
            FLOOR_Y - 45,
            0,
            FLOOR_Y + 45
        );


    floorGlow.addColorStop(
        0,
        "rgba(40,255,100,0)"
    );


    floorGlow.addColorStop(
        0.5,
        "rgba(40,255,100,0.08)"
    );


    floorGlow.addColorStop(
        1,
        "rgba(40,255,100,0)"
    );


    ctx.fillStyle =
        floorGlow;


    ctx.fillRect(
        0,
        FLOOR_Y - 45,
        GAME_WIDTH,
        90
    );



    /* SINGLE GREEN FLOOR LINE */

    ctx.save();


    ctx.shadowColor =
        "#32ff6a";


    ctx.shadowBlur =
        16;


    ctx.strokeStyle =
        "#32ff6a";


    ctx.lineWidth =
        2;


    ctx.beginPath();


    ctx.moveTo(
        0,
        FLOOR_Y
    );


    ctx.lineTo(
        GAME_WIDTH,
        FLOOR_Y
    );


    ctx.stroke();



    ctx.shadowBlur =
        4;


    ctx.strokeStyle =
        "rgba(170,255,190,0.50)";


    ctx.lineWidth =
        1;


    ctx.beginPath();


    ctx.moveTo(
        0,
        FLOOR_Y - 1
    );


    ctx.lineTo(
        GAME_WIDTH,
        FLOOR_Y - 1
    );


    ctx.stroke();


    ctx.restore();

}



/* =========================================================
   DRAW PLAYER
========================================================= */

function drawPlayer() {

    if (
        images.player.complete &&
        images.player.naturalWidth > 0
    ) {

        ctx.save();


        ctx.shadowColor =
            "rgba(50,255,130,0.22)";


        ctx.shadowBlur =
            14;


        ctx.drawImage(
            images.player,

            player.x,
            player.y,

            player.width,
            player.height
        );


        ctx.restore();

    }

}



/* =========================================================
   DRAW COIN TRAIL
========================================================= */

function drawCoinTrail(
    coin
) {

    const centerX =
        coin.x +
        coin.width / 2;


    const coinTop =
        coin.y + 5;


    const trailHeight =
        coin.type.good
            ? 150
            : 120;


    const bottomWidth =
        coin.width *
        0.72;



    /* GREMBLE = GREEN */
    /* BAD = RED */

    const colors =
        coin.type.good

            ? {

                transparent:
                    "rgba(70,255,130,0)",

                soft:
                    "rgba(70,255,130,0.07)",

                medium:
                    "rgba(70,255,130,0.20)",

                strong:
                    "rgba(110,255,150,0.52)",

                glow:
                    "rgba(70,255,130,0.50)"
            }

            : {

                transparent:
                    "rgba(255,65,65,0)",

                soft:
                    "rgba(255,65,65,0.05)",

                medium:
                    "rgba(255,70,70,0.15)",

                strong:
                    "rgba(255,100,100,0.38)",

                glow:
                    "rgba(255,60,60,0.32)"
            };



    /* MAIN LIGHT */

    ctx.save();


    const gradient =
        ctx.createLinearGradient(
            centerX,
            coinTop -
            trailHeight,

            centerX,
            coinTop
        );


    gradient.addColorStop(
        0,
        colors.transparent
    );


    gradient.addColorStop(
        0.30,
        colors.soft
    );


    gradient.addColorStop(
        0.70,
        colors.medium
    );


    gradient.addColorStop(
        1,
        colors.strong
    );


    ctx.fillStyle =
        gradient;


    ctx.shadowColor =
        colors.glow;


    ctx.shadowBlur =
        18;


    ctx.beginPath();


    ctx.moveTo(
        centerX - 2,
        coinTop -
        trailHeight
    );


    ctx.lineTo(
        centerX + 2,
        coinTop -
        trailHeight
    );


    ctx.lineTo(
        centerX +
        bottomWidth / 2,
        coinTop
    );


    ctx.lineTo(
        centerX -
        bottomWidth / 2,
        coinTop
    );


    ctx.closePath();


    ctx.fill();


    ctx.restore();



    /* LIGHT STREAKS */

    ctx.save();


    const streaks =
        coin.type.good
            ? 7
            : 5;


    for (
        let i = 0;

        i < streaks;

        i++
    ) {

        const normalized =
            streaks === 1

                ? 0

                : i /
                (
                    streaks -
                    1
                );


        const offset =
            (
                normalized -
                0.5
            ) *
            coin.width *
            0.48;


        const streakHeight =
            trailHeight *
            (
                0.35 +
                (
                    (
                        i * 19
                    ) %
                    45
                ) /
                100
            );


        const x =
            centerX +
            offset;


        const streakGradient =
            ctx.createLinearGradient(
                x,
                coinTop -
                streakHeight,

                x,
                coinTop
            );


        streakGradient.addColorStop(
            0,
            colors.transparent
        );


        streakGradient.addColorStop(
            0.68,
            colors.medium
        );


        streakGradient.addColorStop(
            1,
            colors.strong
        );


        ctx.strokeStyle =
            streakGradient;


        ctx.lineWidth =
            i % 2 === 0
                ? 1.4
                : 0.7;


        ctx.beginPath();


        ctx.moveTo(
            x,
            coinTop -
            streakHeight
        );


        ctx.lineTo(
            x,
            coinTop
        );


        ctx.stroke();

    }


    ctx.restore();



    /* COIN CONNECTION GLOW */

    ctx.save();


    const connectionGlow =
        ctx.createRadialGradient(
            centerX,
            coin.y + 5,
            0,

            centerX,
            coin.y + 5,
            coin.width * 0.68
        );


    connectionGlow.addColorStop(
        0,
        colors.strong
    );


    connectionGlow.addColorStop(
        0.35,
        colors.medium
    );


    connectionGlow.addColorStop(
        1,
        colors.transparent
    );


    ctx.fillStyle =
        connectionGlow;


    ctx.beginPath();


    ctx.arc(
        centerX,
        coin.y + 5,

        coin.width * 0.68,

        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

}



/* =========================================================
   DRAW COINS
========================================================= */

function drawCoins() {

    fallingCoins.forEach(
        (coin) => {

            const image =
                coin.type.image;


            if (
                !image.complete ||
                image.naturalWidth === 0
            ) {

                return;

            }



            drawCoinTrail(
                coin
            );



            ctx.save();



            if (
                coin.type.good
            ) {

                ctx.shadowColor =
                    "rgba(70,255,130,0.80)";


                ctx.shadowBlur =
                    24;

            }

            else {

                ctx.shadowColor =
                    "rgba(255,70,70,0.38)";


                ctx.shadowBlur =
                    16;

            }



            ctx.drawImage(
                image,

                coin.x,
                coin.y,

                coin.width,
                coin.height
            );


            ctx.restore();

        }
    );

}



/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(
    timestamp
) {

    if (
        !gameRunning
    ) {

        return;

    }



    updatePlayer();



    if (
        timestamp -
        lastSpawn >
        spawnInterval
    ) {

        spawnCoin();


        lastSpawn =
            timestamp;

    }



    updateCoins();



    if (
        !gameRunning
    ) {

        drawBackground();

        drawCoins();

        drawPlayer();

        return;

    }



    drawBackground();


    drawCoins();


    drawPlayer();



    animationFrameId =
        requestAnimationFrame(
            gameLoop
        );

}



/* =========================================================
   START GAME
========================================================= */

function startGame() {

    /*
       Prevent multiple loops.
    */

    if (
        animationFrameId
    ) {

        cancelAnimationFrame(
            animationFrameId
        );

    }



    score = 0;

    lives = 3;


    fallingCoins = [];


    fallSpeed =
        2.8;


    spawnInterval =
        1000;


    scoreSubmitted =
        false;



    player.x =
        GAME_WIDTH / 2 -
        player.width / 2;


    player.y =
        FLOOR_Y -
        player.height;



    scoreElement.textContent =
        score;


    livesElement.textContent =
        lives;



    gameMessage.innerHTML =
        `
        Catch every
        <strong>GrembleCoin</strong>.
        Avoid every other coin.
        `;



    hideSubmitPanel();



    gameRunning =
        true;



    startButton.textContent =
        "RESTART GAME";


    lastSpawn =
        performance.now();



    animationFrameId =
        requestAnimationFrame(
            gameLoop
        );

}



/* =========================================================
   GAME OVER
========================================================= */

function endGame() {

    gameRunning =
        false;


    keys.left =
        false;


    keys.right =
        false;



    if (
        animationFrameId
    ) {

        cancelAnimationFrame(
            animationFrameId
        );


        animationFrameId =
            null;

    }



    gameMessage.innerHTML =
        `
        GAME OVER —
        SCORE:
        <strong>${score}</strong>
        `;



    startButton.textContent =
        "PLAY AGAIN";



    showSubmitPanel();

}



/* =========================================================
   LEADERBOARD UI
========================================================= */

function createLeaderboardUI() {

    const gameWrapper =
        document.querySelector(
            ".game-wrapper"
        );


    if (
        !gameWrapper
    ) {

        return;

    }



    /*
       Avoid creating twice.
    */

    if (
        document.getElementById(
            "leaderboardSection"
        )
    ) {

        return;

    }



    const section =
        document.createElement(
            "div"
        );


    section.id =
        "leaderboardSection";


    section.innerHTML =
        `

        <div class="score-submit-panel" id="scoreSubmitPanel">

            <div class="submit-small-title">
                GAME OVER
            </div>

            <div class="submit-score">
                YOUR SCORE:
                <strong id="finalScore">
                    0
                </strong>
            </div>

            <div class="nickname-row">

                <input
                    type="text"
                    id="playerNickname"
                    maxlength="16"
                    placeholder="ENTER NICKNAME"
                    autocomplete="off"
                >

                <button
                    type="button"
                    id="submitScoreButton"
                >
                    SUBMIT SCORE
                </button>

            </div>

            <div
                id="submitStatus"
                class="submit-status"
            ></div>

        </div>


        <div class="leaderboard-panel">

            <div class="leaderboard-header">

                <div>

                    <div class="leaderboard-small">
                        GREMBLE ARCADE
                    </div>

                    <h3>
                        TOP PLAYERS
                    </h3>

                </div>

                <button
                    type="button"
                    id="refreshLeaderboard"
                >
                    ↻
                </button>

            </div>


            <div
                id="leaderboardList"
                class="leaderboard-list"
            >

                <div class="leaderboard-loading">
                    Loading leaderboard...
                </div>

            </div>

        </div>

        `;


    gameWrapper.appendChild(
        section
    );



    addLeaderboardStyles();



    const submitButton =
        document.getElementById(
            "submitScoreButton"
        );


    submitButton.addEventListener(
        "click",
        submitScore
    );



    const nicknameInput =
        document.getElementById(
            "playerNickname"
        );


    nicknameInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Enter"
            ) {

                submitScore();

            }

        }
    );



    const refreshButton =
        document.getElementById(
            "refreshLeaderboard"
        );


    refreshButton.addEventListener(
        "click",
        loadLeaderboard
    );



    hideSubmitPanel();


    loadLeaderboard();

}



/* =========================================================
   LEADERBOARD STYLES
========================================================= */

function addLeaderboardStyles() {

    if (
        document.getElementById(
            "leaderboardStyles"
        )
    ) {

        return;

    }



    const style =
        document.createElement(
            "style"
        );


    style.id =
        "leaderboardStyles";


    style.textContent =
        `

        #leaderboardSection {
            border-top:
                1px solid
                rgba(80,255,130,.14);

            background:
                #010806;
        }


        .score-submit-panel {
            display: none;

            padding:
                30px;

            text-align:
                center;

            border-bottom:
                1px solid
                rgba(80,255,130,.12);

            background:
                radial-gradient(
                    circle at center,
                    rgba(60,255,120,.07),
                    transparent 60%
                );
        }


        .submit-small-title {
            margin-bottom:
                8px;

            color:
                #65ff91;

            font-size:
                10px;

            font-weight:
                900;

            letter-spacing:
                3px;
        }


        .submit-score {
            margin-bottom:
                20px;

            color:
                #96a39d;

            font-size:
                14px;
        }


        .submit-score strong {
            color:
                #65ff91;

            font-size:
                24px;

            margin-left:
                6px;
        }


        .nickname-row {
            max-width:
                570px;

            margin:
                0 auto;

            display:
                flex;

            gap:
                10px;
        }


        #playerNickname {
            flex:
                1;

            min-width:
                0;

            height:
                50px;

            padding:
                0 18px;

            outline:
                none;

            border:
                1px solid
                rgba(80,255,130,.25);

            border-radius:
                12px;

            background:
                #03120d;

            color:
                #ffffff;

            font-family:
                inherit;

            font-size:
                13px;

            font-weight:
                800;

            letter-spacing:
                1px;
        }


        #playerNickname:focus {
            border-color:
                #58ff82;

            box-shadow:
                0 0 18px
                rgba(80,255,130,.10);
        }


        #submitScoreButton {
            min-width:
                170px;

            height:
                50px;

            border:
                0;

            border-radius:
                12px;

            background:
                #5cff73;

            color:
                #001007;

            font-size:
                11px;

            font-weight:
                900;

            letter-spacing:
                1px;

            cursor:
                pointer;
        }


        #submitScoreButton:disabled {
            opacity:
                .45;

            cursor:
                default;
        }


        .submit-status {
            min-height:
                18px;

            margin-top:
                12px;

            color:
                #86928d;

            font-size:
                11px;
        }


        .leaderboard-panel {
            padding:
                32px;
        }


        .leaderboard-header {
            display:
                flex;

            align-items:
                center;

            justify-content:
                space-between;

            margin-bottom:
                22px;
        }


        .leaderboard-small {
            margin-bottom:
                5px;

            color:
                #5cff83;

            font-size:
                9px;

            font-weight:
                900;

            letter-spacing:
                3px;
        }


        .leaderboard-header h3 {
            margin:
                0;

            color:
                #ffffff;

            font-size:
                24px;
        }


        #refreshLeaderboard {
            width:
                42px;

            height:
                42px;

            border:
                1px solid
                rgba(80,255,130,.22);

            border-radius:
                50%;

            background:
                transparent;

            color:
                #65ff8a;

            font-size:
                20px;

            cursor:
                pointer;
        }


        .leaderboard-list {
            display:
                flex;

            flex-direction:
                column;

            gap:
                7px;
        }


        .leaderboard-row {
            min-height:
                54px;

            padding:
                0 17px;

            display:
                grid;

            grid-template-columns:
                50px 1fr 90px;

            align-items:
                center;

            border:
                1px solid
                rgba(255,255,255,.05);

            border-radius:
                12px;

            background:
                rgba(255,255,255,.018);
        }


        .leaderboard-row.top-three {
            border-color:
                rgba(90,255,130,.15);

            background:
                rgba(70,255,115,.035);
        }


        .leaderboard-position {
            color:
                #5cff83;

            font-size:
                13px;

            font-weight:
                900;
        }


        .leaderboard-name {
            overflow:
                hidden;

            color:
                #dce4df;

            font-size:
                13px;

            font-weight:
                800;

            text-overflow:
                ellipsis;

            white-space:
                nowrap;
        }


        .leaderboard-score {
            color:
                #5cff83;

            text-align:
                right;

            font-size:
                18px;

            font-weight:
                900;
        }


        .leaderboard-loading,
        .leaderboard-empty {
            padding:
                30px;

            text-align:
                center;

            color:
                #77847e;

            font-size:
                12px;
        }


        @media (max-width: 600px) {

            .score-submit-panel,
            .leaderboard-panel {
                padding:
                    22px 14px;
            }


            .nickname-row {
                flex-direction:
                    column;
            }


            #submitScoreButton {
                width:
                    100%;
            }


            .leaderboard-row {
                grid-template-columns:
                    38px 1fr 65px;

                padding:
                    0 12px;
            }

        }

        `;


    document.head.appendChild(
        style
    );

}



/* =========================================================
   SHOW SCORE SUBMIT PANEL
========================================================= */

function showSubmitPanel() {

    const panel =
        document.getElementById(
            "scoreSubmitPanel"
        );


    const finalScore =
        document.getElementById(
            "finalScore"
        );


    const nickname =
        document.getElementById(
            "playerNickname"
        );


    const status =
        document.getElementById(
            "submitStatus"
        );


    const button =
        document.getElementById(
            "submitScoreButton"
        );



    if (
        !panel
    ) {

        return;

    }



    panel.style.display =
        "block";


    finalScore.textContent =
        score;


    status.textContent =
        "";


    nickname.value =
        "";


    button.disabled =
        false;


    setTimeout(
        () => {

            nickname.focus();

        },
        100
    );

}



/* =========================================================
   HIDE SCORE PANEL
========================================================= */

function hideSubmitPanel() {

    const panel =
        document.getElementById(
            "scoreSubmitPanel"
        );


    if (
        panel
    ) {

        panel.style.display =
            "none";

    }

}



/* =========================================================
   CLEAN NICKNAME
========================================================= */

function cleanNickname(
    nickname
) {

    return nickname

        .trim()

        .replace(
            /[^a-zA-Z0-9_\- ]/g,
            ""
        )

        .slice(
            0,
            16
        );

}



/* =========================================================
   SUBMIT SCORE
========================================================= */

async function submitScore() {

    if (
        scoreSubmitted
    ) {

        return;

    }



    if (
        gameRunning
    ) {

        return;

    }



    const nicknameInput =
        document.getElementById(
            "playerNickname"
        );


    const submitButton =
        document.getElementById(
            "submitScoreButton"
        );


    const status =
        document.getElementById(
            "submitStatus"
        );



    const nickname =
        cleanNickname(
            nicknameInput.value
        );



    if (
        nickname.length < 2
    ) {

        status.textContent =
            "Nickname must have at least 2 characters.";

        return;

    }



    /*
       Score comes ONLY from
       the game's current score variable.
    */

    const finalGameScore =
        Number(score);



    if (
        !Number.isInteger(
            finalGameScore
        ) ||
        finalGameScore < 0
    ) {

        status.textContent =
            "Invalid score.";

        return;

    }



    submitButton.disabled =
        true;


    status.textContent =
        "Submitting score...";



    try {

        const response =
            await fetch(
                SCORES_API,
                {

                    method:
                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`,

                        "Prefer":
                            "return=minimal"
                    },


                    body:
                        JSON.stringify(
                            {

                                name:
                                    nickname,

                                score:
                                    finalGameScore

                            }
                        )
                }
            );



        if (
            !response.ok
        ) {

            const errorText =
                await response.text();


            throw new Error(
                errorText
            );

        }



        scoreSubmitted =
            true;


        status.textContent =
            "Score submitted!";


        nicknameInput.disabled =
            true;


        submitButton.textContent =
            "SAVED";


        await loadLeaderboard();

    }

    catch (
        error
    ) {

        console.error(
            "Score submit error:",
            error
        );


        status.textContent =
            "Could not submit score. Try again.";


        submitButton.disabled =
            false;

    }

}



/* =========================================================
   LOAD LEADERBOARD
========================================================= */

async function loadLeaderboard() {

    const list =
        document.getElementById(
            "leaderboardList"
        );


    if (
        !list
    ) {

        return;

    }



    list.innerHTML =
        `
        <div class="leaderboard-loading">
            Loading leaderboard...
        </div>
        `;



    try {

        /*
           TOP 10
           highest score first.

           created_at ascending is used
           as a tie breaker.
        */

        const url =
            `${SCORES_API}?select=name,score,created_at&order=score.desc,created_at.asc&limit=10`;



        const response =
            await fetch(
                url,
                {

                    method:
                        "GET",


                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`

                    }

                }
            );



        if (
            !response.ok
        ) {

            const errorText =
                await response.text();


            throw new Error(
                errorText
            );

        }



        const scores =
            await response.json();



        renderLeaderboard(
            scores
        );

    }

    catch (
        error
    ) {

        console.error(
            "Leaderboard error:",
            error
        );


        list.innerHTML =
            `
            <div class="leaderboard-empty">
                Leaderboard unavailable.
            </div>
            `;

    }

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    text
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        String(text);


    return element.innerHTML;

}



/* =========================================================
   RENDER LEADERBOARD
========================================================= */

function renderLeaderboard(
    scores
) {

    const list =
        document.getElementById(
            "leaderboardList"
        );



    if (
        !scores ||
        scores.length === 0
    ) {

        list.innerHTML =
            `
            <div class="leaderboard-empty">
                No scores yet. Be the first.
            </div>
            `;


        return;

    }



    list.innerHTML =
        scores

            .map(
                (
                    item,
                    index
                ) => {

                    const position =
                        index + 1;


                    const safeName =
                        escapeHTML(
                            item.name
                        );


                    const safeScore =
                        Number(
                            item.score
                        ) || 0;


                    return `
                    
                    <div class="
                        leaderboard-row
                        ${position <= 3 ? "top-three" : ""}
                    ">

                        <div class="leaderboard-position">
                            #${position}
                        </div>

                        <div class="leaderboard-name">
                            ${safeName}
                        </div>

                        <div class="leaderboard-score">
                            ${safeScore}
                        </div>

                    </div>

                    `;

                }
            )

            .join("");

}



/* =========================================================
   START BUTTON
========================================================= */

startButton.addEventListener(
    "click",
    startGame
);



/* =========================================================
   INITIALIZATION
========================================================= */

function initializeGame() {

    drawBackground();


    drawPlayer();


    createLeaderboardUI();

}



initializeGame();