/* =========================================================
   GREMBLE SURVIVAL
   GAME + SUPABASE LEADERBOARD
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SURVIVAL_SUPABASE_URL =
    "https://tffzjqeckoezursrvcpw.supabase.co";

const SURVIVAL_SUPABASE_KEY =
    "sb_publishable_MFdYqNoOg1FEx-6PSjJwjQ_oCIo94ME";

const SURVIVAL_SCORES_API =
    `${SURVIVAL_SUPABASE_URL}/rest/v1/survival_scores`;



/* =========================================================
   HTML
========================================================= */

const survivalCanvas =
    document.getElementById("survivalCanvas");

const sctx =
    survivalCanvas.getContext("2d");

const survivalStartButton =
    document.getElementById("survivalStart");

const survivalScoreElement =
    document.getElementById("survivalScore");

const survivalTimeElement =
    document.getElementById("survivalTime");

const survivalWaveElement =
    document.getElementById("survivalWave");

const survivalLivesElement =
    document.getElementById("survivalLives");

const survivalMessage =
    document.getElementById("survivalMessage");

const dashStatus =
    document.getElementById("dashStatus");

const upgradeOverlay =
    document.getElementById("upgradeOverlay");

const upgradeChoices =
    document.getElementById("upgradeChoices");



/* =========================================================
   CANVAS
========================================================= */

const SW = 900;
const SH = 600;

survivalCanvas.width = SW;
survivalCanvas.height = SH;



/* =========================================================
   STATE
========================================================= */

let survivalRunning = false;
let survivalPaused = false;

let survivalFrame = null;
let survivalLastFrame = 0;

let survivalStartTime = 0;
let survivalElapsed = 0;

let survivalScore = 0;
let survivalWave = 1;

let enemies = [];
let survivalCoins = [];
let particles = [];

let lastEnemySpawn = 0;
let lastCoinSpawn = 0;

let enemySpawnInterval = 1000;
let coinSpawnInterval = 2600;

let coinsCollected = 0;

let scoreMultiplier = 1;

let enemySpeedMultiplier = 1;

let magnetRadius = 100;

let shieldCount = 0;

let survivalScoreSubmitted = false;

let finalSurvivalScore = 0;
let finalSurvivalTime = 0;
let finalSurvivalWave = 1;



/* =========================================================
   IGNORE GAME KEYS WHILE TYPING
========================================================= */

function survivalIsTyping(
    target
) {

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

const survivalImages = {};


survivalImages.player =
    new Image();

survivalImages.player.src =
    "gremble3.png";


survivalImages.coin =
    new Image();

survivalImages.coin.src =
    "gremblecoin.png";


const enemyFiles = [

    "bitcoin.png",
    "ethereum.png",
    "solana.png",
    "dogecoin.png",
    "pepe.png",
    "shiba.png"

];


survivalImages.enemies =
    enemyFiles.map(
        file => {

            const image =
                new Image();


            image.src =
                file;


            return image;

        }
    );



/* =========================================================
   PLAYER
========================================================= */

const survivalPlayer = {

    x:
        SW / 2,

    y:
        SH / 2,

    width:
        58,

    height:
        78,

    speed:
        4.8,

    lives:
        3,

    maxLives:
        5,

    invulnerableUntil:
        0,

    dashUntil:
        0,

    lastDash:
        -5000,

    dashCooldown:
        2200

};



/* =========================================================
   KEYS
========================================================= */

const survivalKeys = {

    up: false,
    down: false,
    left: false,
    right: false

};



/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            survivalIsTyping(
                event.target
            )
        ) {
            return;
        }


        if (
            !survivalRunning ||
            survivalPaused
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            survivalKeys.up =
                true;

            event.preventDefault();

        }


        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            survivalKeys.down =
                true;

            event.preventDefault();

        }


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            survivalKeys.left =
                true;

            event.preventDefault();

        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            survivalKeys.right =
                true;

            event.preventDefault();

        }


        if (
            event.code === "Space"
        ) {

            survivalDash();


            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        if (
            survivalIsTyping(
                event.target
            )
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            event.key === "ArrowUp"
        ) {

            survivalKeys.up =
                false;

        }


        if (
            key === "s" ||
            event.key === "ArrowDown"
        ) {

            survivalKeys.down =
                false;

        }


        if (
            key === "a" ||
            event.key === "ArrowLeft"
        ) {

            survivalKeys.left =
                false;

        }


        if (
            key === "d" ||
            event.key === "ArrowRight"
        ) {

            survivalKeys.right =
                false;

        }

    }
);



/* =========================================================
   DASH
========================================================= */

function survivalDash() {

    if (
        !survivalRunning ||
        survivalPaused
    ) {
        return;
    }


    const now =
        performance.now();


    if (
        now -
        survivalPlayer.lastDash <
        survivalPlayer.dashCooldown
    ) {
        return;
    }


    survivalPlayer.lastDash =
        now;


    survivalPlayer.dashUntil =
        now +
        220;


    dashStatus.textContent =
        "DASHING";

}



/* =========================================================
   MOVEMENT
========================================================= */

