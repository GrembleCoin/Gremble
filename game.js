/* =========================================================
   GREMBLE COIN CATCH
   GAME + SUPABASE LEADERBOARD
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const COIN_SUPABASE_URL =
    "https://tffzjqeckoezursrvcpw.supabase.co";

const COIN_SUPABASE_KEY =
    "sb_publishable_MFdYqNoOg1FEx-6PSjJwjQ_oCIo94ME";

const COIN_SCORES_API =
    `${COIN_SUPABASE_URL}/rest/v1/scores`;



/* =========================================================
   HTML
========================================================= */

const gameCanvas =
    document.getElementById("gameCanvas");

const gameCtx =
    gameCanvas.getContext("2d");

const startGameButton =
    document.getElementById("startGame");

const gameScoreElement =
    document.getElementById("gameScore");

const gameLivesElement =
    document.getElementById("gameLives");

const gameMessage =
    document.getElementById("gameMessage");

const moveLeftButton =
    document.getElementById("moveLeft");

const moveRightButton =
    document.getElementById("moveRight");



/* =========================================================
   CANVAS
========================================================= */

const GAME_WIDTH = 900;
const GAME_HEIGHT = 560;

gameCanvas.width = GAME_WIDTH;
gameCanvas.height = GAME_HEIGHT;



/* =========================================================
   GAME STATE
========================================================= */

let gameRunning = false;

let gameFrame = null;

let gameScore = 0;
let gameLives = 3;

let gameObjects = [];

let gameLastSpawn = 0;

let gameSpawnInterval = 850;

let gameBaseFallSpeed = 3.8;

let gameScoreSubmitted = false;

let finalCoinScore = 0;



/* =========================================================
   INPUT STATE
========================================================= */

const gameKeys = {
    left: false,
    right: false
};



/* =========================================================
   IGNORE GAME KEYS WHILE TYPING
========================================================= */

function isTypingInField(target) {

    if (!target) {
        return false;
    }

    return (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
    );
}



/* =========================================================
   IMAGES
========================================================= */

const coinGameImages = {};


coinGameImages.player =
    new Image();

coinGameImages.player.src =
    "gremble3.png";


coinGameImages.gremblecoin =
    new Image();

coinGameImages.gremblecoin.src =
    "gremblecoin.png";


coinGameImages.bitcoin =
    new Image();

coinGameImages.bitcoin.src =
    "bitcoin.png";


coinGameImages.ethereum =
    new Image();

coinGameImages.ethereum.src =
    "ethereum.png";


coinGameImages.solana =
    new Image();

coinGameImages.solana.src =
    "solana.png";


coinGameImages.dogecoin =
    new Image();

coinGameImages.dogecoin.src =
    "dogecoin.png";


coinGameImages.pepe =
    new Image();

coinGameImages.pepe.src =
    "pepe.png";


coinGameImages.shiba =
    new Image();

coinGameImages.shiba.src =
    "shiba.png";



/* =========================================================
   COIN TYPES
========================================================= */

const badCoinTypes = [

    {
        name: "BITCOIN",
        image: coinGameImages.bitcoin
    },

    {
        name: "ETHEREUM",
        image: coinGameImages.ethereum
    },

    {
        name: "SOLANA",
        image: coinGameImages.solana
    },

    {
        name: "DOGECOIN",
        image: coinGameImages.dogecoin
    },

    {
        name: "PEPE",
        image: coinGameImages.pepe
    },

    {
        name: "SHIBA",
        image: coinGameImages.shiba
    }

];



/* =========================================================
   PLAYER
========================================================= */

const coinPlayer = {

    width: 64,
    height: 90,

    x:
        GAME_WIDTH / 2 - 32,

    y:
        GAME_HEIGHT - 112,

    speed:
        9.5

};



/* =========================================================
   FLOOR
========================================================= */

const COIN_FLOOR_Y =
    GAME_HEIGHT - 20;



