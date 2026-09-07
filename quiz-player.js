/* =====================================================
   GREMBLE LIVE QUIZ - PLAYER FRONTEND
   File: quiz-player.js
===================================================== */


/* =====================================================
   CONFIG
===================================================== */

const QUIZ_PLAYER_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/quiz-player";


const GREMBLE_QUIZ_SESSION_KEY =
    "gremble_session_token";


const QUIZ_STATE_POLL_MS =
    700;


const QUIZ_TIMER_REFRESH_MS =
    100;


/*
    Used only so finished results do not reopen
    after the player clicks BACK TO WEBSITE.
*/

const QUIZ_DISMISSED_RESULT_KEY =
    "gremble_quiz_dismissed_session";


/* =====================================================
   ELEMENTS - PROFILE CARD
===================================================== */

const liveQuizEntryCard =
    document.getElementById(
        "liveQuizEntryCard"
    );


const liveQuizEntryTitle =
    document.getElementById(
        "liveQuizEntryTitle"
    );


const joinLiveQuizButton =
    document.getElementById(
        "joinLiveQuizButton"
    );


const liveQuizEntryMessage =
    document.getElementById(
        "liveQuizEntryMessage"
    );


/* =====================================================
   ELEMENTS - FULL SCREEN
===================================================== */

const liveQuizScreen =
    document.getElementById(
        "liveQuizScreen"
    );


const liveQuizLobbyView =
    document.getElementById(
        "liveQuizLobbyView"
    );


const liveQuizQuestionView =
    document.getElementById(
        "liveQuizQuestionView"
    );


const liveQuizResultView =
    document.getElementById(
        "liveQuizResultView"
    );


const liveQuizWaitingView =
    document.getElementById(
        "liveQuizWaitingView"
    );


const liveQuizFinalView =
    document.getElementById(
        "liveQuizFinalView"
    );


/* =====================================================
   LOBBY
===================================================== */

const leaveLiveQuizButton =
    document.getElementById(
        "leaveLiveQuizButton"
    );


/* =====================================================
   QUESTION
===================================================== */

const liveQuizQuestionNumber =
    document.getElementById(
        "liveQuizQuestionNumber"
    );


const liveQuizTimer =
    document.getElementById(
        "liveQuizTimer"
    );


const liveQuizQuestionText =
    document.getElementById(
        "liveQuizQuestionText"
    );


const liveQuizAnswerA =
    document.getElementById(
        "liveQuizAnswerA"
    );


const liveQuizAnswerB =
    document.getElementById(
        "liveQuizAnswerB"
    );


const liveQuizAnswerC =
    document.getElementById(
        "liveQuizAnswerC"
    );


const liveQuizAnswerD =
    document.getElementById(
        "liveQuizAnswerD"
    );


const liveQuizQuestionNote =
    document.getElementById(
        "liveQuizQuestionNote"
    );


const liveQuizAnswerButtons =
    Array.from(
        document.querySelectorAll(
            "[data-quiz-answer]"
        )
    );


/* =====================================================
   RESULT
===================================================== */

const liveQuizResultTitle =
    document.getElementById(
        "liveQuizResultTitle"
    );


const liveQuizResultPoints =
    document.getElementById(
        "liveQuizResultPoints"
    );


/* =====================================================
   FINAL
===================================================== */

const liveQuizFinalList =
    document.getElementById(
        "liveQuizFinalList"
    );


const liveQuizYourResult =
    document.getElementById(
        "liveQuizYourResult"
    );


const closeLiveQuizButton =
    document.getElementById(
        "closeLiveQuizButton"
    );


/* =====================================================
   STATE
===================================================== */

let quizCurrentState =
    null;


let quizStatePollTimer =
    null;


let quizVisualTimer =
    null;


let quizRequestRunning =
    false;


let quizAnswerSubmitting =
    false;


let quizLastRenderedState =
    "";


let quizLastRenderedQuestion =
    null;