function updateSurvivalPlayer(
    delta,
    now
) {

    let dx = 0;
    let dy = 0;


    if (survivalKeys.left) {
        dx--;
    }


    if (survivalKeys.right) {
        dx++;
    }


    if (survivalKeys.up) {
        dy--;
    }


    if (survivalKeys.down) {
        dy++;
    }


    if (
        dx !== 0 ||
        dy !== 0
    ) {

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        dx /=
            length;


        dy /=
            length;

    }


    let speed =
        survivalPlayer.speed;


    if (
        now <
        survivalPlayer.dashUntil
    ) {

        speed *=
            3;

    }


    survivalPlayer.x +=
        dx *
        speed *
        delta *
        60;


    survivalPlayer.y +=
        dy *
        speed *
        delta *
        60;


    survivalPlayer.x =
        Math.max(
            10,

            Math.min(
                SW -
                survivalPlayer.width -
                10,

                survivalPlayer.x
            )
        );


    survivalPlayer.y =
        Math.max(
            10,

            Math.min(
                SH -
                survivalPlayer.height -
                10,

                survivalPlayer.y
            )
        );

}



/* =========================================================
   DASH STATUS
========================================================= */

function updateDashDisplay(
    now
) {

    const remaining =
        survivalPlayer.dashCooldown -
        (
            now -
            survivalPlayer.lastDash
        );


    if (
        now <
        survivalPlayer.dashUntil
    ) {

        dashStatus.textContent =
            "DASHING";


        return;

    }


    if (
        remaining <=
        0
    ) {

        dashStatus.textContent =
            "DASH READY";

    }

    else {

        dashStatus.textContent =
            `DASH ${(remaining / 1000).toFixed(1)}s`;

    }

}



/* =========================================================
   SPAWN ENEMY
========================================================= */

function spawnSurvivalEnemy() {

    const side =
        Math.floor(
            Math.random() *
            4
        );


    const size =
        42 +
        Math.random() *
        16;


    let x;
    let y;


    if (side === 0) {

        x =
            -size;

        y =
            Math.random() *
            SH;

    }


    if (side === 1) {

        x =
            SW +
            size;

        y =
            Math.random() *
            SH;

    }


    if (side === 2) {

        x =
            Math.random() *
            SW;

        y =
            -size;

    }


    if (side === 3) {

        x =
            Math.random() *
            SW;

        y =
            SH +
            size;

    }


    const image =
        survivalImages.enemies[
            Math.floor(
                Math.random() *
                survivalImages.enemies.length
            )
        ];


    enemies.push({

        x,
        y,

        width:
            size,

        height:
            size,

        image,

        speed:
            (
                1.05 +
                survivalWave *
                0.075 +
                Math.random() *
                0.55
            ) *
            enemySpeedMultiplier

    });

}



/* =========================================================
   SPAWN GREMBLECOIN
========================================================= */

function spawnSurvivalCoin() {

    const size =
        42;


    survivalCoins.push({

        x:
            60 +
            Math.random() *
            (
                SW -
                120
            ),

        y:
            60 +
            Math.random() *
            (
                SH -
                120
            ),

        width:
            size,

        height:
            size,

        phase:
            Math.random() *
            Math.PI *
            2

    });

}



/* =========================================================
   DISTANCE
========================================================= */

function distanceBetween(
    a,
    b
) {

    const ax =
        a.x +
        a.width /
        2;


    const ay =
        a.y +
        a.height /
        2;


    const bx =
        b.x +
        b.width /
        2;


    const by =
        b.y +
        b.height /
        2;


    const dx =
        ax -
        bx;


    const dy =
        ay -
        by;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}



/* =========================================================
   COLLISION
========================================================= */

function survivalCollision(
    a,
    b
) {

    const padding =
        9;


    return (

        a.x +
        padding <
        b.x +
        b.width -
        padding

        &&

        a.x +
        a.width -
        padding >
        b.x +
        padding

        &&

        a.y +
        padding <
        b.y +
        b.height -
        padding

        &&

        a.y +
        a.height -
        padding >
        b.y +
        padding

    );

}



/* =========================================================
   UPDATE ENEMIES
========================================================= */

function updateSurvivalEnemies(
    delta,
    now
) {

    for (
        let i =
            enemies.length -
            1;

        i >=
        0;

        i--
    ) {

        const enemy =
            enemies[i];


        const playerCenterX =
            survivalPlayer.x +
            survivalPlayer.width /
            2;


        const playerCenterY =
            survivalPlayer.y +
            survivalPlayer.height /
            2;


        const enemyCenterX =
            enemy.x +
            enemy.width /
            2;


        const enemyCenterY =
            enemy.y +
            enemy.height /
            2;


        const dx =
            playerCenterX -
            enemyCenterX;


        const dy =
            playerCenterY -
            enemyCenterY;


        const length =
            Math.max(
                0.001,

                Math.sqrt(
                    dx * dx +
                    dy * dy
                )
            );


        enemy.x +=
            (
                dx /
                length
            ) *
            enemy.speed *
            delta *
            60;


        enemy.y +=
            (
                dy /
                length
            ) *
            enemy.speed *
            delta *
            60;


        if (
            survivalCollision(
                survivalPlayer,
                enemy
            )
        ) {

            if (
                now <
                survivalPlayer.dashUntil
            ) {

                createSurvivalParticles(
                    enemy.x,
                    enemy.y,
                    "#ff5555"
                );


                enemies.splice(
                    i,
                    1
                );


                survivalScore +=
                    Math.floor(
                        25 *
                        scoreMultiplier
                    );


                continue;

            }


            damageSurvivalPlayer(
                now
            );

        }

    }

}