/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            isTypingInField(
                event.target
            )
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            gameKeys.left =
                true;

            event.preventDefault();

        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            gameKeys.right =
                true;

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        if (
            isTypingInField(
                event.target
            )
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            gameKeys.left =
                false;

        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            gameKeys.right =
                false;

        }

    }
);



/* =========================================================
   MOBILE BUTTONS
========================================================= */

function holdLeftStart(event) {

    event.preventDefault();

    gameKeys.left =
        true;

}


function holdLeftEnd(event) {

    event.preventDefault();

    gameKeys.left =
        false;

}


function holdRightStart(event) {

    event.preventDefault();

    gameKeys.right =
        true;

}


function holdRightEnd(event) {

    event.preventDefault();

    gameKeys.right =
        false;

}


if (moveLeftButton) {

    moveLeftButton.addEventListener(
        "pointerdown",
        holdLeftStart
    );

    moveLeftButton.addEventListener(
        "pointerup",
        holdLeftEnd
    );

    moveLeftButton.addEventListener(
        "pointerleave",
        holdLeftEnd
    );

    moveLeftButton.addEventListener(
        "pointercancel",
        holdLeftEnd
    );

}


if (moveRightButton) {

    moveRightButton.addEventListener(
        "pointerdown",
        holdRightStart
    );

    moveRightButton.addEventListener(
        "pointerup",
        holdRightEnd
    );

    moveRightButton.addEventListener(
        "pointerleave",
        holdRightEnd
    );

    moveRightButton.addEventListener(
        "pointercancel",
        holdRightEnd
    );

}



/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updateCoinPlayer() {

    if (gameKeys.left) {

        coinPlayer.x -=
            coinPlayer.speed;

    }


    if (gameKeys.right) {

        coinPlayer.x +=
            coinPlayer.speed;

    }


    coinPlayer.x =
        Math.max(
            10,
            Math.min(
                GAME_WIDTH -
                coinPlayer.width -
                10,

                coinPlayer.x
            )
        );

}



/* =========================================================
   SPAWN
========================================================= */

function spawnCoinObject() {

    const isGremble =
        Math.random() <
        0.35;


    const size =
        isGremble
            ? 55
            : 52 +
              Math.random() *
              9;


    let image;
    let name;


    if (isGremble) {

        image =
            coinGameImages.gremblecoin;

        name =
            "GREMBLECOIN";

    }

    else {

        const bad =
            badCoinTypes[
                Math.floor(
                    Math.random() *
                    badCoinTypes.length
                )
            ];


        image =
            bad.image;

        name =
            bad.name;

    }


    const difficulty =
        1 +
        gameScore *
        0.012;


    const speed =
        Math.min(
            11,

            gameBaseFallSpeed +
            difficulty +
            Math.random() *
            1.25
        );


    gameObjects.push({

        x:
            20 +
            Math.random() *
            (
                GAME_WIDTH -
                size -
                40
            ),

        y:
            -size -
            80,

        width:
            size,

        height:
            size,

        speed,

        image,

        isGremble,

        name

    });

}



/* =========================================================
   COLLISION
========================================================= */

function coinCollision(
    player,
    coin
) {

    const playerXPadding =
        8;

    const playerYPadding =
        7;

    const coinPadding =
        5;


    return (

        player.x +
        playerXPadding <
        coin.x +
        coin.width -
        coinPadding

        &&

        player.x +
        player.width -
        playerXPadding >
        coin.x +
        coinPadding

        &&

        player.y +
        playerYPadding <
        coin.y +
        coin.height -
        coinPadding

        &&

        player.y +
        player.height -
        playerYPadding >
        coin.y +
        coinPadding

    );

}



/* =========================================================
   LOSE LIFE
========================================================= */