/* =====================================================
   HELPERS
===================================================== */

function quizCleanText(value) {

    return typeof value === "string"
        ? value.trim()
        : "";

}


function getQuizSessionToken() {

    return quizCleanText(
        localStorage.getItem(
            GREMBLE_QUIZ_SESSION_KEY
        )
    );

}


function getDismissedQuizSession() {

    return quizCleanText(
        localStorage.getItem(
            QUIZ_DISMISSED_RESULT_KEY
        )
    );

}


function setDismissedQuizSession(
    sessionId
) {

    if (!sessionId) {
        return;
    }


    localStorage.setItem(
        QUIZ_DISMISSED_RESULT_KEY,
        String(sessionId)
    );

}


function clearDismissedQuizSession() {

    localStorage.removeItem(
        QUIZ_DISMISSED_RESULT_KEY
    );

}


/* =====================================================
   PROFILE CARD MESSAGE
===================================================== */

function setQuizEntryMessage(
    message,
    type = ""
) {

    if (!liveQuizEntryMessage) {
        return;
    }


    liveQuizEntryMessage.textContent =
        message;


    liveQuizEntryMessage.classList.remove(
        "success",
        "error"
    );


    if (type) {

        liveQuizEntryMessage.classList.add(
            type
        );

    }

}


/* =====================================================
   SHOW / HIDE ENTRY CARD
===================================================== */

function showQuizEntryCard(
    state
) {

    if (!liveQuizEntryCard) {
        return;
    }


    if (liveQuizEntryTitle) {

        liveQuizEntryTitle.textContent =
            quizCleanText(
                state?.quiz_title
            ) ||
            "GREMBLE LIVE QUIZ";

    }


    liveQuizEntryCard.hidden =
        false;


    setQuizEntryMessage(
        ""
    );

}


function hideQuizEntryCard() {

    if (!liveQuizEntryCard) {
        return;
    }


    liveQuizEntryCard.hidden =
        true;


    setQuizEntryMessage(
        ""
    );

}


/* =====================================================
   FULL SCREEN
===================================================== */

function openQuizScreen() {

    if (!liveQuizScreen) {
        return;
    }


    liveQuizScreen.hidden =
        false;


    document.body.classList.add(
        "live-quiz-open"
    );


    window.scrollTo(
        0,
        0
    );

}


function closeQuizScreen() {

    if (!liveQuizScreen) {
        return;
    }


    liveQuizScreen.hidden =
        true;


    document.body.classList.remove(
        "live-quiz-open"
    );


    hideAllQuizViews();

}


/* =====================================================
   HIDE ALL FULLSCREEN VIEWS
===================================================== */

function hideAllQuizViews() {

    [
        liveQuizLobbyView,
        liveQuizQuestionView,
        liveQuizResultView,
        liveQuizWaitingView,
        liveQuizFinalView

    ].forEach(
        view => {

            if (view) {

                view.hidden =
                    true;

            }

        }
    );

}


/* =====================================================
   SHOW ONE VIEW
===================================================== */

function showQuizView(view) {

    hideAllQuizViews();


    if (view) {

        view.hidden =
            false;

    }

}


/* =====================================================
   REQUEST
===================================================== */

async function quizPlayerRequest(
    method = "GET",
    body = null
) {

    const token =
        getQuizSessionToken();


    if (!token) {

        throw new Error(
            "LOGIN_REQUIRED"
        );

    }


    const options = {

        method,

        headers: {

            "Authorization":
                `Bearer ${token}`

        },

        cache:
            "no-store"

    };


    if (body !== null) {

        options.headers[
            "Content-Type"
        ] =
            "application/json";


        options.body =
            JSON.stringify(
                body
            );

    }


    const response =
        await fetch(
            QUIZ_PLAYER_ENDPOINT,
            options
        );


    let result = null;


    try {

        result =
            await response.json();

    }
    catch {

        result =
            null;

    }


    if (
        !response.ok ||
        !result?.success
    ) {

        throw new Error(
            result?.error ||
            "QUIZ_REQUEST_FAILED"
        );

    }


    return result;

}