/* =========================================================
   UPDATE COINS
========================================================= */

function updateSurvivalCoins(
    delta
) {

    for (
        let i =
            survivalCoins.length -
            1;

        i >=
        0;

        i--
    ) {

        const coin =
            survivalCoins[i];


        const distance =
            distanceBetween(
                survivalPlayer,
                coin
            );


        if (
            distance <
            magnetRadius
        ) {

            const px =
                survivalPlayer.x +
                survivalPlayer.width /
                2;


            const py =
                survivalPlayer.y +
                survivalPlayer.height /
                2;


            const cx =
                coin.x +
                coin.width /
                2;


            const cy =
                coin.y +
                coin.height /
                2;


            const dx =
                px -
                cx;


            const dy =
                py -
                cy;


            const length =
                Math.max(
                    1,

                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    )
                );


            coin.x +=
                (
                    dx /
                    length
                ) *
                6 *
                delta *
                60;


            coin.y +=
                (
                    dy /
                    length
                ) *
                6 *
                delta *
                60;

        }


        if (
            survivalCollision(
                survivalPlayer,
                coin
            )
        ) {

            createSurvivalParticles(
                coin.x,
                coin.y,
                "#65ff83"
            );


            survivalCoins.splice(
                i,
                1
            );


            coinsCollected++;


            survivalScore +=
                Math.floor(
                    100 *
                    scoreMultiplier
                );


            survivalMessage.textContent =
                `GREMBLECOIN ${coinsCollected}`;


            if (
                coinsCollected %
                5 ===
                0
            ) {

                showUpgradeScreen();

            }

        }

    }

}



/* =========================================================
   DAMAGE
========================================================= */

function damageSurvivalPlayer(
    now
) {

    if (
        now <
        survivalPlayer.invulnerableUntil
    ) {
        return;
    }


    if (
        shieldCount >
        0
    ) {

        shieldCount--;


        survivalPlayer.invulnerableUntil =
            now +
            700;


        survivalMessage.textContent =
            `SHIELD SAVED YOU — ${shieldCount} LEFT`;


        return;

    }


    survivalPlayer.lives--;


    survivalLivesElement.textContent =
        survivalPlayer.lives;


    survivalPlayer.invulnerableUntil =
        now +
        1200;


    survivalCanvas.classList.add(
        "damage"
    );


    setTimeout(
        () => {

            survivalCanvas.classList.remove(
                "damage"
            );

        },
        180
    );


    survivalMessage.textContent =
        "HIT! KEEP MOVING.";


    if (
        survivalPlayer.lives <=
        0
    ) {

        endSurvival();

    }

}



/* =========================================================
   PARTICLES
========================================================= */

function createSurvivalParticles(
    x,
    y,
    color
) {

    for (
        let i =
            0;

        i <
        10;

        i++
    ) {

        particles.push({

            x,
            y,

            dx:
                (
                    Math.random() -
                    0.5
                ) *
                5,

            dy:
                (
                    Math.random() -
                    0.5
                ) *
                5,

            life:
                1,

            color

        });

    }

}



/* =========================================================
   UPDATE PARTICLES
========================================================= */

function updateSurvivalParticles(
    delta
) {

    for (
        let i =
            particles.length -
            1;

        i >=
        0;

        i--
    ) {

        const particle =
            particles[i];


        particle.x +=
            particle.dx *
            delta *
            60;


        particle.y +=
            particle.dy *
            delta *
            60;


        particle.life -=
            delta *
            2;


        if (
            particle.life <=
            0
        ) {

            particles.splice(
                i,
                1
            );

        }

    }

}



/* =========================================================
   WAVES
========================================================= */

function updateWave() {

    const newWave =
        Math.floor(
            survivalElapsed /
            20
        ) +
        1;


    if (
        newWave !==
        survivalWave
    ) {

        survivalWave =
            newWave;


        survivalWaveElement.textContent =
            survivalWave;


        survivalMessage.textContent =
            `WAVE ${survivalWave}`;


        enemySpawnInterval =
            Math.max(
                260,

                1000 -
                survivalWave *
                60
            );

    }

}



/* =========================================================
   UPGRADES
========================================================= */