function loseCoinLife(
    message
) {

    if (!gameRunning) {
        return;
    }


    gameLives--;


    gameLivesElement.textContent =
        gameLives;


    gameMessage.textContent =
        message;


    gameCanvas.classList.add(
        "damage"
    );


    setTimeout(
        () => {

            gameCanvas.classList.remove(
                "damage"
            );

        },
        160
    );


    if (
        gameLives <= 0
    ) {

        endCoinGame();

    }

}



/* =========================================================
   UPDATE OBJECTS
========================================================= */

function updateGameObjects() {

    for (
        let i =
            gameObjects.length - 1;

        i >= 0;

        i--
    ) {

        const coin =
            gameObjects[i];


        coin.y +=
            coin.speed;


        if (
            coinCollision(
                coinPlayer,
                coin
            )
        ) {

            gameObjects.splice(
                i,
                1
            );


            if (coin.isGremble) {

                gameScore++;


                gameScoreElement.textContent =
                    gameScore;


                gameMessage.innerHTML =
                    `GREMBLECOIN <strong>+1</strong>`;

            }

            else {

                loseCoinLife(
                    `${coin.name}! YOU LOST A LIFE.`
                );

            }


            continue;

        }


        if (
            coin.y >
            GAME_HEIGHT +
            coin.height
        ) {

            gameObjects.splice(
                i,
                1
            );


            if (coin.isGremble) {

                loseCoinLife(
                    "YOU MISSED GREMBLECOIN!"
                );

            }

        }

    }

}



/* =========================================================
   BACKGROUND
========================================================= */

function drawCoinBackground() {

    const gradient =
        gameCtx.createLinearGradient(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );


    gradient.addColorStop(
        0,
        "#00100a"
    );


    gradient.addColorStop(
        0.55,
        "#002819"
    );


    gradient.addColorStop(
        1,
        "#00120c"
    );


    gameCtx.fillStyle =
        gradient;


    gameCtx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const x =
            (
                i *
                137 +
                19
            ) %
            GAME_WIDTH;


        const y =
            (
                i *
                83 +
                27
            ) %
            (
                GAME_HEIGHT -
                50
            );


        gameCtx.fillStyle =
            i % 8 === 0

                ? "rgba(90,255,130,.75)"

                : "rgba(255,255,255,.17)";


        const size =
            i % 11 === 0
                ? 2
                : 1;


        gameCtx.fillRect(
            x,
            y,
            size,
            size
        );

    }


    gameCtx.save();


    gameCtx.strokeStyle =
        "#41ff79";


    gameCtx.shadowColor =
        "#41ff79";


    gameCtx.shadowBlur =
        14;


    gameCtx.lineWidth =
        2;


    gameCtx.beginPath();


    gameCtx.moveTo(
        0,
        COIN_FLOOR_Y
    );


    gameCtx.lineTo(
        GAME_WIDTH,
        COIN_FLOOR_Y
    );


    gameCtx.stroke();


    gameCtx.restore();

}



/* =========================================================
   TRAIL
========================================================= */

function drawCoinTrail(
    coin
) {

    const centerX =
        coin.x +
        coin.width /
        2;


    const trailHeight =
        115;


    const gradient =
        gameCtx.createLinearGradient(
            centerX,
            coin.y -
            trailHeight,

            centerX,
            coin.y
        );


    if (coin.isGremble) {

        gradient.addColorStop(
            0,
            "rgba(50,255,110,0)"
        );


        gradient.addColorStop(
            0.5,
            "rgba(50,255,110,.14)"
        );


        gradient.addColorStop(
            1,
            "rgba(70,255,120,.65)"
        );

    }

    else {

        gradient.addColorStop(
            0,
            "rgba(255,60,70,0)"
        );


        gradient.addColorStop(
            0.5,
            "rgba(255,60,70,.10)"
        );


        gradient.addColorStop(
            1,
            "rgba(255,60,70,.38)"
        );

    }


    gameCtx.save();


    gameCtx.fillStyle =
        gradient;


    gameCtx.beginPath();


    gameCtx.moveTo(
        centerX,
        coin.y -
        trailHeight
    );


    gameCtx.lineTo(
        coin.x +
        coin.width *
        0.78,

        coin.y +
        4
    );


    gameCtx.lineTo(
        coin.x +
        coin.width *
        0.22,

        coin.y +
        4
    );


    gameCtx.closePath();


    gameCtx.fill();


    gameCtx.restore();

}