/* =====================================================
   RESET ANSWER BUTTONS
===================================================== */

function resetQuizAnswerButtons() {

    liveQuizAnswerButtons.forEach(
        button => {

            button.disabled =
                true;


            button.classList.remove(
                "selected",
                "locked"
            );

        }
    );

}


/* =====================================================
   QUESTION CONTENT
===================================================== */

function renderQuestionContent(
    state
) {

    const question =
        state?.question;


    if (!question) {
        return;
    }


    const questionNumber =
        Number(
            state.question_number ||
            0
        );


    const totalQuestions =
        Number(
            state.total_questions ||
            0
        );


    if (liveQuizQuestionNumber) {

        liveQuizQuestionNumber.textContent =
            `QUESTION ${questionNumber} / ${totalQuestions}`;

    }


    if (liveQuizQuestionText) {

        liveQuizQuestionText.textContent =
            quizCleanText(
                question.text
            );

    }


    if (liveQuizAnswerA) {

        liveQuizAnswerA.textContent =
            quizCleanText(
                question.answers?.A
            );

    }


    if (liveQuizAnswerB) {

        liveQuizAnswerB.textContent =
            quizCleanText(
                question.answers?.B
            );

    }


    if (liveQuizAnswerC) {

        liveQuizAnswerC.textContent =
            quizCleanText(
                question.answers?.C
            );

    }


    if (liveQuizAnswerD) {

        liveQuizAnswerD.textContent =
            quizCleanText(
                question.answers?.D
            );

    }

}


/* =====================================================
   READING PHASE

   IMPORTANT:
   We do NOT show the 4 second reading timer.
   We also completely hide all answers.
===================================================== */

function renderReadingState(
    state
) {

    openQuizScreen();

    showQuizView(
        liveQuizQuestionView
    );


    renderQuestionContent(
        state
    );


    resetQuizAnswerButtons();


    liveQuizAnswerButtons.forEach(
        button => {

            button.hidden =
                true;

            button.classList.add(
                "locked"
            );

        }
    );


    if (liveQuizTimer) {

        liveQuizTimer.textContent =
            "";

        liveQuizTimer.hidden =
            true;

    }


    if (liveQuizQuestionNote) {

        liveQuizQuestionNote.textContent =
            "GET READY...";

    }

}


/* =====================================================
   ANSWERING PHASE
===================================================== */

function renderAnsweringState(
    state
) {

    openQuizScreen();

    showQuizView(
        liveQuizQuestionView
    );


    renderQuestionContent(
        state
    );


    if (liveQuizTimer) {

        liveQuizTimer.hidden =
            false;

    }


    const selectedAnswer =
        quizCleanText(
            state.selected_answer
        ).toUpperCase();


    liveQuizAnswerButtons.forEach(
        button => {

            button.hidden =
                false;


            const answer =
                quizCleanText(
                    button.dataset.quizAnswer
                ).toUpperCase();


            const locked =
                state.answers_locked ===
                true ||
                quizAnswerSubmitting;


            button.disabled =
                locked;


            button.classList.toggle(
                "locked",
                locked
            );


            button.classList.toggle(
                "selected",
                !!selectedAnswer &&
                selectedAnswer ===
                answer
            );

        }
    );


    if (liveQuizQuestionNote) {

        if (
            state.answers_locked ===
            true
        ) {

            liveQuizQuestionNote.textContent =
                "ANSWER LOCKED.";

        }
        else {

            liveQuizQuestionNote.textContent =
                "CHOOSE YOUR ANSWER.";

        }

    }


    updateQuizCountdown();

}


/* =====================================================
   ANSWERED WHILE QUESTION STILL OPEN
===================================================== */