const survivalUpgrades = [

    {

        name:
            "MOVE SPEED",

        icon:
            "⚡",

        description:
            "Move 12% faster.",

        apply() {

            survivalPlayer.speed *=
                1.12;

        }

    },


    {

        name:
            "SHIELD",

        icon:
            "◉",

        description:
            "Block the next enemy hit.",

        apply() {

            shieldCount++;

        }

    },


    {

        name:
            "MAGNET",

        icon:
            "✦",

        description:
            "Pull GrembleCoin from farther away.",

        apply() {

            magnetRadius +=
                55;

        }

    },


    {

        name:
            "SLOW ENEMIES",

        icon:
            "❄",

        description:
            "Reduce enemy movement speed.",

        apply() {

            enemySpeedMultiplier *=
                0.88;


            enemies.forEach(
                enemy => {

                    enemy.speed *=
                        0.88;

                }
            );

        }

    },


    {

        name:
            "EXTRA LIFE",

        icon:
            "♥",

        description:
            "Gain one life. Maximum 5.",

        apply() {

            survivalPlayer.lives =
                Math.min(
                    survivalPlayer.maxLives,

                    survivalPlayer.lives +
                    1
                );


            survivalLivesElement.textContent =
                survivalPlayer.lives;

        }

    },


    {

        name:
            "SCORE BOOST",

        icon:
            "×",

        description:
            "Increase future score rewards.",

        apply() {

            scoreMultiplier *=
                1.25;

        }

    }

];



/* =========================================================
   UPGRADE SCREEN
========================================================= */

function showUpgradeScreen() {

    survivalPaused =
        true;


    const options =
        [
            ...survivalUpgrades
        ]
        .sort(
            () =>
                Math.random() -
                0.5
        )
        .slice(
            0,
            3
        );


    upgradeChoices.innerHTML =
        "";


    options.forEach(
        upgrade => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "upgrade-card";


            button.innerHTML =
                `

                <div class="upgrade-icon">
                    ${upgrade.icon}
                </div>

                <h4>
                    ${upgrade.name}
                </h4>

                <p>
                    ${upgrade.description}
                </p>

                `;


            button.addEventListener(
                "click",
                () => {

                    upgrade.apply();


                    upgradeOverlay.classList.remove(
                        "visible"
                    );


                    survivalPaused =
                        false;


                    survivalMessage.textContent =
                        `${upgrade.name} UPGRADED`;

                }
            );


            upgradeChoices.appendChild(
                button
            );

        }
    );


    upgradeOverlay.classList.add(
        "visible"
    );

}



/* =========================================================
   BACKGROUND
========================================================= */

function drawSurvivalBackground() {

    const gradient =
        sctx.createRadialGradient(
            SW / 2,
            SH / 2,
            20,

            SW / 2,
            SH / 2,
            600
        );


    gradient.addColorStop(
        0,
        "#063020"
    );


    gradient.addColorStop(
        0.48,
        "#021811"
    );


    gradient.addColorStop(
        1,
        "#010806"
    );


    sctx.fillStyle =
        gradient;


    sctx.fillRect(
        0,
        0,
        SW,
        SH
    );


    for (
        let i =
            0;

        i <
        85;

        i++
    ) {

        const x =
            (
                i *
                137 +
                21
            ) %
            SW;


        const y =
            (
                i *
                83 +
                31
            ) %
            SH;


        sctx.fillStyle =
            i %
            7 ===
            0

                ? "rgba(100,255,150,.65)"

                : "rgba(255,255,255,.15)";


        const size =
            i %
            9 ===
            0

                ? 2
                : 1;


        sctx.fillRect(
            x,
            y,
            size,
            size
        );

    }


    sctx.save();


    sctx.strokeStyle =
        "rgba(70,255,120,.20)";


    sctx.shadowColor =
        "#50ff80";


    sctx.shadowBlur =
        12;


    sctx.lineWidth =
        2;


    sctx.strokeRect(
        12,
        12,
        SW -
        24,
        SH -
        24
    );


    sctx.restore();


    sctx.save();


    sctx.strokeStyle =
        "rgba(70,255,120,.07)";


    sctx.lineWidth =
        1;


    sctx.beginPath();


    sctx.arc(
        SW /
        2,

        SH /
        2,

        170,

        0,

        Math.PI *
        2
    );


    sctx.stroke();


    sctx.beginPath();


    sctx.arc(
        SW /
        2,

        SH /
        2,

        95,

        0,

        Math.PI *
        2
    );


    sctx.stroke();


    sctx.restore();

}



/* =========================================================
   PLAYER
========================================================= */

function drawSurvivalPlayer(
    now
) {

    if (
        !survivalImages.player.complete ||
        survivalImages.player.naturalWidth ===
        0
    ) {

        return;

    }


    if (
        now <
        survivalPlayer.invulnerableUntil

        &&

        Math.floor(
            now /
            90
        ) %
        2 ===
        0
    ) {

        return;

    }


    sctx.save();


    if (
        now <
        survivalPlayer.dashUntil
    ) {

        sctx.shadowColor =
            "#6cff91";


        sctx.shadowBlur =
            35;

    }

    else {

        sctx.shadowColor =
            "rgba(70,255,120,.35)";


        sctx.shadowBlur =
            16;

    }


    sctx.drawImage(
        survivalImages.player,

        survivalPlayer.x,
        survivalPlayer.y,

        survivalPlayer.width,
        survivalPlayer.height
    );


    sctx.restore();


    if (
        shieldCount >
        0
    ) {

        sctx.save();


        sctx.strokeStyle =
            "rgba(100,220,255,.75)";


        sctx.shadowColor =
            "#65ddff";


        sctx.shadowBlur =
            15;


        sctx.lineWidth =
            2;


        sctx.beginPath();


        sctx.arc(
            survivalPlayer.x +
            survivalPlayer.width /
            2,

            survivalPlayer.y +
            survivalPlayer.height /
            2,

            49,

            0,

            Math.PI *
            2
        );


        sctx.stroke();


        sctx.restore();

    }

}