/* =========================================================
   DRAW OBJECTS
========================================================= */

function drawGameObjects() {

    gameObjects.forEach(
        coin => {

            drawCoinTrail(
                coin
            );


            if (
                !coin.image.complete ||
                coin.image.naturalWidth === 0
            ) {

                return;

            }


            gameCtx.save();


            gameCtx.shadowColor =
                coin.isGremble

                    ? "rgba(70,255,120,.95)"

                    : "rgba(255,60,60,.48)";


            gameCtx.shadowBlur =
                coin.isGremble
                    ? 25
                    : 15;


            gameCtx.drawImage(
                coin.image,

                coin.x,
                coin.y,

                coin.width,
                coin.height
            );


            gameCtx.restore();

        }
    );

}



/* =========================================================
   DRAW PLAYER
========================================================= */

function drawCoinPlayer() {

    if (
        !coinGameImages.player.complete ||
        coinGameImages.player.naturalWidth === 0
    ) {

        return;

    }


    gameCtx.save();


    gameCtx.shadowColor =
        "rgba(60,255,120,.32)";


    gameCtx.shadowBlur =
        18;


    gameCtx.drawImage(
        coinGameImages.player,

        coinPlayer.x,
        coinPlayer.y,

        coinPlayer.width,
        coinPlayer.height
    );


    gameCtx.restore();

}



/* =========================================================
   DIFFICULTY
========================================================= */

function updateCoinDifficulty() {

    gameSpawnInterval =
        Math.max(
            320,

            850 -
            gameScore *
            12
        );

}



/* =========================================================
   GAME LOOP
========================================================= */

function coinGameLoop(
    timestamp
) {

    if (!gameRunning) {
        return;
    }


    updateCoinPlayer();


    updateCoinDifficulty();


    if (
        timestamp -
        gameLastSpawn >
        gameSpawnInterval
    ) {

        spawnCoinObject();


        gameLastSpawn =
            timestamp;

    }


    updateGameObjects();


    drawCoinBackground();


    drawGameObjects();


    drawCoinPlayer();


    gameFrame =
        requestAnimationFrame(
            coinGameLoop
        );

}



/* =========================================================
   START GAME
========================================================= */

function startCoinGame() {

    if (gameFrame) {

        cancelAnimationFrame(
            gameFrame
        );

    }


    gameRunning =
        true;


    gameScore =
        0;


    gameLives =
        3;


    gameObjects =
        [];


    gameSpawnInterval =
        850;


    gameScoreSubmitted =
        false;


    coinPlayer.x =
        GAME_WIDTH /
        2 -
        coinPlayer.width /
        2;


    coinPlayer.y =
        GAME_HEIGHT -
        coinPlayer.height -
        20;


    gameKeys.left =
        false;


    gameKeys.right =
        false;


    gameScoreElement.textContent =
        "0";


    gameLivesElement.textContent =
        "3";


    gameMessage.innerHTML =
        `Catch every <strong>GrembleCoin</strong>. Avoid every other coin.`;


    startGameButton.textContent =
        "RESTART GAME";


    hideCoinSubmitPanel();


    gameLastSpawn =
        performance.now();


    gameFrame =
        requestAnimationFrame(
            coinGameLoop
        );

}



/* =========================================================
   GAME OVER
========================================================= */

function endCoinGame() {

    if (!gameRunning) {
        return;
    }


    gameRunning =
        false;


    gameKeys.left =
        false;


    gameKeys.right =
        false;


    if (gameFrame) {

        cancelAnimationFrame(
            gameFrame
        );


        gameFrame =
            null;

    }


    finalCoinScore =
        gameScore;


    gameMessage.innerHTML =
        `GAME OVER — SCORE <strong>${finalCoinScore}</strong>`;


    startGameButton.textContent =
        "PLAY AGAIN";


    showCoinSubmitPanel();

}