function renderAnsweredState(
    state
) {

    renderAnsweringState(
        state
    );


    liveQuizAnswerButtons.forEach(
        button => {

            button.disabled =
                true;

            button.classList.add(
                "locked"
            );

        }
    );


    if (liveQuizQuestionNote) {

        liveQuizQuestionNote.textContent =
            "ANSWER LOCKED. WAIT FOR THE TIMER.";

    }

}


/* =====================================================
   QUESTION RESULT
===================================================== */

function renderQuestionResult(
    state
) {

    openQuizScreen();

    showQuizView(
        liveQuizResultView
    );


    const result =
        state?.result ||
        {};


    const answered =
        result.answered ===
        true;


    const correct =
        result.correct ===
        true;


    const points =
        Number(
            result.points ||
            0
        );


    if (liveQuizResultTitle) {

        if (!answered) {

            liveQuizResultTitle.textContent =
                "TIME'S UP!";

        }
        else if (correct) {

            liveQuizResultTitle.textContent =
                "CORRECT!";

        }
        else {

            liveQuizResultTitle.textContent =
                "WRONG!";

        }

    }


    if (liveQuizResultPoints) {

        liveQuizResultPoints.textContent =
            correct
                ? `+${points} POINTS`
                : "+0 POINTS";

    }

}


/* =====================================================
   LOBBY
===================================================== */

function renderJoinedLobby() {

    hideQuizEntryCard();


    openQuizScreen();


    showQuizView(
        liveQuizLobbyView
    );

}


/* =====================================================
   WAITING
===================================================== */

function renderWaitingState() {

    openQuizScreen();


    showQuizView(
        liveQuizWaitingView
    );

}


/* =====================================================
   FINAL RESULTS
===================================================== */

function createFinalResultRow(
    player
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "live-quiz-final-row";


    if (
        player.is_you ===
        true
    ) {

        row.classList.add(
            "you"
        );

    }


    const position =
        document.createElement(
            "span"
        );


    position.className =
        "live-quiz-final-position";


    position.textContent =
        `#${Number(player.position || 0)}`;


    const identity =
        document.createElement(
            "div"
        );


    identity.className =
        "live-quiz-final-player";


    const name =
        document.createElement(
            "strong"
        );


    const username =
        quizCleanText(
            player.telegram_username
        );


    const telegramName =
        quizCleanText(
            player.telegram_name
        );


    name.textContent =
        username
            ? (
                username.startsWith("@")
                    ? username
                    : `@${username}`
            )
            : (
                telegramName ||
                "PLAYER"
            );


    identity.appendChild(
        name
    );


    const score =
        document.createElement(
            "strong"
        );


    score.className =
        "live-quiz-final-score";


    score.textContent =
        `${Number(player.score || 0)} PTS`;


    row.appendChild(
        position
    );


    row.appendChild(
        identity
    );


    row.appendChild(
        score
    );


    return row;

}


function renderFinalState(
    state
) {

    hideQuizEntryCard();


    openQuizScreen();


    showQuizView(
        liveQuizFinalView
    );


    if (liveQuizFinalList) {

        liveQuizFinalList.innerHTML =
            "";


        const topFive =
            Array.isArray(
                state.top_5
            )
                ? state.top_5
                : [];


        topFive.forEach(
            player => {

                liveQuizFinalList.appendChild(
                    createFinalResultRow(
                        player
                    )
                );

            }
        );

    }


    if (liveQuizYourResult) {

        const own =
            state.your_result;


        if (!own) {

            liveQuizYourResult.textContent =
                "";

        }
        else {

            const ownPosition =
                Number(
                    own.position ||
                    0
                );


            const ownScore =
                Number(
                    own.score ||
                    0
                );


            const isInTopFive =
                ownPosition > 0 &&
                ownPosition <= 5;


            liveQuizYourResult.textContent =
                isInTopFive
                    ? `YOUR FINAL SCORE: ${ownScore} PTS`
                    : `YOUR PLACE: #${ownPosition} — ${ownScore} PTS`;

        }

    }

}


/* =====================================================
   TIMER
===================================================== */