/* =========================================================
   ENEMIES
========================================================= */

function drawSurvivalEnemies() {

    enemies.forEach(
        enemy => {

            if (
                !enemy.image.complete ||
                enemy.image.naturalWidth ===
                0
            ) {

                return;

            }


            sctx.save();


            sctx.shadowColor =
                "rgba(255,60,60,.45)";


            sctx.shadowBlur =
                16;


            sctx.drawImage(
                enemy.image,

                enemy.x,
                enemy.y,

                enemy.width,
                enemy.height
            );


            sctx.restore();

        }
    );

}



/* =========================================================
   GREMBLECOINS
========================================================= */

function drawSurvivalCoins(
    now
) {

    survivalCoins.forEach(
        coin => {

            if (
                !survivalImages.coin.complete ||
                survivalImages.coin.naturalWidth ===
                0
            ) {

                return;

            }


            const bob =
                Math.sin(
                    now /
                    250 +
                    coin.phase
                ) *
                4;


            sctx.save();


            sctx.shadowColor =
                "#65ff83";


            sctx.shadowBlur =
                24;


            sctx.drawImage(
                survivalImages.coin,

                coin.x,
                coin.y +
                bob,

                coin.width,
                coin.height
            );


            sctx.restore();

        }
    );

}



/* =========================================================
   PARTICLES
========================================================= */

function drawSurvivalParticles() {

    particles.forEach(
        particle => {

            sctx.globalAlpha =
                Math.max(
                    0,
                    particle.life
                );


            sctx.fillStyle =
                particle.color;


            sctx.fillRect(
                particle.x,
                particle.y,
                4,
                4
            );

        }
    );


    sctx.globalAlpha =
        1;

}



/* =========================================================
   FORMAT TIME
========================================================= */

function formatSurvivalTime(
    seconds
) {

    const minutes =
        Math.floor(
            seconds /
            60
        );


    const secs =
        Math.floor(
            seconds %
            60
        );


    return (
        String(
            minutes
        ).padStart(
            2,
            "0"
        )
        +
        ":"
        +
        String(
            secs
        ).padStart(
            2,
            "0"
        )
    );

}



/* =========================================================
   GAME LOOP
========================================================= */

function survivalGameLoop(
    timestamp
) {

    if (!survivalRunning) {
        return;
    }


    if (!survivalLastFrame) {

        survivalLastFrame =
            timestamp;

    }


    const delta =
        Math.min(
            0.033,

            (
                timestamp -
                survivalLastFrame
            ) /
            1000
        );


    survivalLastFrame =
        timestamp;


    const now =
        performance.now();


    if (!survivalPaused) {

        survivalElapsed =
            (
                now -
                survivalStartTime
            ) /
            1000;


        updateWave();


        updateSurvivalPlayer(
            delta,
            now
        );


        if (
            now -
            lastEnemySpawn >
            enemySpawnInterval
        ) {

            spawnSurvivalEnemy();


            lastEnemySpawn =
                now;

        }


        if (
            now -
            lastCoinSpawn >
            coinSpawnInterval
        ) {

            spawnSurvivalCoin();


            lastCoinSpawn =
                now;

        }


        updateSurvivalEnemies(
            delta,
            now
        );


        updateSurvivalCoins(
            delta
        );


        updateSurvivalParticles(
            delta
        );


        updateDashDisplay(
            now
        );


        survivalScore +=
            delta *
            8 *
            scoreMultiplier;


        survivalScoreElement.textContent =
            Math.floor(
                survivalScore
            );


        survivalTimeElement.textContent =
            formatSurvivalTime(
                survivalElapsed
            );

    }


    drawSurvivalBackground();


    drawSurvivalCoins(
        now
    );


    drawSurvivalEnemies();


    drawSurvivalParticles();


    drawSurvivalPlayer(
        now
    );


    survivalFrame =
        requestAnimationFrame(
            survivalGameLoop
        );

}



/* =========================================================
   START
========================================================= */