/* =========================================================
   TELEGRAM USERNAME
========================================================= */

function cleanCoinTelegramUsername(
    value
) {

    return value
        .trim()
        .replace(
            /^@/,
            ""
        )
        .replace(
            /[^a-zA-Z0-9_]/g,
            ""
        )
        .slice(
            0,
            32
        );

}



/* =========================================================
   CREATE LEADERBOARD UI
========================================================= */

function createCoinLeaderboardUI() {

    const wrapper =
        document.querySelector(
            ".game-wrapper"
        );


    if (!wrapper) {
        return;
    }


    if (
        document.getElementById(
            "coinLeaderboardSection"
        )
    ) {
        return;
    }


    const section =
        document.createElement(
            "div"
        );


    section.id =
        "coinLeaderboardSection";


    section.innerHTML =
        `

        <div
            id="coinSubmitPanel"
            class="coin-submit-panel"
        >

            <div class="coin-submit-label">
                GAME OVER
            </div>


            <h3>
                YOUR SCORE:
                <strong id="coinFinalScore">
                    0
                </strong>
            </h3>


            <div class="coin-submit-row">

                <input
                    id="coinNickname"
                    type="text"
                    maxlength="32"
                    placeholder="TELEGRAM USERNAME"
                    autocomplete="off"
                >


                <button
                    id="coinSubmitScore"
                    type="button"
                >
                    SUBMIT SCORE
                </button>

            </div>


            <p class="coin-telegram-note">
                Enter your Telegram username so we can contact you
                if your score wins a competition.
            </p>


            <div
                id="coinSubmitStatus"
                class="coin-submit-status"
            ></div>

        </div>



        <div class="coin-leaderboard">

            <div class="coin-leaderboard-head">

                <div>

                    <span>
                        GREMBLE ARCADE
                    </span>

                    <h3>
                        TOP PLAYERS
                    </h3>

                </div>


                <button
                    id="coinRefreshLeaderboard"
                    type="button"
                    aria-label="Refresh leaderboard"
                >
                    ↻
                </button>

            </div>


            <div
                id="coinLeaderboardList"
                class="coin-leaderboard-list"
            >

                <div class="coin-board-empty">
                    Loading leaderboard...
                </div>

            </div>

        </div>

        `;


    wrapper.appendChild(
        section
    );


    addCoinLeaderboardStyles();


    const input =
        document.getElementById(
            "coinNickname"
        );


    input.addEventListener(
        "keydown",
        event => {

            event.stopPropagation();


            if (
                event.key ===
                "Enter"
            ) {

                submitCoinScore();

            }

        }
    );


    input.addEventListener(
        "keyup",
        event => {

            event.stopPropagation();

        }
    );


    document
        .getElementById(
            "coinSubmitScore"
        )
        .addEventListener(
            "click",
            submitCoinScore
        );


    document
        .getElementById(
            "coinRefreshLeaderboard"
        )
        .addEventListener(
            "click",
            loadCoinLeaderboard
        );


    hideCoinSubmitPanel();


    loadCoinLeaderboard();

}



/* =========================================================
   LEADERBOARD CSS
========================================================= */