function updateQuizCountdown() {

    if (
        !quizCurrentState ||
        quizCurrentState.state !==
        "answering" &&
        quizCurrentState.state !==
        "answered"
    ) {

        return;

    }


    if (!liveQuizTimer) {
        return;
    }


    const closeAt =
        quizCurrentState.answers_close_at;


    if (!closeAt) {

        liveQuizTimer.textContent =
            "";

        return;

    }


    const remainingMs =
        new Date(
            closeAt
        ).getTime() -
        Date.now();


    const remainingSeconds =
        Math.max(
            0,
            Math.ceil(
                remainingMs /
                1000
            )
        );


    liveQuizTimer.textContent =
        String(
            remainingSeconds
        );


    if (
        remainingMs <= 0
    ) {

        liveQuizTimer.textContent =
            "0";

    }

}


/* =====================================================
   RENDER STATE
===================================================== */

function renderQuizState(
    state
) {

    quizCurrentState =
        state;


    const stateName =
        quizCleanText(
            state?.state
        );


    /*
        No active lobby/live quiz.

        NOTHING must be visible.
    */

    if (
        stateName === "inactive"
    ) {

        hideQuizEntryCard();

        closeQuizScreen();

        quizLastRenderedState =
            stateName;

        return;

    }


    /*
        Lobby is open but player has not joined.

        Only profile card appears.
    */

    if (
        stateName === "lobby_open"
    ) {

        closeQuizScreen();

        showQuizEntryCard(
            state
        );


        /*
            New quiz session means old dismissed
            final result no longer matters.
        */

        clearDismissedQuizSession();


        quizLastRenderedState =
            stateName;

        return;

    }


    /*
        Player joined lobby.
    */

    if (
        stateName === "lobby_joined"
    ) {

        renderJoinedLobby();


        quizLastRenderedState =
            stateName;

        return;

    }


    /*
        Quiz already started and player was
        not in lobby.

        Do not show anything.
    */

    if (
        stateName === "live_locked"
    ) {

        hideQuizEntryCard();

        closeQuizScreen();


        quizLastRenderedState =
            stateName;

        return;

    }


    /*
        Reading phase.
    */

    if (
        stateName === "reading"
    ) {

        hideQuizEntryCard();


        renderReadingState(
            state
        );


        quizLastRenderedState =
            stateName;


        quizLastRenderedQuestion =
            state.question_number;


        return;

    }


    /*
        Answering.
    */

    if (
        stateName === "answering"
    ) {

        hideQuizEntryCard();


        renderAnsweringState(
            state
        );


        quizLastRenderedState =
            stateName;


        quizLastRenderedQuestion =
            state.question_number;


        return;

    }


    /*
        Answer already submitted.
    */

    if (
        stateName === "answered"
    ) {

        hideQuizEntryCard();


        renderAnsweredState(
            state
        );


        quizLastRenderedState =
            stateName;


        quizLastRenderedQuestion =
            state.question_number;


        return;

    }


    /*
        Question ended.
    */

    if (
        stateName ===
        "question_result"
    ) {

        hideQuizEntryCard();


        renderQuestionResult(
            state
        );


        quizLastRenderedState =
            stateName;


        quizLastRenderedQuestion =
            state.question_number;


        return;

    }


    /*
        Waiting for host / next question.
    */

    if (
        stateName === "waiting"
    ) {

        hideQuizEntryCard();


        renderWaitingState();


        quizLastRenderedState =
            stateName;

        return;

    }


    /*
        Finished.

        Only TOP 5 + player's own position.
    */

    if (
        stateName === "finished"
    ) {

        const sessionId =
            String(
                state.session_id ||
                ""
            );


        const dismissed =
            getDismissedQuizSession();


        if (
            sessionId &&
            dismissed ===
            sessionId
        ) {

            closeQuizScreen();

            hideQuizEntryCard();

            return;

        }


        renderFinalState(
            state
        );


        quizLastRenderedState =
            stateName;

        return;

    }


    /*
        Unknown safe fallback.
    */

    hideQuizEntryCard();

}