function startSurvival() {

    if (survivalFrame) {

        cancelAnimationFrame(
            survivalFrame
        );

    }


    survivalRunning =
        true;


    survivalPaused =
        false;


    survivalScore =
        0;


    survivalWave =
        1;


    survivalElapsed =
        0;


    coinsCollected =
        0;


    scoreMultiplier =
        1;


    enemySpeedMultiplier =
        1;


    magnetRadius =
        100;


    shieldCount =
        0;


    survivalScoreSubmitted =
        false;


    enemies =
        [];


    survivalCoins =
        [];


    particles =
        [];


    enemySpawnInterval =
        1000;


    coinSpawnInterval =
        2600;


    survivalPlayer.x =
        SW /
        2 -
        survivalPlayer.width /
        2;


    survivalPlayer.y =
        SH /
        2 -
        survivalPlayer.height /
        2;


    survivalPlayer.speed =
        4.8;


    survivalPlayer.lives =
        3;


    survivalPlayer.invulnerableUntil =
        0;


    survivalPlayer.lastDash =
        -5000;


    survivalPlayer.dashUntil =
        0;


    survivalKeys.up =
        false;


    survivalKeys.down =
        false;


    survivalKeys.left =
        false;


    survivalKeys.right =
        false;


    survivalLivesElement.textContent =
        "3";


    survivalScoreElement.textContent =
        "0";


    survivalWaveElement.textContent =
        "1";


    survivalTimeElement.textContent =
        "00:00";


    survivalMessage.textContent =
        "SURVIVE THE SWARM.";


    dashStatus.textContent =
        "DASH READY";


    survivalStartButton.textContent =
        "RESTART ARENA";


    upgradeOverlay.classList.remove(
        "visible"
    );


    hideSurvivalSubmitPanel();


    survivalStartTime =
        performance.now();


    survivalLastFrame =
        survivalStartTime;


    lastEnemySpawn =
        survivalStartTime;


    lastCoinSpawn =
        survivalStartTime;


    survivalFrame =
        requestAnimationFrame(
            survivalGameLoop
        );

}



/* =========================================================
   GAME OVER
========================================================= */

function endSurvival() {

    if (!survivalRunning) {
        return;
    }


    survivalRunning =
        false;


    survivalPaused =
        false;


    survivalKeys.up =
        false;


    survivalKeys.down =
        false;


    survivalKeys.left =
        false;


    survivalKeys.right =
        false;


    if (survivalFrame) {

        cancelAnimationFrame(
            survivalFrame
        );


        survivalFrame =
            null;

    }


    finalSurvivalScore =
        Math.floor(
            survivalScore
        );


    finalSurvivalTime =
        Math.floor(
            survivalElapsed
        );


    finalSurvivalWave =
        survivalWave;


    survivalMessage.textContent =
        `GAME OVER — ${formatSurvivalTime(finalSurvivalTime)} — SCORE ${finalSurvivalScore}`;


    survivalStartButton.textContent =
        "PLAY AGAIN";


    upgradeOverlay.classList.remove(
        "visible"
    );


    showSurvivalSubmitPanel();

}



/* =========================================================
   TELEGRAM USERNAME
========================================================= */

