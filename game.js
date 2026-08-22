const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startGame");
const scoreElement = document.getElementById("gameScore");
const livesElement = document.getElementById("gameLives");
const gameMessage = document.getElementById("gameMessage");

const leftButton = document.getElementById("moveLeft");
const rightButton = document.getElementById("moveRight");


/* =========================================
   CANVAS
========================================= */

const GAME_WIDTH = 900;
const GAME_HEIGHT = 560;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;


/* =========================================
   GAME STATE
========================================= */

let gameRunning = false;

let score = 0;
let lives = 3;

let fallingCoins = [];

let lastSpawn = 0;

let spawnInterval = 1000;

let fallSpeed = 2.8;


/* =========================================
   CONTROLS
========================================= */

const keys = {
    left: false,
    right: false
};


/* =========================================
   PLAYER
========================================= */

const player = {
    x: GAME_WIDTH / 2 - 40,
    y: GAME_HEIGHT - 125,

    width: 80,
    height: 115,

    speed: 10
};


/* =========================================
   IMAGES
========================================= */

const images = {};


/* PLAYER */

images.player = new Image();
images.player.src = "gremble3.png";


/* GREMBLECOIN */

images.gremblecoin = new Image();
images.gremblecoin.src = "gremblecoin.png";


/* BAD COINS */

images.bitcoin = new Image();
images.bitcoin.src = "bitcoin.png";

images.ethereum = new Image();
images.ethereum.src = "ethereum.png";

images.solana = new Image();
images.solana.src = "solana.png";

images.dogecoin = new Image();
images.dogecoin.src = "dogecoin.png";

images.pepe = new Image();
images.pepe.src = "pepe.png";

images.shiba = new Image();
images.shiba.src = "shiba.png";


/* =========================================
   COIN TYPES
========================================= */

const goodCoin = {
    name: "GREMBLE",
    image: images.gremblecoin,
    good: true
};


const badCoins = [

    {
        name: "BITCOIN",
        image: images.bitcoin,
        good: false
    },

    {
        name: "ETHEREUM",
        image: images.ethereum,
        good: false
    },

    {
        name: "SOLANA",
        image: images.solana,
        good: false
    },

    {
        name: "DOGECOIN",
        image: images.dogecoin,
        good: false
    },

    {
        name: "PEPE",
        image: images.pepe,
        good: false
    },

    {
        name: "SHIBA",
        image: images.shiba,
        good: false
    }

];


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener("keydown", (event) => {

    const key = event.key.toLowerCase();


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

});


document.addEventListener("keyup", (event) => {

    const key = event.key.toLowerCase();


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

});


/* =========================================
   MOBILE CONTROLS
========================================= */

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


/* LEFT */

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


/* RIGHT */

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


/* =========================================
   SPAWN COIN
========================================= */

function spawnCoin() {

    const chance = Math.random();

    let coinType;


    /*
       60% GREMBLECOIN
       40% OTHER COINS
    */

    if (chance < 0.60) {

        coinType = goodCoin;

    } else {

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
            (GAME_WIDTH - size),

        y:
            -size - 120,

        width:
            size,

        height:
            size,

        speed:
            fallSpeed +
            Math.random() * 1.3,

        type:
            coinType

    });

}


/* =========================================
   PLAYER MOVEMENT
========================================= */

function updatePlayer() {

    if (keys.left) {

        player.x -=
            player.speed;

    }


    if (keys.right) {

        player.x +=
            player.speed;

    }


    if (player.x < 0) {

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


/* =========================================
   COLLISION
========================================= */

function collision(player, coin) {

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


    const padding = 7;


    return (

        playerHitbox.x <
        coin.x +
        coin.width -
        padding

        &&

        playerHitbox.x +
        playerHitbox.width >
        coin.x +
        padding

        &&

        playerHitbox.y <
        coin.y +
        coin.height -
        padding

        &&

        playerHitbox.y +
        playerHitbox.height >
        coin.y +
        padding

    );

}


/* =========================================
   UPDATE COINS
========================================= */

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


        if (
            collision(
                player,
                coin
            )
        ) {

            if (
                coin.type.good
            ) {

                score++;

                scoreElement.textContent =
                    score;


                increaseDifficulty();

            } else {

                lives--;

                livesElement.textContent =
                    lives;


                flashDamage();


                if (
                    lives <= 0
                ) {

                    fallingCoins.splice(
                        i,
                        1
                    );


                    endGame();


                    return;

                }

            }


            fallingCoins.splice(
                i,
                1
            );


            continue;

        }


        if (
            coin.y >
            GAME_HEIGHT + 100
        ) {

            fallingCoins.splice(
                i,
                1
            );

        }

    }

}


/* =========================================
   DIFFICULTY
========================================= */