function addCoinLeaderboardStyles() {

    if (
        document.getElementById(
            "coinLeaderboardStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "coinLeaderboardStyles";


    style.textContent =
        `

        #coinLeaderboardSection {
            border-top:
                1px solid
                rgba(80,255,130,.14);

            background:
                #010806;
        }


        .coin-submit-panel {
            display:
                none;

            padding:
                32px;

            text-align:
                center;

            border-bottom:
                1px solid
                rgba(80,255,130,.12);
        }


        .coin-submit-label {
            margin-bottom:
                9px;

            color:
                #61ff82;

            font-size:
                9px;

            font-weight:
                900;

            letter-spacing:
                3px;
        }


        .coin-submit-panel h3 {
            margin-bottom:
                22px;

            font-size:
                18px;

            color:
                #9aa69f;
        }


        .coin-submit-panel h3 strong {
            margin-left:
                6px;

            color:
                #62ff82;

            font-size:
                25px;
        }


        .coin-submit-row {
            width:
                min(570px,100%);

            margin:
                0 auto;

            display:
                flex;

            gap:
                10px;
        }


        #coinNickname {
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
                rgba(80,255,130,.24);

            border-radius:
                12px;

            background:
                #03120d;

            color:
                white;

            font-weight:
                800;

            letter-spacing:
                1px;
        }


        #coinNickname:focus {
            border-color:
                #62ff82;
        }


        #coinSubmitScore {
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

            cursor:
                pointer;
        }


        #coinSubmitScore:disabled {
            opacity:
                .5;
        }


        .coin-telegram-note {
            width:
                min(570px,100%);

            margin:
                11px auto 0;

            color:
                #708078;

            font-size:
                10px;

            line-height:
                1.5;
        }


        .coin-submit-status {
            min-height:
                17px;

            margin-top:
                10px;

            color:
                #7c8983;

            font-size:
                11px;
        }


        .coin-leaderboard {
            padding:
                32px;
        }


        .coin-leaderboard-head {
            margin-bottom:
                24px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                space-between;
        }


        .coin-leaderboard-head span {
            color:
                #5cff83;

            font-size:
                9px;

            font-weight:
                900;

            letter-spacing:
                3px;
        }


        .coin-leaderboard-head h3 {
            margin-top:
                6px;

            font-size:
                24px;
        }


        #coinRefreshLeaderboard {
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


        .coin-board-row {
            min-height:
                56px;

            margin-bottom:
                7px;

            padding:
                0 16px;

            display:
                grid;

            grid-template-columns:
                60px 1fr 100px;

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


        .coin-board-row.top-three {
            border-color:
                rgba(90,255,130,.15);

            background:
                rgba(70,255,115,.035);
        }


        .coin-board-rank {
            color:
                #5cff83;

            font-size:
                13px;

            font-weight:
                900;
        }


        .coin-board-name {
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


        .coin-board-score {
            color:
                #5cff83;

            text-align:
                right;

            font-size:
                18px;

            font-weight:
                900;
        }


        .coin-board-empty {
            padding:
                35px;

            text-align:
                center;

            color:
                #77847e;

            font-size:
                12px;
        }


        @media (max-width: 600px) {

            .coin-submit-panel,
            .coin-leaderboard {
                padding:
                    22px 14px;
            }


            .coin-submit-row {
                flex-direction:
                    column;
            }


            #coinSubmitScore {
                width:
                    100%;
            }

        }

        `;


    document.head.appendChild(
        style
    );

}



/* =========================================================
   SHOW SUBMIT
========================================================= */

function showCoinSubmitPanel() {

    const panel =
        document.getElementById(
            "coinSubmitPanel"
        );


    if (!panel) {
        return;
    }


    panel.style.display =
        "block";


    document
        .getElementById(
            "coinFinalScore"
        )
        .textContent =
        finalCoinScore;


    const input =
        document.getElementById(
            "coinNickname"
        );


    const button =
        document.getElementById(
            "coinSubmitScore"
        );


    const status =
        document.getElementById(
            "coinSubmitStatus"
        );


    input.value =
        "";


    input.disabled =
        false;


    button.disabled =
        false;


    button.textContent =
        "SUBMIT SCORE";


    status.textContent =
        "";


    setTimeout(
        () => {

            input.focus();

        },
        100
    );

}



/* =========================================================
   HIDE SUBMIT
========================================================= */

function hideCoinSubmitPanel() {

    const panel =
        document.getElementById(
            "coinSubmitPanel"
        );


    if (panel) {

        panel.style.display =
            "none";

    }

}



/* =========================================================
   SUBMIT SCORE
========================================================= */

async function submitCoinScore() {

    if (
        gameScoreSubmitted
    ) {
        return;
    }


    const input =
        document.getElementById(
            "coinNickname"
        );


    const button =
        document.getElementById(
            "coinSubmitScore"
        );


    const status =
        document.getElementById(
            "coinSubmitStatus"
        );


    const name =
        cleanCoinTelegramUsername(
            input.value
        );


    if (
        name.length <
        5
    ) {

        status.textContent =
            "Enter a valid Telegram username.";

        return;

    }


    button.disabled =
        true;


    status.textContent =
        "Submitting score...";


    try {

        const response =
            await fetch(
                COIN_SCORES_API,
                {

                    method:
                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            COIN_SUPABASE_KEY,

                        "Prefer":
                            "return=minimal"

                    },


                    body:
                        JSON.stringify(
                            {

                                name:
                                    name,

                                score:
                                    finalCoinScore

                            }
                        )

                }
            );


        if (!response.ok) {

            const error =
                await response.text();


            console.error(
                "Coin score error:",
                response.status,
                error
            );


            throw new Error(
                error
            );

        }


        gameScoreSubmitted =
            true;


        input.disabled =
            true;


        button.disabled =
            true;


        button.textContent =
            "SAVED";


        status.textContent =
            "Score submitted!";


        await loadCoinLeaderboard();

    }

    catch (error) {

        console.error(
            error
        );


        status.textContent =
            "Could not submit score. Try again.";


        button.disabled =
            false;

    }

}



/* =========================================================
   LOAD LEADERBOARD
========================================================= */

async function loadCoinLeaderboard() {

    const list =
        document.getElementById(
            "coinLeaderboardList"
        );


    if (!list) {
        return;
    }


    list.innerHTML =
        `
        <div class="coin-board-empty">
            Loading leaderboard...
        </div>
        `;


    try {

        const url =
            `${COIN_SCORES_API}?select=name,score,created_at&order=score.desc,created_at.asc&limit=10`;


        const response =
            await fetch(
                url,
                {

                    headers: {

                        "apikey":
                            COIN_SUPABASE_KEY

                    }

                }
            );


        if (!response.ok) {

            throw new Error(
                await response.text()
            );

        }


        const data =
            await response.json();


        renderCoinLeaderboard(
            data
        );

    }

    catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        list.innerHTML =
            `
            <div class="coin-board-empty">
                Leaderboard unavailable.
            </div>
            `;

    }

}