/* =====================================================
   LOAD STATE
===================================================== */

async function loadQuizPlayerState() {

    /*
        User not logged into Telegram.

        Absolutely nothing quiz-related is shown.
    */

    const token =
        getQuizSessionToken();


    if (!token) {

        quizCurrentState =
            null;


        hideQuizEntryCard();


        closeQuizScreen();


        return;

    }


    if (quizRequestRunning) {
        return;
    }


    quizRequestRunning =
        true;


    try {

        const state =
            await quizPlayerRequest(
                "GET"
            );


        renderQuizState(
            state
        );

    }
    catch (error) {

        const message =
            quizCleanText(
                error?.message
            );


        /*
            Normal auth case.

            telegram.js handles login/session UI.
        */

        if (
            message === "LOGIN_REQUIRED" ||
            message === "INVALID_SESSION" ||
            message === "SESSION_EXPIRED"
        ) {

            hideQuizEntryCard();

            closeQuizScreen();

            return;

        }


        console.error(
            "Live quiz state error:",
            error
        );

    }
    finally {

        quizRequestRunning =
            false;

    }

}


/* =====================================================
   JOIN LOBBY
===================================================== */

async function joinLiveQuiz() {

    if (
        !joinLiveQuizButton ||
        quizRequestRunning
    ) {

        return;

    }


    joinLiveQuizButton.disabled =
        true;


    joinLiveQuizButton.textContent =
        "JOINING...";


    setQuizEntryMessage(
        ""
    );


    try {

        const state =
            await quizPlayerRequest(
                "POST",
                {
                    action:
                        "join_lobby"
                }
            );


        clearDismissedQuizSession();


        renderQuizState(
            state
        );

    }
    catch (error) {

        console.error(
            "Join live quiz error:",
            error
        );


        setQuizEntryMessage(
            error?.message ||
            "COULD NOT JOIN LIVE QUIZ.",
            "error"
        );

    }
    finally {

        joinLiveQuizButton.disabled =
            false;


        joinLiveQuizButton.textContent =
            "JOIN LIVE QUIZ";

    }

}


/* =====================================================
   LEAVE LOBBY
===================================================== */

async function leaveLiveQuiz() {

    if (!leaveLiveQuizButton) {
        return;
    }


    leaveLiveQuizButton.disabled =
        true;


    leaveLiveQuizButton.textContent =
        "LEAVING...";


    try {

        const state =
            await quizPlayerRequest(
                "POST",
                {
                    action:
                        "leave_lobby"
                }
            );


        closeQuizScreen();


        renderQuizState(
            state
        );

    }
    catch (error) {

        console.error(
            "Leave quiz error:",
            error
        );

    }
    finally {

        leaveLiveQuizButton.disabled =
            false;


        leaveLiveQuizButton.textContent =
            "LEAVE LOBBY";

    }

}


/* =====================================================
   SUBMIT ANSWER
===================================================== */