function increaseDifficulty() {

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


/* =========================================
   DAMAGE EFFECT
========================================= */

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
        170
    );

}


/* =========================================
   BACKGROUND
========================================= */

function drawBackground() {

    ctx.clearRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /* =====================================
       DARK GREEN SPACE BACKGROUND
    ===================================== */

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
        0.45,
        "#021b13"
    );


    gradient.addColorStop(
        0.78,
        "#032719"
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


    /* =====================================
       CENTER GREEN ATMOSPHERE
    ===================================== */

    const centerGlow =
        ctx.createRadialGradient(
            GAME_WIDTH / 2,
            GAME_HEIGHT * 0.65,
            10,

            GAME_WIDTH / 2,
            GAME_HEIGHT * 0.65,
            430
        );


    centerGlow.addColorStop(
        0,
        "rgba(0,255,110,0.13)"
    );


    centerGlow.addColorStop(
        0.45,
        "rgba(0,180,85,0.05)"
    );


    centerGlow.addColorStop(
        1,
        "rgba(0,120,60,0)"
    );


    ctx.fillStyle =
        centerGlow;


    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /* =====================================
       STARS
    ===================================== */

    for (
        let i = 0;
        i < 90;
        i++
    ) {

        const x =
            (i * 137 + 23) %
            GAME_WIDTH;


        const y =
            (i * 83 + 41) %
            (GAME_HEIGHT - 90);


        if (
            i % 5 === 0
        ) {

            ctx.fillStyle =
                "rgba(110,255,150,0.75)";

        } else {

            ctx.fillStyle =
                "rgba(255,255,255,0.22)";

        }


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


    /* =====================================
       BRIGHT STARS
    ===================================== */

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
        star => {

            const x = star[0];
            const y = star[1];


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


    /* =====================================
       FLOOR POSITION
    ===================================== */

    const horizonY =
        GAME_HEIGHT - 72;


    const floorBottom =
        GAME_HEIGHT;


    /* =====================================
       FLOOR GLOW
    ===================================== */

    const floorGlow =
        ctx.createLinearGradient(
            0,
            horizonY - 55,
            0,
            floorBottom
        );


    floorGlow.addColorStop(
        0,
        "rgba(0,255,100,0)"
    );


    floorGlow.addColorStop(
        0.45,
        "rgba(0,255,100,0.06)"
    );


    floorGlow.addColorStop(
        1,
        "rgba(0,255,100,0.12)"
    );


    ctx.fillStyle =
        floorGlow;


    ctx.fillRect(
        0,
        horizonY - 55,
        GAME_WIDTH,
        floorBottom -
        horizonY +
        55
    );


    /* =====================================
       HORIZON NEON LINE
    ===================================== */

    ctx.save();


    ctx.strokeStyle =
        "rgba(70,255,110,0.90)";


    ctx.shadowColor =
        "#39ff74";


    ctx.shadowBlur =
        20;


    ctx.lineWidth =
        1.4;


    ctx.beginPath();


    ctx.moveTo(
        0,
        horizonY
    );


    ctx.lineTo(
        GAME_WIDTH,
        horizonY
    );


    ctx.stroke();


    ctx.restore();


    /* =====================================
       HORIZONTAL FLOOR GRID
    ===================================== */

    ctx.save();


    ctx.strokeStyle =
        "rgba(45,255,100,0.22)";


    ctx.lineWidth =
        1;


    const horizontalLines = 7;


    for (
        let i = 1;
        i <= horizontalLines;
        i++
    ) {

        const progress =
            i /
            horizontalLines;


        const curvedProgress =
            progress *
            progress;


        const y =
            horizonY +
            curvedProgress *
            (
                floorBottom -
                horizonY
            );


        ctx.beginPath();


        ctx.moveTo(
            0,
            y
        );


        ctx.lineTo(
            GAME_WIDTH,
            y
        );


        ctx.stroke();

    }


    ctx.restore();


    /* =====================================
       VERTICAL PERSPECTIVE GRID
    ===================================== */

    ctx.save();


    ctx.strokeStyle =
        "rgba(45,255,100,0.22)";


    ctx.lineWidth =
        1;


    const vanishingX =
        GAME_WIDTH / 2;


    const columns =
        18;


    for (
        let i = 0;
        i <= columns;
        i++
    ) {

        const bottomX =
            (
                GAME_WIDTH /
                columns
            ) * i;


        ctx.beginPath();


        ctx.moveTo(
            vanishingX,
            horizonY
        );


        ctx.lineTo(
            bottomX,
            floorBottom
        );


        ctx.stroke();

    }


    ctx.restore();


    /* =====================================
       STRONG CENTER PLATFORM GLOW
    ===================================== */

    ctx.save();


    const platformGlow =
        ctx.createRadialGradient(
            GAME_WIDTH / 2,
            horizonY + 8,
            10,

            GAME_WIDTH / 2,
            horizonY + 8,
            240
        );


    platformGlow.addColorStop(
        0,
        "rgba(80,255,110,0.30)"
    );


    platformGlow.addColorStop(
        0.35,
        "rgba(25,255,100,0.12)"
    );


    platformGlow.addColorStop(
        1,
        "rgba(0,255,100,0)"
    );


    ctx.fillStyle =
        platformGlow;


    ctx.fillRect(
        GAME_WIDTH / 2 - 260,
        horizonY - 60,
        520,
        120
    );


    ctx.restore();

}


/* =========================================
   DRAW PLAYER
========================================= */

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


/* =========================================
   DRAW COIN TRAIL
========================================= */

function drawCoinTrail(coin) {

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
        coin.width * 0.72;


    /*
       GREMBLECOIN = GREEN
       OTHERS = RED
    */

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


    /* =====================================
       MAIN CONE LIGHT
    ===================================== */

    ctx.save();


    const gradient =
        ctx.createLinearGradient(
            centerX,
            coinTop - trailHeight,
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
        coinTop - trailHeight
    );


    ctx.lineTo(
        centerX + 2,
        coinTop - trailHeight
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


    /* =====================================
       INNER LIGHT
    ===================================== */

    ctx.save();


    const innerHeight =
        trailHeight * 0.82;


    const innerGradient =
        ctx.createLinearGradient(
            centerX,
            coinTop - innerHeight,
            centerX,
            coinTop
        );


    innerGradient.addColorStop(
        0,
        colors.transparent
    );


    innerGradient.addColorStop(
        0.65,
        colors.soft
    );


    innerGradient.addColorStop(
        1,
        colors.strong
    );


    ctx.fillStyle =
        innerGradient;


    ctx.beginPath();


    ctx.moveTo(
        centerX - 1,
        coinTop - innerHeight
    );


    ctx.lineTo(
        centerX + 1,
        coinTop - innerHeight
    );


    ctx.lineTo(
        centerX +
        coin.width * 0.18,
        coinTop
    );


    ctx.lineTo(
        centerX -
        coin.width * 0.18,
        coinTop
    );


    ctx.closePath();


    ctx.fill();


    ctx.restore();


    /* =====================================
       THIN LIGHT STREAKS
    ===================================== */

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
                (streaks - 1);


        const offset =
            (normalized - 0.5) *
            coin.width *
            0.48;


        const streakHeight =
            trailHeight *
            (
                0.35 +
                ((i * 19) % 45) /
                100
            );


        const x =
            centerX +
            offset;


        const streakGradient =
            ctx.createLinearGradient(
                x,
                coinTop - streakHeight,
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


    /* =====================================
       GLOW DIRECTLY ABOVE COIN
    ===================================== */

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


/* =========================================
   DRAW COINS
========================================= */

function drawCoins() {

    fallingCoins.forEach(
        coin => {

            const image =
                coin.type.image;


            if (
                !image.complete ||
                image.naturalWidth === 0
            ) {

                return;

            }


            /*
               LIGHT BEHIND COIN
            */

            drawCoinTrail(
                coin
            );


            /*
               COIN PNG
            */

            ctx.save();


            if (
                coin.type.good
            ) {

                ctx.shadowColor =
                    "rgba(70,255,130,0.80)";


                ctx.shadowBlur =
                    24;

            } else {

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


/* =========================================
   GAME LOOP
========================================= */

function gameLoop(timestamp) {

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


    drawBackground();


    drawCoins();


    drawPlayer();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================
   START GAME
========================================= */

function startGame() {

    score = 0;

    lives = 3;


    fallingCoins = [];


    fallSpeed =
        2.8;


    spawnInterval =
        1000;


    player.x =
        GAME_WIDTH / 2 -
        player.width / 2;


    scoreElement.textContent =
        score;


    livesElement.textContent =
        lives;


    gameMessage.innerHTML =
        `
        Catch
        <strong>GrembleCoin</strong>.
        Avoid every other coin.
        `;


    gameRunning =
        true;


    startButton.textContent =
        "RESTART GAME";


    lastSpawn =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================
   GAME OVER
========================================= */

function endGame() {

    gameRunning =
        false;


    gameMessage.innerHTML =
        `
        GAME OVER —
        SCORE:
        <strong>${score}</strong>
        `;


    startButton.textContent =
        "PLAY AGAIN";

}


/* =========================================
   START BUTTON
========================================= */

startButton.addEventListener(
    "click",
    startGame
);


/* =========================================
   INITIAL SCREEN
========================================= */

function drawInitialScreen() {

    drawBackground();

    drawPlayer();

}


drawInitialScreen();