/* =========================================================
   SAFE HTML
========================================================= */

function coinEscapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            text
        );


    return div.innerHTML;

}



/* =========================================================
   RENDER LEADERBOARD
========================================================= */

function renderCoinLeaderboard(
    data
) {

    const list =
        document.getElementById(
            "coinLeaderboardList"
        );


    if (
        !data ||
        data.length === 0
    ) {

        list.innerHTML =
            `
            <div class="coin-board-empty">
                No scores yet. Be the first.
            </div>
            `;


        return;

    }


    list.innerHTML =
        data
            .map(
                (
                    player,
                    index
                ) => {

                    const rank =
                        index + 1;


                    return `

                    <div class="
                        coin-board-row
                        ${rank <= 3 ? "top-three" : ""}
                    ">

                        <div class="coin-board-rank">
                            #${rank}
                        </div>

                        <div class="coin-board-name">
                            @${coinEscapeHTML(player.name)}
                        </div>

                        <div class="coin-board-score">
                            ${Number(player.score) || 0}
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

startGameButton.addEventListener(
    "click",
    startCoinGame
);



/* =========================================================
   INITIALIZE
========================================================= */

function initializeCoinGame() {

    drawCoinBackground();


    drawCoinPlayer();


    createCoinLeaderboardUI();

}


initializeCoinGame();