async function submitQuizAnswer(
    answer
) {

    const cleanAnswer =
        quizCleanText(
            answer
        ).toUpperCase();


    if (
        ![
            "A",
            "B",
            "C",
            "D"
        ].includes(
            cleanAnswer
        )
    ) {

        return;

    }


    if (
        quizAnswerSubmitting ||
        quizCurrentState?.state !==
        "answering"
    ) {

        return;

    }


    quizAnswerSubmitting =
        true;


    liveQuizAnswerButtons.forEach(
        button => {

            button.disabled =
                true;


            button.classList.add(
                "locked"
            );


            button.classList.toggle(
                "selected",
                button.dataset.quizAnswer ===
                cleanAnswer
            );

        }
    );


    if (liveQuizQuestionNote) {

        liveQuizQuestionNote.textContent =
            "SENDING ANSWER...";

    }


    try {

        await quizPlayerRequest(
            "POST",
            {
                action:
                    "answer",

                answer:
                    cleanAnswer
            }
        );


        /*
            Do NOT show whether correct yet.

            Server only reveals that after the
            answer window closes.
        */

        if (liveQuizQuestionNote) {

            liveQuizQuestionNote.textContent =
                "ANSWER LOCKED.";

        }


        /*
            Immediately refresh state so selected
            answer is persisted visually.
        */

        await loadQuizPlayerState();

    }
    catch (error) {

        console.error(
            "Quiz answer error:",
            error
        );


        const message =
            quizCleanText(
                error?.message
            );


        if (
            message ===
            "ANSWER_ALREADY_SUBMITTED"
        ) {

            if (liveQuizQuestionNote) {

                liveQuizQuestionNote.textContent =
                    "ANSWER LOCKED.";

            }

        }
        else if (
            message ===
            "ANSWER_TIME_EXPIRED"
        ) {

            if (liveQuizQuestionNote) {

                liveQuizQuestionNote.textContent =
                    "TIME'S UP.";

            }

        }
        else if (
            message ===
            "ANSWERS_NOT_OPEN_YET"
        ) {

            if (liveQuizQuestionNote) {

                liveQuizQuestionNote.textContent =
                    "GET READY...";

            }

        }
        else {

            if (liveQuizQuestionNote) {

                liveQuizQuestionNote.textContent =
                    "COULD NOT SEND ANSWER.";

            }

        }

    }
    finally {

        quizAnswerSubmitting =
            false;

    }

}


/* =====================================================
   CLOSE FINAL RESULTS
===================================================== */

function closeFinishedQuiz() {

    const sessionId =
        quizCurrentState?.session_id;


    if (sessionId) {

        setDismissedQuizSession(
            sessionId
        );

    }


    closeQuizScreen();


    hideQuizEntryCard();


    window.scrollTo({
        top:
            0,

        behavior:
            "smooth"
    });

}


/* =====================================================
   ANSWER EVENTS
===================================================== */

liveQuizAnswerButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                submitQuizAnswer(
                    button.dataset.quizAnswer
                );

            }
        );

    }
);


/* =====================================================
   BUTTON EVENTS
===================================================== */

if (joinLiveQuizButton) {

    joinLiveQuizButton.addEventListener(
        "click",
        joinLiveQuiz
    );

}


if (leaveLiveQuizButton) {

    leaveLiveQuizButton.addEventListener(
        "click",
        leaveLiveQuiz
    );

}


if (closeLiveQuizButton) {

    closeLiveQuizButton.addEventListener(
        "click",
        closeFinishedQuiz
    );

}


/* =====================================================
   VISUAL TIMER
===================================================== */

function startQuizVisualTimer() {

    if (quizVisualTimer) {

        clearInterval(
            quizVisualTimer
        );

    }


    quizVisualTimer =
        setInterval(
            () => {

                updateQuizCountdown();

            },
            QUIZ_TIMER_REFRESH_MS
        );

}


/* =====================================================
   STATE POLLING
===================================================== */

function startQuizPolling() {

    if (quizStatePollTimer) {

        clearInterval(
            quizStatePollTimer
        );

    }


    /*
        First check immediately.
    */

    loadQuizPlayerState();


    quizStatePollTimer =
        setInterval(
            () => {

                loadQuizPlayerState();

            },
            QUIZ_STATE_POLL_MS
        );

}


/* =====================================================
   TAB VISIBILITY

   Refresh immediately when player returns to tab.
===================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadQuizPlayerState();

        }

    }
);


/* =====================================================
   STORAGE CHANGE

   Useful when Telegram login/logout happens
   in another tab.
===================================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            GREMBLE_QUIZ_SESSION_KEY
        ) {

            loadQuizPlayerState();

        }

    }
);


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        hideQuizEntryCard();


        closeQuizScreen();


        resetQuizAnswerButtons();


        startQuizVisualTimer();


        startQuizPolling();

    }
);