function cleanSurvivalTelegramUsername(
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

function createSurvivalLeaderboardUI() {

    const wrapper =
        document.querySelector(
            ".survival-wrapper"
        );


    if (!wrapper) {
        return;
    }


    if (
        document.getElementById(
            "survivalLeaderboardSection"
        )
    ) {
        return;
    }


    const section =
        document.createElement(
            "div"
        );


    section.id =
        "survivalLeaderboardSection";


    section.innerHTML =
        `

        <div
            id="survivalSubmitPanel"
            class="survival-submit-panel"
        >

            <div class="survival-submit-tag">
                RUN COMPLETE
            </div>


            <h3>
                SAVE YOUR SCORE
            </h3>


            <div class="survival-final-stats">

                <div>

                    <span>
                        SCORE
                    </span>

                    <strong id="survivalFinalScore">
                        0
                    </strong>

                </div>


                <div>

                    <span>
                        TIME
                    </span>

                    <strong id="survivalFinalTime">
                        00:00
                    </strong>

                </div>


                <div>

                    <span>
                        WAVE
                    </span>

                    <strong id="survivalFinalWave">
                        1
                    </strong>

                </div>

            </div>


            <div class="survival-submit-row">

                <input
                    type="text"
                    id="survivalNickname"
                    maxlength="32"
                    placeholder="TELEGRAM USERNAME"
                    autocomplete="off"
                >


                <button
                    type="button"
                    id="survivalSubmitScore"
                >
                    SUBMIT SCORE
                </button>

            </div>


            <p class="survival-telegram-note">
                Enter your Telegram username so we can contact you
                if your score wins a competition.
            </p>


            <div
                id="survivalSubmitStatus"
                class="survival-submit-status"
            ></div>

        </div>



        <div class="survival-leaderboard">

            <div class="survival-leaderboard-head">

                <div>

                    <span>
                        GREMBLE SURVIVAL
                    </span>

                    <h3>
                        TOP PLAYERS
                    </h3>

                </div>


                <button
                    type="button"
                    id="survivalRefreshLeaderboard"
                    aria-label="Refresh leaderboard"
                >
                    ↻
                </button>

            </div>


            <div class="survival-leaderboard-columns">

                <span>RANK</span>
                <span>PLAYER</span>
                <span>TIME</span>
                <span>WAVE</span>
                <span>SCORE</span>

            </div>


            <div
                id="survivalLeaderboardList"
                class="survival-leaderboard-list"
            >

                <div class="survival-loading">
                    Loading leaderboard...
                </div>

            </div>

        </div>

        `;


    wrapper.appendChild(
        section
    );


    addSurvivalLeaderboardStyles();


    const nicknameInput =
        document.getElementById(
            "survivalNickname"
        );


    nicknameInput.addEventListener(
        "keydown",
        event => {

            event.stopPropagation();


            if (
                event.key ===
                "Enter"
            ) {

                submitSurvivalScore();

            }

        }
    );


    nicknameInput.addEventListener(
        "keyup",
        event => {

            event.stopPropagation();

        }
    );


    document
        .getElementById(
            "survivalSubmitScore"
        )
        .addEventListener(
            "click",
            submitSurvivalScore
        );


    document
        .getElementById(
            "survivalRefreshLeaderboard"
        )
        .addEventListener(
            "click",
            loadSurvivalLeaderboard
        );


    hideSurvivalSubmitPanel();


    loadSurvivalLeaderboard();

}



/* =========================================================
   LEADERBOARD CSS
========================================================= */

function addSurvivalLeaderboardStyles() {

    if (
        document.getElementById(
            "survivalLeaderboardStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "survivalLeaderboardStyles";


    style.textContent =
        `

        #survivalLeaderboardSection {
            border-top:
                1px solid
                rgba(80,255,130,.14);

            background:
                #010806;
        }


        .survival-submit-panel {
            display:
                none;

            padding:
                34px;

            text-align:
                center;

            border-bottom:
                1px solid
                rgba(80,255,130,.12);
        }


        .survival-submit-tag {
            margin-bottom:
                8px;

            color:
                #64ff86;

            font-size:
                9px;

            font-weight:
                900;

            letter-spacing:
                3px;
        }


        .survival-submit-panel h3 {
            margin:
                0 0 25px;

            font-size:
                23px;
        }


        .survival-final-stats {
            max-width:
                520px;

            margin:
                0 auto 24px;

            display:
                grid;

            grid-template-columns:
                repeat(3,1fr);

            gap:
                10px;
        }


        .survival-final-stats div {
            padding:
                15px;

            border:
                1px solid
                rgba(80,255,130,.12);

            border-radius:
                12px;
        }


        .survival-final-stats span {
            display:
                block;

            margin-bottom:
                6px;

            color:
                #718078;

            font-size:
                8px;

            font-weight:
                900;

            letter-spacing:
                2px;
        }


        .survival-final-stats strong {
            color:
                #64ff86;

            font-size:
                20px;
        }


        .survival-submit-row {
            max-width:
                570px;

            margin:
                0 auto;

            display:
                flex;

            gap:
                10px;
        }


        #survivalNickname {
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

            font-size:
                13px;

            font-weight:
                800;

            letter-spacing:
                1px;
        }


        #survivalNickname:focus {
            border-color:
                #5cff83;
        }


        #survivalSubmitScore {
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


        #survivalSubmitScore:disabled {
            opacity:
                .45;
        }


        .survival-telegram-note {
            max-width:
                570px;

            margin:
                11px auto 0;

            color:
                #708078;

            font-size:
                10px;

            line-height:
                1.5;
        }


        .survival-submit-status {
            min-height:
                18px;

            margin-top:
                12px;

            color:
                #87948d;

            font-size:
                11px;
        }


        .survival-leaderboard {
            padding:
                32px;
        }


        .survival-leaderboard-head {
            margin-bottom:
                25px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                space-between;
        }


        .survival-leaderboard-head span {
            color:
                #5cff83;

            font-size:
                9px;

            font-weight:
                900;

            letter-spacing:
                3px;
        }


        .survival-leaderboard-head h3 {
            margin-top:
                6px;

            font-size:
                24px;
        }


        #survivalRefreshLeaderboard {
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


        .survival-leaderboard-columns,
        .survival-leaderboard-row {
            display:
                grid;

            grid-template-columns:
                60px 1fr 100px 80px 100px;

            align-items:
                center;
        }


        .survival-leaderboard-columns {
            padding:
                0 16px 10px;

            color:
                #58665f;

            font-size:
                8px;

            font-weight:
                900;

            letter-spacing:
                1px;
        }


        .survival-leaderboard-row {
            min-height:
                58px;

            margin-bottom:
                7px;

            padding:
                0 16px;

            border:
                1px solid
                rgba(255,255,255,.05);

            border-radius:
                12px;

            background:
                rgba(255,255,255,.018);
        }


        .survival-leaderboard-row.top-three {
            border-color:
                rgba(90,255,130,.15);

            background:
                rgba(70,255,115,.035);
        }


        .survival-rank {
            color:
                #5cff83;

            font-size:
                13px;

            font-weight:
                900;
        }


        .survival-player-name {
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


        .survival-time-value,
        .survival-wave-value {
            color:
                #9aa69f;

            font-size:
                12px;

            font-weight:
                700;
        }


        .survival-score-value {
            color:
                #5cff83;

            text-align:
                right;

            font-size:
                18px;

            font-weight:
                900;
        }


        .survival-loading,
        .survival-empty {
            padding:
                30px;

            text-align:
                center;

            color:
                #77847e;

            font-size:
                12px;
        }


        @media (max-width: 650px) {

            .survival-submit-panel,
            .survival-leaderboard {
                padding:
                    22px 14px;
            }


            .survival-submit-row {
                flex-direction:
                    column;
            }


            #survivalSubmitScore {
                width:
                    100%;
            }


            .survival-leaderboard-columns {
                display:
                    none;
            }


            .survival-leaderboard-row {
                grid-template-columns:
                    35px 1fr 70px;
            }


            .survival-time-value,
            .survival-wave-value {
                display:
                    none;
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

function showSurvivalSubmitPanel() {

    const panel =
        document.getElementById(
            "survivalSubmitPanel"
        );


    if (!panel) {
        return;
    }


    panel.style.display =
        "block";


    document
        .getElementById(
            "survivalFinalScore"
        )
        .textContent =
        finalSurvivalScore;


    document
        .getElementById(
            "survivalFinalTime"
        )
        .textContent =
        formatSurvivalTime(
            finalSurvivalTime
        );


    document
        .getElementById(
            "survivalFinalWave"
        )
        .textContent =
        finalSurvivalWave;


    const input =
        document.getElementById(
            "survivalNickname"
        );


    const button =
        document.getElementById(
            "survivalSubmitScore"
        );


    const status =
        document.getElementById(
            "survivalSubmitStatus"
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

function hideSurvivalSubmitPanel() {

    const panel =
        document.getElementById(
            "survivalSubmitPanel"
        );


    if (panel) {

        panel.style.display =
            "none";

    }

}



/* =========================================================
   SUBMIT SCORE
========================================================= */

async function submitSurvivalScore() {

    if (
        survivalScoreSubmitted
    ) {
        return;
    }


    const input =
        document.getElementById(
            "survivalNickname"
        );


    const button =
        document.getElementById(
            "survivalSubmitScore"
        );


    const status =
        document.getElementById(
            "survivalSubmitStatus"
        );


    const name =
        cleanSurvivalTelegramUsername(
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
                SURVIVAL_SCORES_API,
                {

                    method:
                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SURVIVAL_SUPABASE_KEY,

                        "Prefer":
                            "return=minimal"

                    },


                    body:
                        JSON.stringify(
                            {

                                name,

                                score:
                                    finalSurvivalScore,

                                time:
                                    finalSurvivalTime,

                                wave:
                                    finalSurvivalWave

                            }
                        )

                }
            );


        if (!response.ok) {

            const error =
                await response.text();


            console.error(
                "Survival score error:",
                response.status,
                error
            );


            throw new Error(
                error
            );

        }


        survivalScoreSubmitted =
            true;


        input.disabled =
            true;


        button.disabled =
            true;


        button.textContent =
            "SAVED";


        status.textContent =
            "Score submitted!";


        await loadSurvivalLeaderboard();

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

async function loadSurvivalLeaderboard() {

    const list =
        document.getElementById(
            "survivalLeaderboardList"
        );


    if (!list) {
        return;
    }


    list.innerHTML =
        `
        <div class="survival-loading">
            Loading leaderboard...
        </div>
        `;


    try {

        const url =
            `${SURVIVAL_SCORES_API}?select=name,score,time,wave,created_at&order=score.desc,time.desc,created_at.asc&limit=10`;


        const response =
            await fetch(
                url,
                {

                    headers: {

                        "apikey":
                            SURVIVAL_SUPABASE_KEY

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


        renderSurvivalLeaderboard(
            data
        );

    }

    catch (error) {

        console.error(
            "Survival leaderboard:",
            error
        );


        list.innerHTML =
            `
            <div class="survival-empty">
                Leaderboard unavailable.
            </div>
            `;

    }

}



/* =========================================================
   SAFE HTML
========================================================= */

function survivalEscapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value
        );


    return div.innerHTML;

}



/* =========================================================
   RENDER LEADERBOARD
========================================================= */

function renderSurvivalLeaderboard(
    data
) {

    const list =
        document.getElementById(
            "survivalLeaderboardList"
        );


    if (
        !data ||
        data.length ===
        0
    ) {

        list.innerHTML =
            `
            <div class="survival-empty">
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
                        index +
                        1;


                    return `

                    <div class="
                        survival-leaderboard-row
                        ${rank <= 3 ? "top-three" : ""}
                    ">

                        <div class="survival-rank">
                            #${rank}
                        </div>

                        <div class="survival-player-name">
                            @${survivalEscapeHTML(player.name)}
                        </div>

                        <div class="survival-time-value">
                            ${formatSurvivalTime(Number(player.time) || 0)}
                        </div>

                        <div class="survival-wave-value">
                            W${Number(player.wave) || 1}
                        </div>

                        <div class="survival-score-value">
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

survivalStartButton.addEventListener(
    "click",
    startSurvival
);



/* =========================================================
   INITIALIZE
========================================================= */

function initializeSurvival() {

    drawSurvivalBackground();


    drawSurvivalPlayer(
        performance.now()
    );


    createSurvivalLeaderboardUI();

}


initializeSurvival();