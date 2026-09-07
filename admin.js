/* =====================================================
   GREMBLE ADMIN PANEL
   File: admin.js
===================================================== */


/* =====================================================
   CONFIG
===================================================== */

const ADMIN_MEMBERS_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-members";

const ADMIN_CONTEST_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-contest";

const ADMIN_QUIZ_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-quiz";

const ADMIN_QUIZ_LIVE_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-quiz-live";


const GREMBLE_SESSION_KEY =
    "gremble_session_token";

const GREMBLE_SESSION_EXPIRY_KEY =
    "gremble_session_expires_at";


const CONTEST_ITEMS_PER_PAGE = 5;
const MEMBERS_ITEMS_PER_PAGE = 10;


const QUIZ_READ_TIME_SECONDS = 4;
const QUIZ_MAX_SCORE = 1000;
const QUIZ_DEFAULT_ANSWER_TIME = 10;

const QUIZ_ANSWER_TIME_OPTIONS = [
    5,
    6,
    7,
    8,
    9,
    10,
    15,
    20
];


const LIVE_QUIZ_POLL_MS = 1000;


/* =====================================================
   MEMBER ELEMENTS
===================================================== */

const adminMessage =
    document.getElementById(
        "adminMessage"
    );

const adminDashboard =
    document.getElementById(
        "adminDashboard"
    );

const adminIdentity =
    document.getElementById(
        "adminIdentity"
    );

const sidebarAdminIdentity =
    document.getElementById(
        "sidebarAdminIdentity"
    );


const statTotalMembers =
    document.getElementById(
        "statTotalMembers"
    );

const statCompletedProfiles =
    document.getElementById(
        "statCompletedProfiles"
    );

const statTelegramChatMembers =
    document.getElementById(
        "statTelegramChatMembers"
    );

const statTelegramAnnouncementsMembers =
    document.getElementById(
        "statTelegramAnnouncementsMembers"
    );

const statMembersWithWallet =
    document.getElementById(
        "statMembersWithWallet"
    );


const memberSearch =
    document.getElementById(
        "memberSearch"
    );

const refreshMembers =
    document.getElementById(
        "refreshMembers"
    );

const membersTableBody =
    document.getElementById(
        "membersTableBody"
    );

const membersEmpty =
    document.getElementById(
        "membersEmpty"
    );

const membersPagination =
    document.getElementById(
        "membersPagination"
    );

const membersPrevPage =
    document.getElementById(
        "membersPrevPage"
    );

const membersNextPage =
    document.getElementById(
        "membersNextPage"
    );

const membersPageInfo =
    document.getElementById(
        "membersPageInfo"
    );


/* =====================================================
   CONTEST ELEMENTS
===================================================== */

const openContestPanel =
    document.getElementById(
        "openContestPanel"
    );

const closeContestPanel =
    document.getElementById(
        "closeContestPanel"
    );

const contestPanel =
    document.getElementById(
        "contestPanel"
    );


const contestTotalEntries =
    document.getElementById(
        "contestTotalEntries"
    );

const contestVerifiedEntries =
    document.getElementById(
        "contestVerifiedEntries"
    );

const contestEntriesLabel =
    document.getElementById(
        "contestEntriesLabel"
    );


const contestEntryForm =
    document.getElementById(
        "contestEntryForm"
    );

const contestEntryId =
    document.getElementById(
        "contestEntryId"
    );

const contestParticipant =
    document.getElementById(
        "contestParticipant"
    );

const contestMemeUrl =
    document.getElementById(
        "contestMemeUrl"
    );

const contestPoints =
    document.getElementById(
        "contestPoints"
    );


const contestRequirementsYes =
    document.getElementById(
        "contestRequirementsYes"
    );

const contestRequirementsNo =
    document.getElementById(
        "contestRequirementsNo"
    );

const contestRequirementsValue =
    document.getElementById(
        "contestRequirementsValue"
    );


const contestSubmitButton =
    document.getElementById(
        "contestSubmitButton"
    );

const contestCancelEdit =
    document.getElementById(
        "contestCancelEdit"
    );

const contestFormMessage =
    document.getElementById(
        "contestFormMessage"
    );


const contestTableBody =
    document.getElementById(
        "contestTableBody"
    );

const contestEmpty =
    document.getElementById(
        "contestEmpty"
    );

const contestSearch =
    document.getElementById(
        "contestSearch"
    );

const contestSort =
    document.getElementById(
        "contestSort"
    );

const contestPagination =
    document.getElementById(
        "contestPagination"
    );

const contestPrevPage =
    document.getElementById(
        "contestPrevPage"
    );

const contestNextPage =
    document.getElementById(
        "contestNextPage"
    );

const contestPageInfo =
    document.getElementById(
        "contestPageInfo"
    );


/* =====================================================
   QUIZ BUILDER ELEMENTS
===================================================== */

const quizBuilderForm =
    document.getElementById(
        "quizBuilderForm"
    );

const quizEditingId =
    document.getElementById(
        "quizEditingId"
    );

const quizTitle =
    document.getElementById(
        "quizTitle"
    );

const quizDescription =
    document.getElementById(
        "quizDescription"
    );

const quizBuilderTitle =
    document.getElementById(
        "quizBuilderTitle"
    );

const quizBuilderMessage =
    document.getElementById(
        "quizBuilderMessage"
    );


const quizQuestionCount =
    document.getElementById(
        "quizQuestionCount"
    );

const quizQuestionList =
    document.getElementById(
        "quizQuestionList"
    );

const quizQuestionsEmpty =
    document.getElementById(
        "quizQuestionsEmpty"
    );

const addQuizQuestionButton =
    document.getElementById(
        "addQuizQuestionButton"
    );


const quizQuestionEditor =
    document.getElementById(
        "quizQuestionEditor"
    );

const quizQuestionEditingId =
    document.getElementById(
        "quizQuestionEditingId"
    );

const quizQuestionEditorTitle =
    document.getElementById(
        "quizQuestionEditorTitle"
    );

const quizQuestionText =
    document.getElementById(
        "quizQuestionText"
    );


const quizAnswerA =
    document.getElementById(
        "quizAnswerA"
    );

const quizAnswerB =
    document.getElementById(
        "quizAnswerB"
    );

const quizAnswerC =
    document.getElementById(
        "quizAnswerC"
    );

const quizAnswerD =
    document.getElementById(
        "quizAnswerD"
    );


const quizCorrectAnswer =
    document.getElementById(
        "quizCorrectAnswer"
    );

const quizCorrectButtons =
    Array.from(
        document.querySelectorAll(
            "[data-correct-answer]"
        )
    );


const quizQuestionAnswerTime =
    document.getElementById(
        "quizQuestionAnswerTime"
    );


const quizSaveQuestionButton =
    document.getElementById(
        "quizSaveQuestionButton"
    );

const quizCancelQuestionButton =
    document.getElementById(
        "quizCancelQuestionButton"
    );

const quizDeleteQuestionButton =
    document.getElementById(
        "quizDeleteQuestionButton"
    );


const quizResetBuilderButton =
    document.getElementById(
        "quizResetBuilderButton"
    );

const saveQuizButton =
    document.getElementById(
        "saveQuizButton"
    );

const quizDuplicateCurrentButton =
    document.getElementById(
        "quizDuplicateCurrentButton"
    );


const quizQuestionListItemTemplate =
    document.getElementById(
        "quizQuestionListItemTemplate"
    );


/* =====================================================
   SAVED QUIZ ELEMENTS
===================================================== */

const savedQuizCardTemplate =
    document.getElementById(
        "savedQuizCardTemplate"
    );

const savedQuizzesList =
    document.getElementById(
        "savedQuizzesList"
    );

const savedQuizzesEmpty =
    document.getElementById(
        "savedQuizzesEmpty"
    );

const createQuizFromSavedButton =
    document.getElementById(
        "createQuizFromSavedButton"
    );


/* =====================================================
   LIVE QUIZ ELEMENTS
===================================================== */

const liveQuizStatusBadge =
    document.getElementById(
        "liveQuizStatusBadge"
    );

const liveQuizSelectedTitle =
    document.getElementById(
        "liveQuizSelectedTitle"
    );

const liveQuizStatus =
    document.getElementById(
        "liveQuizStatus"
    );

const liveQuizPlayerCount =
    document.getElementById(
        "liveQuizPlayerCount"
    );

const liveQuizCurrentQuestion =
    document.getElementById(
        "liveQuizCurrentQuestion"
    );

const liveQuizTotalQuestions =
    document.getElementById(
        "liveQuizTotalQuestions"
    );


const selectQuizForLiveButton =
    document.getElementById(
        "selectQuizForLiveButton"
    );

const openQuizLobbyButton =
    document.getElementById(
        "openQuizLobbyButton"
    );

const startQuizButton =
    document.getElementById(
        "startQuizButton"
    );

const nextQuizQuestionButton =
    document.getElementById(
        "nextQuizQuestionButton"
    );

const finishQuizButton =
    document.getElementById(
        "finishQuizButton"
    );

const closeQuizLobbyButton =
    document.getElementById(
        "closeQuizLobbyButton"
    );


const liveCurrentQuestionControl =
    document.getElementById(
        "liveCurrentQuestionControl"
    );

const currentQuizQuestionNumber =
    document.getElementById(
        "currentQuizQuestionNumber"
    );

const currentQuizQuestionText =
    document.getElementById(
        "currentQuizQuestionText"
    );


const liveQuizAnsweredCount =
    document.getElementById(
        "liveQuizAnsweredCount"
    );

const liveQuizCorrectCount =
    document.getElementById(
        "liveQuizCorrectCount"
    );

const liveQuizWrongCount =
    document.getElementById(
        "liveQuizWrongCount"
    );

const liveQuizNoAnswerCount =
    document.getElementById(
        "liveQuizNoAnswerCount"
    );


const liveQuizMessage =
    document.getElementById(
        "liveQuizMessage"
    );


const liveLobbyPlayerCountBadge =
    document.getElementById(
        "liveLobbyPlayerCountBadge"
    );

const liveQuizPlayersList =
    document.getElementById(
        "liveQuizPlayersList"
    );

const liveQuizPlayersEmpty =
    document.getElementById(
        "liveQuizPlayersEmpty"
    );

const liveQuizPlayerTemplate =
    document.getElementById(
        "liveQuizPlayerTemplate"
    );


const sidebarQuizLiveDot =
    document.getElementById(
        "sidebarQuizLiveDot"
    );


/* =====================================================
   PAST QUIZ ELEMENTS
===================================================== */

const pastQuizzesList =
    document.getElementById(
        "pastQuizzesList"
    );

const pastQuizzesEmpty =
    document.getElementById(
        "pastQuizzesEmpty"
    );

const pastQuizCardTemplate =
    document.getElementById(
        "pastQuizCardTemplate"
    );


/* =====================================================
   DATA
===================================================== */

let allMembers = [];

let allContestEntries = [];

let contestLoaded = false;
let contestLoading = false;
let contestSaving = false;

let contestCurrentPage = 1;
let membersCurrentPage = 1;


let quizDraftQuestions = [];
let quizQuestionCounter = 0;

let savedQuizzes = [];
let pastQuizSessions = [];

let selectedLiveQuiz = null;

let liveQuizPlayers = [];

let liveQuizSession = null;

let liveQuizStatePollTimer = null;
let liveQuizStateLoading = false;

let liveQuizLastTotalQuestions = 0;

let liveQuizLastQuestion = null;

let liveQuizLastStats = {};


/* =====================================================
   BASIC HELPERS
===================================================== */

function cleanText(value) {

    return typeof value === "string"
        ? value.trim()
        : "";

}


function numberOrZero(value) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

}


function createLocalId(prefix) {

    return (
        `${prefix}_` +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );

}


/* =====================================================
   ADMIN MESSAGE
===================================================== */

function setAdminMessage(
    message,
    type = ""
) {

    if (!adminMessage) {
        return;
    }


    adminMessage.textContent =
        message;


    adminMessage.classList.remove(
        "success",
        "error"
    );


    if (type) {

        adminMessage.classList.add(
            type
        );

    }

}


/* =====================================================
   ADMIN IDENTITY
===================================================== */

function setAdminIdentity(message) {

    if (adminIdentity) {

        adminIdentity.textContent =
            message;

    }


    if (sidebarAdminIdentity) {

        sidebarAdminIdentity.textContent =
            message;

    }

}


/* =====================================================
   NORMALIZE X USERNAME
===================================================== */

function normalizeXUsername(value) {

    let username =
        cleanText(value)
            .toLowerCase();


    if (!username) {
        return "";
    }


    while (
        username.startsWith("@")
    ) {

        username =
            username.slice(1);

    }


    return username.replace(
        /\s+/g,
        ""
    );

}


/* =====================================================
   SESSION
===================================================== */

function getSessionToken() {

    return cleanText(
        localStorage.getItem(
            GREMBLE_SESSION_KEY
        )
    );

}


function getSessionExpiry() {

    const raw =
        localStorage.getItem(
            GREMBLE_SESSION_EXPIRY_KEY
        );


    if (!raw) {
        return null;
    }


    const expiry =
        Number(raw);


    return Number.isFinite(expiry)
        ? expiry
        : null;

}


function clearLocalSession() {

    localStorage.removeItem(
        GREMBLE_SESSION_KEY
    );


    localStorage.removeItem(
        GREMBLE_SESSION_EXPIRY_KEY
    );

}


function sessionIsExpired() {

    const expiry =
        getSessionExpiry();


    if (!expiry) {
        return false;
    }


    const nowSeconds =
        Math.floor(
            Date.now() / 1000
        );


    return expiry <=
        nowSeconds;

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(value) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return new Intl.DateTimeFormat(
        "sk-SK",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    ).format(date);

}


/* =====================================================
   SHORT WALLET
===================================================== */

function shortWallet(value) {

    const wallet =
        cleanText(value);


    if (!wallet) {
        return "";
    }


    if (
        wallet.length <= 14
    ) {

        return wallet;

    }


    return (
        wallet.slice(0, 6) +
        "..." +
        wallet.slice(-5)
    );

}


/* =====================================================
   COPY
===================================================== */

async function copyText(
    value,
    button
) {

    const text =
        cleanText(value);


    if (!text) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            text
        );


        if (button) {

            const oldText =
                button.textContent;


            button.textContent =
                "COPIED";


            setTimeout(
                () => {

                    button.textContent =
                        oldText;

                },
                1200
            );

        }

    }
    catch (error) {

        console.error(
            "Copy failed:",
            error
        );

    }

}


/* =====================================================
   TELEGRAM STATUS
===================================================== */

function normalizeTelegramStatus(value) {

    const status =
        cleanText(value)
            .toLowerCase();


    if (
        status === "member" ||
        status === "administrator" ||
        status === "creator" ||
        status === "in_group" ||
        status === "in_chat" ||
        status === "yes"
    ) {

        return "member";

    }


    if (
        status === "not_member" ||
        status === "left" ||
        status === "kicked" ||
        status === "no" ||
        status === "not_in_group" ||
        status === "not_in_chat"
    ) {

        return "not_member";

    }


    return "unknown";

}


function getChatStatus(member) {

    return normalizeTelegramStatus(

        member.telegram_chat_status ??
        member.telegram_group_status ??
        member.chat_status

    );

}


function getAnnouncementsStatus(member) {

    return normalizeTelegramStatus(

        member.telegram_announcements_status ??
        member.telegram_announcement_status ??
        member.announcements_status

    );

}


/* =====================================================
   TELEGRAM BADGE
===================================================== */

function createTelegramBadge(
    status,
    type
) {

    const normalized =
        normalizeTelegramStatus(
            status
        );


    const badge =
        document.createElement(
            "span"
        );


    badge.className =
        "telegram-group-badge";


    if (
        normalized === "member"
    ) {

        badge.classList.add(
            "member"
        );


        badge.textContent =
            type === "announcements"
                ? "✓ IN ANNOUNCEMENTS"
                : "✓ IN CHAT";

    }
    else if (
        normalized === "not_member"
    ) {

        badge.classList.add(
            "not-member"
        );


        badge.textContent =
            type === "announcements"
                ? "× NOT IN ANNOUNCEMENTS"
                : "× NOT IN CHAT";

    }
    else {

        badge.classList.add(
            "unknown"
        );


        badge.textContent =
            "UNKNOWN";

    }


    return badge;

}


/* =====================================================
   COUNTRY
===================================================== */

function countryCodeToFlag(code) {

    const normalized =
        cleanText(code)
            .toUpperCase();


    if (
        !/^[A-Z]{2}$/.test(
            normalized
        )
    ) {

        return "";

    }


    return String.fromCodePoint(

        ...normalized
            .split("")
            .map(
                character =>
                    127397 +
                    character.charCodeAt(0)
            )

    );

}


function createCountryCell(member) {

    const cell =
        document.createElement(
            "td"
        );


    const countryCode =
        cleanText(
            member.country_code
        ).toUpperCase();


    const countryName =
        cleanText(
            member.country_name
        );


    if (
        !countryCode &&
        !countryName
    ) {

        const empty =
            document.createElement(
                "span"
            );


        empty.className =
            "empty-value";


        empty.textContent =
            "—";


        cell.appendChild(
            empty
        );


        return cell;

    }


    const wrapper =
        document.createElement(
            "span"
        );


    wrapper.className =
        "country-cell";


    const flag =
        countryCodeToFlag(
            countryCode
        );


    if (flag) {

        const flagElement =
            document.createElement(
                "span"
            );


        flagElement.className =
            "country-flag";


        flagElement.textContent =
            flag;


        wrapper.appendChild(
            flagElement
        );

    }


    const name =
        document.createElement(
            "span"
        );


    name.className =
        "country-name";


    name.textContent =
        countryCode ||
        countryName;


    name.title =
        countryName
            ? `${countryCode} — ${countryName}`
            : countryCode;


    wrapper.appendChild(
        name
    );


    cell.appendChild(
        wrapper
    );


    return cell;

}


/* =====================================================
   VERIFIED WALLET
===================================================== */

function createVerifiedWalletCell(member) {

    const cell =
        document.createElement(
            "td"
        );


    const walletAddress =
        cleanText(
            member.wallet_address
        );


    const badge =
        document.createElement(
            "span"
        );


    const dot =
        document.createElement(
            "span"
        );


    dot.className =
        "wallet-status-dot";


    if (walletAddress) {

        badge.className =
            "wallet-status-badge yes";


        badge.title =
            walletAddress;


        badge.appendChild(
            dot
        );


        badge.appendChild(
            document.createTextNode(
                "YES"
            )
        );

    }
    else {

        badge.className =
            "wallet-status-badge no";


        badge.appendChild(
            dot
        );


        badge.appendChild(
            document.createTextNode(
                "NO"
            )
        );

    }


    cell.appendChild(
        badge
    );


    return cell;

}


/* =====================================================
   MEMBER STATS
===================================================== */

function updateStats(
    stats = {}
) {

    const totalMembers =
        numberOrZero(

            stats.total_members ??
            allMembers.length

        );


    const completedProfiles =
        numberOrZero(

            stats.completed_profiles ??
            stats.complete_profiles ??
            allMembers.filter(
                member =>

                    cleanText(
                        member.x_username
                    ) &&

                    cleanText(
                        member.solana_address
                    )

            ).length

        );


    const chatMembers =
        numberOrZero(

            stats.telegram_chat_members ??
            stats.chat_members ??
            stats.telegram_group_members ??

            allMembers.filter(
                member =>

                    getChatStatus(
                        member
                    ) === "member"

            ).length

        );


    const announcementsMembers =
        numberOrZero(

            stats.telegram_announcements_members ??
            stats.announcements_members ??

            allMembers.filter(
                member =>

                    getAnnouncementsStatus(
                        member
                    ) === "member"

            ).length

        );


    const membersWithWallet =
        numberOrZero(

            stats.members_with_wallet ??
            stats.wallet_connected ??

            allMembers.filter(
                member =>

                    !!cleanText(
                        member.wallet_address
                    )

            ).length

        );


    if (statTotalMembers) {

        statTotalMembers.textContent =
            String(
                totalMembers
            );

    }


    if (statCompletedProfiles) {

        statCompletedProfiles.textContent =
            String(
                completedProfiles
            );

    }


    if (statTelegramChatMembers) {

        statTelegramChatMembers.textContent =
            String(
                chatMembers
            );

    }


    if (
        statTelegramAnnouncementsMembers
    ) {

        statTelegramAnnouncementsMembers.textContent =
            String(
                announcementsMembers
            );

    }


    if (statMembersWithWallet) {

        statMembersWithWallet.textContent =
            String(
                membersWithWallet
            );

    }

}


/* =====================================================
   CREATE MEMBER ROW
===================================================== */

function createMemberRow(member) {

    const row =
        document.createElement(
            "tr"
        );


    const telegramName =
        cleanText(
            member.telegram_name
        );


    const telegramUsername =
        cleanText(
            member.telegram_username
        );


    const xUsername =
        cleanText(
            member.x_username
        );


    const solanaAddress =
        cleanText(
            member.solana_address
        );


    /* TELEGRAM NAME */

    const telegramNameCell =
        document.createElement(
            "td"
        );


    if (telegramName) {

        const value =
            document.createElement(
                "span"
            );


        value.className =
            "telegram-name";


        value.textContent =
            telegramName;


        value.title =
            telegramName;


        telegramNameCell.appendChild(
            value
        );

    }
    else {

        const empty =
            document.createElement(
                "span"
            );


        empty.className =
            "empty-value";


        empty.textContent =
            "—";


        telegramNameCell.appendChild(
            empty
        );

    }


    /* TELEGRAM USERNAME */

    const telegramUsernameCell =
        document.createElement(
            "td"
        );


    if (telegramUsername) {

        const value =
            document.createElement(
                "span"
            );


        value.className =
            "telegram-username";


        value.textContent =
            telegramUsername.startsWith("@")
                ? telegramUsername
                : `@${telegramUsername}`;


        value.title =
            value.textContent;


        telegramUsernameCell.appendChild(
            value
        );

    }
    else {

        const empty =
            document.createElement(
                "span"
            );


        empty.className =
            "empty-value";


        empty.textContent =
            "NO USERNAME";


        telegramUsernameCell.appendChild(
            empty
        );

    }


    /* CHAT */

    const chatCell =
        document.createElement(
            "td"
        );


    chatCell.appendChild(

        createTelegramBadge(
            getChatStatus(member),
            "chat"
        )

    );


    /* ANNOUNCEMENTS */

    const announcementsCell =
        document.createElement(
            "td"
        );


    announcementsCell.appendChild(

        createTelegramBadge(
            getAnnouncementsStatus(
                member
            ),
            "announcements"
        )

    );


    /* X USERNAME */

    const xUsernameCell =
        document.createElement(
            "td"
        );


    if (xUsername) {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "wallet-cell";


        const value =
            document.createElement(
                "span"
            );


        value.className =
            "x-username";


        value.textContent =
            xUsername.startsWith("@")
                ? xUsername
                : `@${xUsername}`;


        value.title =
            value.textContent;


        const copyButton =
            document.createElement(
                "button"
            );


        copyButton.type =
            "button";


        copyButton.className =
            "copy-button";


        copyButton.textContent =
            "COPY";


        copyButton.addEventListener(
            "click",
            () => {

                copyText(
                    xUsername,
                    copyButton
                );

            }
        );


        wrapper.appendChild(
            value
        );


        wrapper.appendChild(
            copyButton
        );


        xUsernameCell.appendChild(
            wrapper
        );

    }
    else {

        const empty =
            document.createElement(
                "span"
            );


        empty.className =
            "empty-value";


        empty.textContent =
            "NOT ADDED";


        xUsernameCell.appendChild(
            empty
        );

    }


    /* SOLANA */

    const solanaCell =
        document.createElement(
            "td"
        );


    if (solanaAddress) {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "wallet-cell";


        const address =
            document.createElement(
                "span"
            );


        address.className =
            "wallet-address";


        address.textContent =
            shortWallet(
                solanaAddress
            );


        address.title =
            solanaAddress;


        const copyButton =
            document.createElement(
                "button"
            );


        copyButton.type =
            "button";


        copyButton.className =
            "copy-button";


        copyButton.textContent =
            "COPY";


        copyButton.addEventListener(
            "click",
            () => {

                copyText(
                    solanaAddress,
                    copyButton
                );

            }
        );


        wrapper.appendChild(
            address
        );


        wrapper.appendChild(
            copyButton
        );


        solanaCell.appendChild(
            wrapper
        );

    }
    else {

        const empty =
            document.createElement(
                "span"
            );


        empty.className =
            "empty-value";


        empty.textContent =
            "NOT ADDED";


        solanaCell.appendChild(
            empty
        );

    }


    const joinedCell =
        document.createElement(
            "td"
        );


    joinedCell.className =
        "date-value";


    joinedCell.textContent =
        formatDate(
            member.created_at
        );


    const updatedCell =
        document.createElement(
            "td"
        );


    updatedCell.className =
        "date-value";


    updatedCell.textContent =
        formatDate(
            member.updated_at
        );


    const countryCell =
        createCountryCell(
            member
        );


    const verifiedWalletCell =
        createVerifiedWalletCell(
            member
        );


    row.appendChild(
        telegramNameCell
    );

    row.appendChild(
        telegramUsernameCell
    );

    row.appendChild(
        chatCell
    );

    row.appendChild(
        announcementsCell
    );

    row.appendChild(
        xUsernameCell
    );

    row.appendChild(
        solanaCell
    );

    row.appendChild(
        joinedCell
    );

    row.appendChild(
        updatedCell
    );

    row.appendChild(
        countryCell
    );

    row.appendChild(
        verifiedWalletCell
    );


    return row;

}


/* =====================================================
   MEMBERS
===================================================== */

function getFilteredMembers() {

    const search =
        cleanText(
            memberSearch?.value
        ).toLowerCase();


    if (!search) {

        return [
            ...allMembers
        ];

    }


    return allMembers.filter(
        member => {

            const chatStatus =
                getChatStatus(
                    member
                );


            const announcementsStatus =
                getAnnouncementsStatus(
                    member
                );


            const walletAddress =
                cleanText(
                    member.wallet_address
                );


            const hasWallet =
                walletAddress
                    ? "yes wallet connected verified"
                    : "no wallet";


            const values = [

                member.telegram_name,
                member.telegram_username,

                member.x_username,

                member.solana_address,

                member.country_code,
                member.country_name,

                member.wallet_address,
                member.wallet_provider,

                chatStatus,
                announcementsStatus,

                hasWallet

            ];


            return values.some(
                value =>

                    cleanText(value)
                        .toLowerCase()
                        .includes(
                            search
                        )
            );

        }
    );

}


function renderMembers() {

    if (!membersTableBody) {
        return;
    }


    const filteredMembers =
        getFilteredMembers();


    const totalFiltered =
        filteredMembers.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalFiltered /
                MEMBERS_ITEMS_PER_PAGE
            )
        );


    if (
        membersCurrentPage >
        totalPages
    ) {

        membersCurrentPage =
            totalPages;

    }


    if (
        membersCurrentPage < 1
    ) {

        membersCurrentPage =
            1;

    }


    const startIndex =
        (
            membersCurrentPage - 1
        ) *
        MEMBERS_ITEMS_PER_PAGE;


    const endIndex =
        startIndex +
        MEMBERS_ITEMS_PER_PAGE;


    const pageMembers =
        filteredMembers.slice(
            startIndex,
            endIndex
        );


    membersTableBody.innerHTML =
        "";


    if (
        totalFiltered === 0
    ) {

        if (membersEmpty) {

            membersEmpty.hidden =
                false;


            membersEmpty.textContent =
                cleanText(
                    memberSearch?.value
                )
                    ? "NO MATCHING MEMBERS FOUND."
                    : "NO MEMBERS FOUND.";

        }

    }
    else {

        if (membersEmpty) {

            membersEmpty.hidden =
                true;

        }


        const fragment =
            document.createDocumentFragment();


        pageMembers.forEach(
            member => {

                fragment.appendChild(

                    createMemberRow(
                        member
                    )

                );

            }
        );


        membersTableBody.appendChild(
            fragment
        );

    }


    updateMembersPagination(
        totalFiltered,
        totalPages
    );

}


function updateMembersPagination(
    totalFiltered,
    totalPages
) {

    if (!membersPagination) {
        return;
    }


    membersPagination.hidden =
        totalFiltered <=
        MEMBERS_ITEMS_PER_PAGE;


    if (membersPageInfo) {

        membersPageInfo.textContent =
            `${membersCurrentPage} OF ${totalPages}`;

    }


    if (membersPrevPage) {

        membersPrevPage.disabled =
            membersCurrentPage <= 1;

    }


    if (membersNextPage) {

        membersNextPage.disabled =
            membersCurrentPage >=
            totalPages;

    }

}


function goToPreviousMembersPage() {

    if (
        membersCurrentPage <= 1
    ) {
        return;
    }


    membersCurrentPage--;


    renderMembers();

}


function goToNextMembersPage() {

    const filteredMembers =
        getFilteredMembers();


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredMembers.length /
                MEMBERS_ITEMS_PER_PAGE
            )
        );


    if (
        membersCurrentPage >=
        totalPages
    ) {
        return;
    }


    membersCurrentPage++;


    renderMembers();

}


function filterMembers() {

    membersCurrentPage =
        1;


    renderMembers();

}


/* =====================================================
   ACCESS ERROR
===================================================== */

function showAccessError(
    status,
    message
) {

    if (adminDashboard) {

        adminDashboard.hidden =
            true;

    }


    if (openContestPanel) {

        openContestPanel.disabled =
            true;

    }


    if (status === 401) {

        setAdminIdentity(
            "LOGIN REQUIRED"
        );


        setAdminMessage(
            "YOUR GREMBLE LOGIN SESSION IS MISSING OR EXPIRED. GO BACK TO THE WEBSITE AND LOG IN WITH TELEGRAM.",
            "error"
        );


        return;

    }


    if (status === 403) {

        setAdminIdentity(
            "ACCESS DENIED"
        );


        setAdminMessage(
            "THIS TELEGRAM ACCOUNT IS NOT AUTHORIZED TO OPEN THE GREMBLE ADMIN PANEL.",
            "error"
        );


        return;

    }


    setAdminIdentity(
        "ERROR"
    );


    setAdminMessage(
        message ||
        "COULD NOT LOAD THE ADMIN PANEL.",
        "error"
    );

}


/* =====================================================
   LOAD ADMIN DATA
===================================================== */

async function loadAdminData() {

    const token =
        getSessionToken();


    if (!token) {

        showAccessError(
            401
        );

        return;

    }


    if (
        sessionIsExpired()
    ) {

        clearLocalSession();


        showAccessError(
            401
        );


        return;

    }


    setAdminIdentity(
        "VERIFYING..."
    );


    setAdminMessage(
        "VERIFYING YOUR TELEGRAM ID AND LOADING GREMBLE MEMBERS..."
    );


    if (openContestPanel) {

        openContestPanel.disabled =
            true;

    }


    if (refreshMembers) {

        refreshMembers.disabled =
            true;


        refreshMembers.textContent =
            "LOADING...";

    }


    try {

        const response =
            await fetch(
                ADMIN_MEMBERS_ENDPOINT,
                {
                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    },

                    cache:
                        "no-store"
                }
            );


        let result = null;


        try {

            result =
                await response.json();

        }
        catch {

            result = null;

        }


        if (
            response.status === 401
        ) {

            clearLocalSession();


            showAccessError(
                401
            );


            return;

        }


        if (
            response.status === 403
        ) {

            showAccessError(
                403
            );


            return;

        }


        if (
            !response.ok ||
            !result?.success
        ) {

            throw new Error(
                result?.error ||
                "Could not load admin data."
            );

        }


        allMembers =
            Array.isArray(
                result.members
            )
                ? result.members
                : [];


        membersCurrentPage =
            1;


        updateStats(
            result.stats || {}
        );


        renderMembers();


        if (
            contestLoaded
        ) {

            renderContestEntries();

        }


        if (adminDashboard) {

            adminDashboard.hidden =
                false;

        }


        if (openContestPanel) {

            openContestPanel.disabled =
                false;

        }


        setAdminIdentity(
            "VERIFIED ADMIN"
        );


        setAdminMessage(
            `ACCESS GRANTED — ${allMembers.length} GREMBLE MEMBER${allMembers.length === 1 ? "" : "S"} LOADED.`,
            "success"
        );

    }
    catch (error) {

        console.error(
            "Admin panel error:",
            error
        );


        showAccessError(
            500,
            error?.message ||
            "Could not load admin data."
        );

    }
    finally {

        if (refreshMembers) {

            refreshMembers.disabled =
                false;


            refreshMembers.textContent =
                "REFRESH";

        }

    }

}


/* =====================================================
   CONTEST HELPERS
===================================================== */

function findMemberByContestUsername(
    participant
) {

    const contestUsername =
        normalizeXUsername(
            participant
        );


    if (!contestUsername) {
        return null;
    }


    return (

        allMembers.find(
            member => {

                const memberXUsername =
                    normalizeXUsername(
                        member.x_username
                    );


                return (
                    memberXUsername &&
                    memberXUsername ===
                    contestUsername
                );

            }
        ) ||
        null

    );

}


function getContestMemberStatus(entry) {

    const member =
        findMemberByContestUsername(
            entry.participant
        );


    if (!member) {

        return {

            type:
                "not-found",

            tooltip:
                "X USERNAME NOT FOUND"

        };

    }


    const chatStatus =
        getChatStatus(
            member
        );


    const announcementsStatus =
        getAnnouncementsStatus(
            member
        );


    const isInChat =
        chatStatus === "member";


    const isInAnnouncements =
        announcementsStatus ===
        "member";


    if (
        isInChat ||
        isInAnnouncements
    ) {

        let tooltip =
            "VERIFIED + TELEGRAM";


        if (
            isInChat &&
            isInAnnouncements
        ) {

            tooltip =
                "IN CHAT + ANNOUNCEMENTS";

        }
        else if (isInChat) {

            tooltip =
                "IN GREMBLE CHAT";

        }
        else {

            tooltip =
                "IN GREMBLE ANNOUNCEMENTS";

        }


        return {

            type:
                "verified",

            tooltip

        };

    }


    return {

        type:
            "registered",

        tooltip:
            "X FOUND / NOT IN TELEGRAM"

    };

}


function createContestMemberStatus(entry) {

    const status =
        getContestMemberStatus(
            entry
        );


    const wrapper =
        document.createElement(
            "span"
        );


    wrapper.className =
        `contest-member-status ${status.type}`;


    wrapper.setAttribute(
        "data-tooltip",
        status.tooltip
    );


    wrapper.setAttribute(
        "aria-label",
        status.tooltip
    );


    const dot =
        document.createElement(
            "span"
        );


    dot.className =
        "contest-member-status-dot";


    wrapper.appendChild(
        dot
    );


    return wrapper;

}


function setContestMessage(
    message,
    type = ""
) {

    if (!contestFormMessage) {
        return;
    }


    contestFormMessage.textContent =
        message;


    contestFormMessage.classList.remove(
        "success",
        "error"
    );


    if (type) {

        contestFormMessage.classList.add(
            type
        );

    }

}


function setContestRequirements(
    isVerified
) {

    if (contestRequirementsValue) {

        contestRequirementsValue.value =
            isVerified
                ? "true"
                : "false";

    }


    if (contestRequirementsYes) {

        contestRequirementsYes.classList.toggle(
            "active",
            isVerified
        );

    }


    if (contestRequirementsNo) {

        contestRequirementsNo.classList.toggle(
            "active",
            !isVerified
        );

    }

}


function updateContestStats() {

    const total =
        allContestEntries.length;


    const verified =
        allContestEntries.filter(
            entry =>
                entry.requirements_ok ===
                true
        ).length;


    if (contestTotalEntries) {

        contestTotalEntries.textContent =
            String(
                total
            );

    }


    if (contestVerifiedEntries) {

        contestVerifiedEntries.textContent =
            String(
                verified
            );

    }

}


function getFilteredContestEntries() {

    const search =
        cleanText(
            contestSearch?.value
        ).toLowerCase();


    if (!search) {

        return [
            ...allContestEntries
        ];

    }


    const normalizedSearch =
        normalizeXUsername(
            search
        );


    return allContestEntries.filter(
        entry => {

            const participant =
                normalizeXUsername(
                    entry.participant
                );


            return participant.includes(
                normalizedSearch
            );

        }
    );

}


function sortContestEntries(entries) {

    const sortMode =
        cleanText(
            contestSort?.value
        ) ||
        "newest";


    const sorted =
        [
            ...entries
        ];


    sorted.sort(
        (a, b) => {

            const dateA =
                new Date(
                    a.created_at
                ).getTime() ||
                0;


            const dateB =
                new Date(
                    b.created_at
                ).getTime() ||
                0;


            const pointsA =
                numberOrZero(
                    a.points
                );


            const pointsB =
                numberOrZero(
                    b.points
                );


            const rulesA =
                a.requirements_ok === true
                    ? 1
                    : 0;


            const rulesB =
                b.requirements_ok === true
                    ? 1
                    : 0;


            if (
                sortMode === "oldest"
            ) {

                return dateA - dateB;

            }


            if (
                sortMode === "points-high"
            ) {

                if (
                    pointsB !== pointsA
                ) {

                    return pointsB - pointsA;

                }


                return dateB - dateA;

            }


            if (
                sortMode === "points-low"
            ) {

                if (
                    pointsA !== pointsB
                ) {

                    return pointsA - pointsB;

                }


                return dateB - dateA;

            }


            if (
                sortMode === "rules-yes"
            ) {

                if (
                    rulesB !== rulesA
                ) {

                    return rulesB - rulesA;

                }


                return dateB - dateA;

            }


            if (
                sortMode === "rules-no"
            ) {

                if (
                    rulesA !== rulesB
                ) {

                    return rulesA - rulesB;

                }


                return dateB - dateA;

            }


            return dateB - dateA;

        }
    );


    return sorted;

}


/* =====================================================
   CREATE CONTEST ROW
===================================================== */

function createContestRow(entry) {

    const row =
        document.createElement(
            "tr"
        );


    const participantCell =
        document.createElement(
            "td"
        );


    const participant =
        document.createElement(
            "span"
        );


    participant.className =
        "contest-participant";


    participant.textContent =
        cleanText(
            entry.participant
        ) ||
        "—";


    participantCell.appendChild(
        participant
    );


    const memeCell =
        document.createElement(
            "td"
        );


    const memeUrl =
        cleanText(
            entry.meme_url
        );


    if (memeUrl) {

        const memeLink =
            document.createElement(
                "a"
            );


        memeLink.className =
            "contest-link";


        memeLink.href =
            memeUrl;


        memeLink.target =
            "_blank";


        memeLink.rel =
            "noopener noreferrer";


        memeLink.textContent =
            "OPEN MEME ↗";


        memeCell.appendChild(
            memeLink
        );

    }
    else {

        memeCell.textContent =
            "—";

    }


    const pointsCell =
        document.createElement(
            "td"
        );


    pointsCell.className =
        "contest-points";


    pointsCell.textContent =
        String(
            numberOrZero(
                entry.points
            )
        );


    const rulesCell =
        document.createElement(
            "td"
        );


    const rulesBadge =
        document.createElement(
            "span"
        );


    const requirementsOk =
        entry.requirements_ok === true;


    rulesBadge.className =
        requirementsOk
            ? "contest-rule-badge yes"
            : "contest-rule-badge no";


    rulesBadge.textContent =
        requirementsOk
            ? "YES"
            : "NO";


    rulesCell.appendChild(
        rulesBadge
    );


    const addedCell =
        document.createElement(
            "td"
        );


    addedCell.className =
        "date-value";


    addedCell.textContent =
        formatDate(
            entry.created_at
        );


    const actionsCell =
        document.createElement(
            "td"
        );


    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "contest-actions";


    const editButton =
        document.createElement(
            "button"
        );


    editButton.type =
        "button";


    editButton.className =
        "contest-action-button edit";


    editButton.textContent =
        "EDIT";


    editButton.addEventListener(
        "click",
        () => {

            startContestEdit(
                entry
            );

        }
    );


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "contest-action-button delete";


    deleteButton.textContent =
        "DELETE";


    deleteButton.addEventListener(
        "click",
        () => {

            deleteContestEntry(
                entry
            );

        }
    );


    actions.appendChild(
        editButton
    );


    actions.appendChild(
        deleteButton
    );


    actionsCell.appendChild(
        actions
    );


    const statusCell =
        document.createElement(
            "td"
        );


    statusCell.className =
        "contest-member-status-cell";


    statusCell.appendChild(

        createContestMemberStatus(
            entry
        )

    );


    row.appendChild(
        participantCell
    );

    row.appendChild(
        memeCell
    );

    row.appendChild(
        pointsCell
    );

    row.appendChild(
        rulesCell
    );

    row.appendChild(
        addedCell
    );

    row.appendChild(
        actionsCell
    );

    row.appendChild(
        statusCell
    );


    return row;

}


/* =====================================================
   RENDER CONTEST
===================================================== */

function renderContestEntries() {

    if (!contestTableBody) {
        return;
    }


    const filtered =
        getFilteredContestEntries();


    const sorted =
        sortContestEntries(
            filtered
        );


    const totalFiltered =
        sorted.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalFiltered /
                CONTEST_ITEMS_PER_PAGE
            )
        );


    if (
        contestCurrentPage >
        totalPages
    ) {

        contestCurrentPage =
            totalPages;

    }


    if (
        contestCurrentPage < 1
    ) {

        contestCurrentPage =
            1;

    }


    const startIndex =
        (
            contestCurrentPage - 1
        ) *
        CONTEST_ITEMS_PER_PAGE;


    const pageEntries =
        sorted.slice(

            startIndex,

            startIndex +
            CONTEST_ITEMS_PER_PAGE

        );


    contestTableBody.innerHTML =
        "";


    const fragment =
        document.createDocumentFragment();


    pageEntries.forEach(
        entry => {

            fragment.appendChild(

                createContestRow(
                    entry
                )

            );

        }
    );


    contestTableBody.appendChild(
        fragment
    );


    if (contestEntriesLabel) {

        const hasSearch =
            !!cleanText(
                contestSearch?.value
            );


        if (hasSearch) {

            contestEntriesLabel.textContent =
                `${totalFiltered} ${totalFiltered === 1 ? "MATCH" : "MATCHES"}`;

        }
        else {

            contestEntriesLabel.textContent =
                `${allContestEntries.length} ${allContestEntries.length === 1 ? "ENTRY" : "ENTRIES"}`;

        }

    }


    if (contestEmpty) {

        contestEmpty.hidden =
            totalFiltered > 0;


        if (
            totalFiltered === 0
        ) {

            contestEmpty.textContent =
                cleanText(
                    contestSearch?.value
                )
                    ? "NO MATCHING PARTICIPANT."
                    : "NO CONTEST ENTRIES YET.";

        }

    }


    updateContestPagination(
        totalFiltered,
        totalPages
    );


    updateContestStats();

}


function updateContestPagination(
    totalFiltered,
    totalPages
) {

    if (!contestPagination) {
        return;
    }


    contestPagination.hidden =
        totalFiltered <=
        CONTEST_ITEMS_PER_PAGE;


    if (contestPageInfo) {

        contestPageInfo.textContent =
            `${contestCurrentPage} OF ${totalPages}`;

    }


    if (contestPrevPage) {

        contestPrevPage.disabled =
            contestCurrentPage <= 1;

    }


    if (contestNextPage) {

        contestNextPage.disabled =
            contestCurrentPage >=
            totalPages;

    }

}


function goToPreviousContestPage() {

    if (
        contestCurrentPage <= 1
    ) {
        return;
    }


    contestCurrentPage--;


    renderContestEntries();

}


function goToNextContestPage() {

    const filtered =
        getFilteredContestEntries();


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filtered.length /
                CONTEST_ITEMS_PER_PAGE
            )
        );


    if (
        contestCurrentPage >=
        totalPages
    ) {
        return;
    }


    contestCurrentPage++;


    renderContestEntries();

}


function filterContestEntries() {

    contestCurrentPage =
        1;


    renderContestEntries();

}


function changeContestSort() {

    contestCurrentPage =
        1;


    renderContestEntries();

}


/* =====================================================
   CONTEST FORM
===================================================== */

function resetContestForm() {

    if (contestEntryId) {

        contestEntryId.value =
            "";

    }


    if (contestParticipant) {

        contestParticipant.value =
            "";

    }


    if (contestMemeUrl) {

        contestMemeUrl.value =
            "";

    }


    if (contestPoints) {

        contestPoints.value =
            "0";

    }


    setContestRequirements(
        false
    );


    if (contestSubmitButton) {

        contestSubmitButton.textContent =
            "+ ADD PARTICIPANT";

    }


    if (contestCancelEdit) {

        contestCancelEdit.hidden =
            true;

    }


    const title =
        document.querySelector(
            ".contest-form-title"
        );


    if (title) {

        title.textContent =
            "ADD NEW ENTRY";

    }


    setContestMessage(
        ""
    );

}


function startContestEdit(entry) {

    if (!entry) {
        return;
    }


    if (contestEntryId) {

        contestEntryId.value =
            String(
                entry.id
            );

    }


    if (contestParticipant) {

        contestParticipant.value =
            cleanText(
                entry.participant
            );

    }


    if (contestMemeUrl) {

        contestMemeUrl.value =
            cleanText(
                entry.meme_url
            );

    }


    if (contestPoints) {

        contestPoints.value =
            String(
                numberOrZero(
                    entry.points
                )
            );

    }


    setContestRequirements(
        entry.requirements_ok === true
    );


    if (contestSubmitButton) {

        contestSubmitButton.textContent =
            "SAVE CHANGES";

    }


    if (contestCancelEdit) {

        contestCancelEdit.hidden =
            false;

    }


    const title =
        document.querySelector(
            ".contest-form-title"
        );


    if (title) {

        title.textContent =
            "EDIT ENTRY";

    }


    setContestMessage(
        `EDITING ${cleanText(entry.participant) || "PARTICIPANT"}`
    );


    contestParticipant?.focus();

}


/* =====================================================
   CONTEST REQUEST
===================================================== */

async function contestRequest(
    method,
    body = null
) {

    const token =
        getSessionToken();


    if (!token) {

        throw new Error(
            "LOGIN REQUIRED."
        );

    }


    if (
        sessionIsExpired()
    ) {

        clearLocalSession();


        throw new Error(
            "YOUR SESSION HAS EXPIRED. LOG IN AGAIN."
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


    if (
        body !== null
    ) {

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
            ADMIN_CONTEST_ENDPOINT,
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
        response.status === 401
    ) {

        clearLocalSession();


        throw new Error(
            "YOUR SESSION HAS EXPIRED. LOG IN AGAIN."
        );

    }


    if (
        response.status === 403
    ) {

        throw new Error(
            "ADMIN ACCESS DENIED."
        );

    }


    if (
        !response.ok ||
        !result?.success
    ) {

        throw new Error(
            result?.error ||
            "CONTEST REQUEST FAILED."
        );

    }


    return result;

}


/* =====================================================
   LOAD CONTEST
===================================================== */

async function loadContestEntries(
    force = false
) {

    if (contestLoading) {
        return;
    }


    if (
        contestLoaded &&
        !force
    ) {
        return;
    }


    contestLoading =
        true;


    setContestMessage(
        "LOADING CONTEST ENTRIES..."
    );


    try {

        const result =
            await contestRequest(
                "GET"
            );


        allContestEntries =
            Array.isArray(
                result.entries
            )
                ? result.entries
                : [];


        contestLoaded =
            true;


        contestCurrentPage =
            1;


        renderContestEntries();


        setContestMessage(
            `${allContestEntries.length} CONTEST ${allContestEntries.length === 1 ? "ENTRY" : "ENTRIES"} LOADED.`,
            "success"
        );

    }
    catch (error) {

        console.error(
            "Contest load error:",
            error
        );


        setContestMessage(
            error?.message ||
            "COULD NOT LOAD CONTEST ENTRIES.",
            "error"
        );

    }
    finally {

        contestLoading =
            false;

    }

}


/* =====================================================
   SAVE CONTEST ENTRY
===================================================== */

async function saveContestEntry(event) {

    event.preventDefault();


    if (contestSaving) {
        return;
    }


    const participant =
        cleanText(
            contestParticipant?.value
        );


    const memeUrl =
        cleanText(
            contestMemeUrl?.value
        );


    const points =
        Number(
            contestPoints?.value
        );


    const requirementsOk =
        contestRequirementsValue?.value ===
        "true";


    const editingId =
        Number(
            contestEntryId?.value
        );


    if (!participant) {

        setContestMessage(
            "ENTER PARTICIPANT X USERNAME.",
            "error"
        );


        contestParticipant?.focus();


        return;

    }


    if (!memeUrl) {

        setContestMessage(
            "ENTER MEME LINK.",
            "error"
        );


        contestMemeUrl?.focus();


        return;

    }


    try {

        const parsedUrl =
            new URL(
                memeUrl
            );


        if (
            parsedUrl.protocol !== "https:" &&
            parsedUrl.protocol !== "http:"
        ) {

            throw new Error();

        }

    }
    catch {

        setContestMessage(
            "ENTER A VALID MEME LINK.",
            "error"
        );


        contestMemeUrl?.focus();


        return;

    }


    if (
        !Number.isInteger(points) ||
        points < 0 ||
        points > 100000
    ) {

        setContestMessage(
            "POINTS MUST BE A WHOLE NUMBER FROM 0 TO 100000.",
            "error"
        );


        contestPoints?.focus();


        return;

    }


    const isEditing =
        Number.isSafeInteger(
            editingId
        ) &&
        editingId > 0;


    contestSaving =
        true;


    if (contestSubmitButton) {

        contestSubmitButton.disabled =
            true;


        contestSubmitButton.textContent =
            isEditing
                ? "SAVING..."
                : "ADDING...";

    }


    setContestMessage(
        isEditing
            ? "SAVING CHANGES..."
            : "ADDING PARTICIPANT..."
    );


    try {

        const payload = {

            participant,

            meme_url:
                memeUrl,

            points,

            requirements_ok:
                requirementsOk

        };


        if (isEditing) {

            payload.id =
                editingId;

        }


        await contestRequest(
            isEditing
                ? "PUT"
                : "POST",
            payload
        );


        resetContestForm();


        contestLoaded =
            false;


        await loadContestEntries(
            true
        );


        setContestMessage(
            isEditing
                ? "PARTICIPANT UPDATED."
                : "PARTICIPANT ADDED.",
            "success"
        );

    }
    catch (error) {

        console.error(
            "Contest save error:",
            error
        );


        setContestMessage(
            error?.message ||
            "COULD NOT SAVE PARTICIPANT.",
            "error"
        );

    }
    finally {

        contestSaving =
            false;


        if (contestSubmitButton) {

            contestSubmitButton.disabled =
                false;


            const stillEditing =
                Number(
                    contestEntryId?.value
                ) > 0;


            contestSubmitButton.textContent =
                stillEditing
                    ? "SAVE CHANGES"
                    : "+ ADD PARTICIPANT";

        }

    }

}


/* =====================================================
   DELETE CONTEST ENTRY
===================================================== */

async function deleteContestEntry(entry) {

    if (!entry) {
        return;
    }


    const participant =
        cleanText(
            entry.participant
        ) ||
        "THIS PARTICIPANT";


    const confirmed =
        window.confirm(
            `Delete ${participant} from the contest?`
        );


    if (!confirmed) {
        return;
    }


    try {

        setContestMessage(
            `DELETING ${participant}...`
        );


        await contestRequest(
            "DELETE",
            {
                id:
                    Number(
                        entry.id
                    )
            }
        );


        if (
            Number(
                contestEntryId?.value
            ) ===
            Number(
                entry.id
            )
        ) {

            resetContestForm();

        }


        contestLoaded =
            false;


        await loadContestEntries(
            true
        );


        setContestMessage(
            `${participant} DELETED.`,
            "success"
        );

    }
    catch (error) {

        console.error(
            "Contest delete error:",
            error
        );


        setContestMessage(
            error?.message ||
            "COULD NOT DELETE PARTICIPANT.",
            "error"
        );

    }

}


async function openContest() {

    if (!contestPanel) {
        return;
    }


    contestPanel.hidden =
        false;


    await loadContestEntries();

}


function closeContest() {

    resetContestForm();

}


/* =====================================================
   QUIZ MESSAGES
===================================================== */

function setQuizBuilderMessage(
    message,
    type = ""
) {

    if (!quizBuilderMessage) {
        return;
    }


    quizBuilderMessage.textContent =
        message;


    quizBuilderMessage.classList.remove(
        "success",
        "error"
    );


    if (type) {

        quizBuilderMessage.classList.add(
            type
        );

    }

}


function setLiveQuizMessage(
    message,
    type = ""
) {

    if (!liveQuizMessage) {
        return;
    }


    liveQuizMessage.textContent =
        message;


    liveQuizMessage.classList.remove(
        "success",
        "error"
    );


    if (type) {

        liveQuizMessage.classList.add(
            type
        );

    }

}


/* =====================================================
   QUIZ QUESTION TIME
===================================================== */

function normalizeQuizAnswerTime(value) {

    const seconds =
        Number(value);


    if (
        QUIZ_ANSWER_TIME_OPTIONS.includes(
            seconds
        )
    ) {

        return seconds;

    }


    return QUIZ_DEFAULT_ANSWER_TIME;

}


/* =====================================================
   QUIZ QUESTION EDITOR
===================================================== */

function resetQuizQuestionEditor() {

    if (quizQuestionEditingId) {

        quizQuestionEditingId.value =
            "";

    }


    if (quizQuestionText) {

        quizQuestionText.value =
            "";

    }


    if (quizAnswerA) {

        quizAnswerA.value =
            "";

    }


    if (quizAnswerB) {

        quizAnswerB.value =
            "";

    }


    if (quizAnswerC) {

        quizAnswerC.value =
            "";

    }


    if (quizAnswerD) {

        quizAnswerD.value =
            "";

    }


    if (quizCorrectAnswer) {

        quizCorrectAnswer.value =
            "";

    }


    if (quizQuestionAnswerTime) {

        quizQuestionAnswerTime.value =
            String(
                QUIZ_DEFAULT_ANSWER_TIME
            );

    }


    quizCorrectButtons.forEach(
        button =>

            button.classList.remove(
                "active"
            )
    );


    if (quizQuestionEditorTitle) {

        quizQuestionEditorTitle.textContent =
            "Add Question";

    }


    if (quizDeleteQuestionButton) {

        quizDeleteQuestionButton.hidden =
            true;

    }

}


function closeQuizQuestionEditor() {

    resetQuizQuestionEditor();


    if (quizQuestionEditor) {

        quizQuestionEditor.hidden =
            true;

    }

}


function openQuizQuestionEditor(
    question = null
) {

    resetQuizQuestionEditor();


    if (!quizQuestionEditor) {
        return;
    }


    quizQuestionEditor.hidden =
        false;


    if (question) {

        if (quizQuestionEditingId) {

            quizQuestionEditingId.value =
                String(
                    question.local_id
                );

        }


        if (quizQuestionEditorTitle) {

            quizQuestionEditorTitle.textContent =
                "Edit Question";

        }


        if (quizQuestionText) {

            quizQuestionText.value =
                cleanText(
                    question.question
                );

        }


        if (quizAnswerA) {

            quizAnswerA.value =
                cleanText(
                    question.answer_a
                );

        }


        if (quizAnswerB) {

            quizAnswerB.value =
                cleanText(
                    question.answer_b
                );

        }


        if (quizAnswerC) {

            quizAnswerC.value =
                cleanText(
                    question.answer_c
                );

        }


        if (quizAnswerD) {

            quizAnswerD.value =
                cleanText(
                    question.answer_d
                );

        }


        if (quizCorrectAnswer) {

            quizCorrectAnswer.value =
                cleanText(
                    question.correct_answer
                ).toUpperCase();

        }


        if (quizQuestionAnswerTime) {

            quizQuestionAnswerTime.value =
                String(
                    normalizeQuizAnswerTime(

                        question.answer_time_seconds ??
                        question.time_seconds

                    )
                );

        }


        quizCorrectButtons.forEach(
            button =>

                button.classList.toggle(
                    "active",
                    button.dataset.correctAnswer ===
                    cleanText(
                        question.correct_answer
                    ).toUpperCase()
                )
        );


        if (quizDeleteQuestionButton) {

            quizDeleteQuestionButton.hidden =
                false;

        }

    }


    quizQuestionText?.focus();

}


function selectQuizCorrectAnswer(answer) {

    const normalized =
        cleanText(
            answer
        ).toUpperCase();


    if (
        ![
            "A",
            "B",
            "C",
            "D"
        ].includes(
            normalized
        )
    ) {
        return;
    }


    if (quizCorrectAnswer) {

        quizCorrectAnswer.value =
            normalized;

    }


    quizCorrectButtons.forEach(
        button =>

            button.classList.toggle(
                "active",
                button.dataset.correctAnswer ===
                normalized
            )
    );

}


/* =====================================================
   GET QUESTION DATA
===================================================== */

function getQuestionEditorData() {

    const question =
        cleanText(
            quizQuestionText?.value
        );


    const answerA =
        cleanText(
            quizAnswerA?.value
        );


    const answerB =
        cleanText(
            quizAnswerB?.value
        );


    const answerC =
        cleanText(
            quizAnswerC?.value
        );


    const answerD =
        cleanText(
            quizAnswerD?.value
        );


    const correctAnswer =
        cleanText(
            quizCorrectAnswer?.value
        ).toUpperCase();


    const answerTime =
        normalizeQuizAnswerTime(
            quizQuestionAnswerTime?.value
        );


    if (!question) {

        throw new Error(
            "WRITE THE QUESTION."
        );

    }


    if (
        !answerA ||
        !answerB ||
        !answerC ||
        !answerD
    ) {

        throw new Error(
            "ADD ALL 4 ANSWERS."
        );

    }


    if (
        ![
            "A",
            "B",
            "C",
            "D"
        ].includes(
            correctAnswer
        )
    ) {

        throw new Error(
            "SELECT ONE CORRECT ANSWER."
        );

    }


    return {

        question,

        answer_a:
            answerA,

        answer_b:
            answerB,

        answer_c:
            answerC,

        answer_d:
            answerD,

        correct_answer:
            correctAnswer,

        read_time_seconds:
            QUIZ_READ_TIME_SECONDS,

        answer_time_seconds:
            answerTime,

        max_score:
            QUIZ_MAX_SCORE

    };

}


/* =====================================================
   SAVE QUESTION
===================================================== */

function saveQuizQuestion() {

    try {

        const questionData =
            getQuestionEditorData();


        const editingId =
            cleanText(
                quizQuestionEditingId?.value
            );


        if (editingId) {

            const index =
                quizDraftQuestions.findIndex(
                    item =>
                        String(
                            item.local_id
                        ) ===
                        editingId
                );


            if (
                index === -1
            ) {

                throw new Error(
                    "QUESTION COULD NOT BE FOUND."
                );

            }


            quizDraftQuestions[
                index
            ] = {

                ...quizDraftQuestions[index],

                ...questionData

            };

        }
        else {

            quizQuestionCounter++;


            quizDraftQuestions.push(
                {

                    local_id:
                        createLocalId(
                            "question"
                        ),

                    sort_order:
                        quizQuestionCounter,

                    ...questionData

                }
            );

        }


        quizDraftQuestions =
            quizDraftQuestions.map(
                (
                    item,
                    index
                ) => ({

                    ...item,

                    sort_order:
                        index + 1

                })
            );


        closeQuizQuestionEditor();


        renderQuizQuestions();


        setQuizBuilderMessage(
            `QUESTION SAVED — ${QUIZ_READ_TIME_SECONDS} SEC READ + ${questionData.answer_time_seconds} SEC ANSWER TIME.`,
            "success"
        );

    }
    catch (error) {

        setQuizBuilderMessage(
            error?.message ||
            "COULD NOT SAVE QUESTION.",
            "error"
        );

    }

}


/* =====================================================
   DELETE QUESTION
===================================================== */

function deleteCurrentQuizQuestion() {

    const editingId =
        cleanText(
            quizQuestionEditingId?.value
        );


    if (!editingId) {
        return;
    }


    const question =
        quizDraftQuestions.find(
            item =>
                String(
                    item.local_id
                ) ===
                editingId
        );


    if (!question) {
        return;
    }


    const confirmed =
        window.confirm(
            "Delete this question?"
        );


    if (!confirmed) {
        return;
    }


    quizDraftQuestions =
        quizDraftQuestions.filter(
            item =>
                String(
                    item.local_id
                ) !==
                editingId
        );


    quizDraftQuestions =
        quizDraftQuestions.map(
            (
                item,
                index
            ) => ({

                ...item,

                sort_order:
                    index + 1

            })
        );


    closeQuizQuestionEditor();


    renderQuizQuestions();


    setQuizBuilderMessage(
        "QUESTION DELETED.",
        "success"
    );

}


function deleteQuizQuestionFromList(
    question
) {

    if (!question) {
        return;
    }


    const confirmed =
        window.confirm(
            "Delete this question?"
        );


    if (!confirmed) {
        return;
    }


    quizDraftQuestions =
        quizDraftQuestions.filter(
            item =>
                item.local_id !==
                question.local_id
        );


    quizDraftQuestions =
        quizDraftQuestions.map(
            (
                item,
                index
            ) => ({

                ...item,

                sort_order:
                    index + 1

            })
        );


    renderQuizQuestions();


    setQuizBuilderMessage(
        "QUESTION DELETED.",
        "success"
    );

}


/* =====================================================
   RENDER QUIZ QUESTIONS
===================================================== */

function renderQuizQuestions() {

    if (!quizQuestionList) {
        return;
    }


    Array.from(
        quizQuestionList.children
    ).forEach(
        child => {

            if (
                child !==
                quizQuestionsEmpty
            ) {

                child.remove();

            }

        }
    );


    if (quizQuestionCount) {

        quizQuestionCount.textContent =
            `${quizDraftQuestions.length} ${quizDraftQuestions.length === 1 ? "QUESTION" : "QUESTIONS"}`;

    }


    if (quizQuestionsEmpty) {

        quizQuestionsEmpty.hidden =
            quizDraftQuestions.length > 0;

    }


    if (!quizQuestionListItemTemplate) {
        return;
    }


    quizDraftQuestions.forEach(
        (
            question,
            index
        ) => {

            const fragment =
                quizQuestionListItemTemplate.content.cloneNode(
                    true
                );


            const title =
                fragment.querySelector(
                    "[data-question-title]"
                );


            const meta =
                fragment.querySelector(
                    "[data-question-meta]"
                );


            const editButton =
                fragment.querySelector(
                    "[data-question-edit]"
                );


            const deleteButton =
                fragment.querySelector(
                    "[data-question-delete]"
                );


            const answerTime =
                normalizeQuizAnswerTime(
                    question.answer_time_seconds
                );


            if (title) {

                title.textContent =
                    `${index + 1}. ${question.question}`;

            }


            if (meta) {

                meta.textContent =
                    `${QUIZ_READ_TIME_SECONDS} SEC READ · ${answerTime} SEC ANSWER · CORRECT ${question.correct_answer} · MAX ${QUIZ_MAX_SCORE} PTS`;

            }


            if (editButton) {

                editButton.addEventListener(
                    "click",
                    () => {

                        openQuizQuestionEditor(
                            question
                        );

                    }
                );

            }


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    () => {

                        deleteQuizQuestionFromList(
                            question
                        );

                    }
                );

            }


            quizQuestionList.appendChild(
                fragment
            );

        }
    );

}


/* =====================================================
   CLEAR QUIZ BUILDER
===================================================== */

function clearQuizBuilder() {

    quizDraftQuestions =
        [];


    quizQuestionCounter =
        0;


    if (quizEditingId) {

        quizEditingId.value =
            "";

    }


    if (quizTitle) {

        quizTitle.value =
            "";

    }


    if (quizDescription) {

        quizDescription.value =
            "";

    }


    if (quizBuilderTitle) {

        quizBuilderTitle.textContent =
            "Create new quiz";

    }


    if (saveQuizButton) {

        saveQuizButton.textContent =
            "SAVE QUIZ";

    }


    if (quizDuplicateCurrentButton) {

        quizDuplicateCurrentButton.hidden =
            true;

    }


    closeQuizQuestionEditor();


    renderQuizQuestions();


    setQuizBuilderMessage(
        ""
    );

}


function resetQuizBuilder() {

    const hasDraft =

        quizDraftQuestions.length > 0 ||

        !!cleanText(
            quizTitle?.value
        ) ||

        !!cleanText(
            quizDescription?.value
        );


    if (hasDraft) {

        const confirmed =
            window.confirm(
                "Start a new quiz? Unsaved changes will be cleared."
            );


        if (!confirmed) {
            return;
        }

    }


    clearQuizBuilder();

}


/* =====================================================
   QUIZ DRAFT PAYLOAD
===================================================== */

function getQuizDraftPayload() {

    const title =
        cleanText(
            quizTitle?.value
        );


    const description =
        cleanText(
            quizDescription?.value
        );


    if (!title) {

        throw new Error(
            "ENTER QUIZ TITLE."
        );

    }


    if (
        quizDraftQuestions.length === 0
    ) {

        throw new Error(
            "ADD AT LEAST ONE QUESTION."
        );

    }


    const questions =
        quizDraftQuestions.map(
            (
                question,
                index
            ) => ({

                question:
                    cleanText(
                        question.question
                    ),

                answer_a:
                    cleanText(
                        question.answer_a
                    ),

                answer_b:
                    cleanText(
                        question.answer_b
                    ),

                answer_c:
                    cleanText(
                        question.answer_c
                    ),

                answer_d:
                    cleanText(
                        question.answer_d
                    ),

                correct_answer:
                    cleanText(
                        question.correct_answer
                    ).toUpperCase(),

                sort_order:
                    index + 1,

                read_time_seconds:
                    QUIZ_READ_TIME_SECONDS,

                answer_time_seconds:
                    normalizeQuizAnswerTime(
                        question.answer_time_seconds
                    ),

                max_score:
                    QUIZ_MAX_SCORE

            })
        );


    return {

        id:
            cleanText(
                quizEditingId?.value
            ) ||
            null,

        title,

        description,

        questions

    };

}


/* =====================================================
   QUIZ ADMIN REQUEST
===================================================== */

async function quizAdminRequest(
    method,
    body = null
) {

    const token =
        getSessionToken();


    if (!token) {

        throw new Error(
            "LOGIN REQUIRED."
        );

    }


    if (
        sessionIsExpired()
    ) {

        clearLocalSession();


        throw new Error(
            "YOUR SESSION HAS EXPIRED. LOG IN AGAIN."
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


    if (
        body !== null
    ) {

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
            ADMIN_QUIZ_ENDPOINT,
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
        response.status === 401
    ) {

        clearLocalSession();


        throw new Error(
            "YOUR SESSION HAS EXPIRED. LOG IN AGAIN."
        );

    }


    if (
        response.status === 403
    ) {

        throw new Error(
            "ADMIN ACCESS DENIED."
        );

    }


    if (
        !response.ok ||
        !result?.success
    ) {

        throw new Error(
            result?.error ||
            "QUIZ REQUEST FAILED."
        );

    }


    return result;

}


/* =====================================================
   SAVE QUIZ
===================================================== */

async function saveQuiz(event) {

    event?.preventDefault();


    try {

        const payload =
            getQuizDraftPayload();


        if (saveQuizButton) {

            saveQuizButton.disabled =
                true;


            saveQuizButton.textContent =
                "SAVING...";

        }


        const isEditing =
            !!payload.id;


        const result =
            await quizAdminRequest(
                isEditing
                    ? "PUT"
                    : "POST",
                payload
            );


        setQuizBuilderMessage(
            isEditing
                ? "QUIZ UPDATED."
                : "QUIZ SAVED.",
            "success"
        );


        await loadSavedQuizzes(
            true
        );


        if (result.quiz) {

            loadQuizIntoBuilder(
                result.quiz
            );

        }

    }
    catch (error) {

        console.error(
            "Quiz save error:",
            error
        );


        setQuizBuilderMessage(
            error?.message ||
            "COULD NOT SAVE QUIZ.",
            "error"
        );

    }
    finally {

        if (saveQuizButton) {

            saveQuizButton.disabled =
                false;


            saveQuizButton.textContent =
                cleanText(
                    quizEditingId?.value
                )
                    ? "SAVE CHANGES"
                    : "SAVE QUIZ";

        }

    }

}


/* =====================================================
   LOAD SAVED QUIZZES
===================================================== */

async function loadSavedQuizzes() {

    try {

        const result =
            await quizAdminRequest(
                "GET"
            );


        savedQuizzes =
            Array.isArray(
                result.quizzes
            )
                ? result.quizzes
                : [];


        renderSavedQuizzes();

    }
    catch (error) {

        console.error(
            "Load saved quizzes error:",
            error
        );

    }

}


/* =====================================================
   LOAD QUIZ INTO BUILDER
===================================================== */

function loadQuizIntoBuilder(quiz) {

    if (!quiz) {
        return;
    }


    if (quizEditingId) {

        quizEditingId.value =
            String(
                quiz.id ??
                ""
            );

    }


    if (quizTitle) {

        quizTitle.value =
            cleanText(
                quiz.title
            );

    }


    if (quizDescription) {

        quizDescription.value =
            cleanText(
                quiz.description
            );

    }


    quizDraftQuestions =
        Array.isArray(
            quiz.questions
        )
            ? quiz.questions.map(
                (
                    question,
                    index
                ) => ({

                    ...question,

                    local_id:
                        question.local_id ||
                        question.id ||
                        createLocalId(
                            "question"
                        ),

                    sort_order:
                        index + 1,

                    read_time_seconds:
                        QUIZ_READ_TIME_SECONDS,

                    answer_time_seconds:
                        normalizeQuizAnswerTime(

                            question.answer_time_seconds ??
                            question.time_seconds

                        ),

                    max_score:
                        QUIZ_MAX_SCORE

                })
            )
            : [];


    quizQuestionCounter =
        quizDraftQuestions.length;


    if (quizBuilderTitle) {

        quizBuilderTitle.textContent =
            "Edit quiz";

    }


    if (saveQuizButton) {

        saveQuizButton.textContent =
            "SAVE CHANGES";

    }


    if (quizDuplicateCurrentButton) {

        quizDuplicateCurrentButton.hidden =
            false;

    }


    closeQuizQuestionEditor();


    renderQuizQuestions();


    setQuizBuilderMessage(
        `EDITING "${cleanText(quiz.title) || "QUIZ"}".`
    );

}


/* =====================================================
   DUPLICATE QUIZ
===================================================== */

function duplicateCurrentQuiz() {

    const currentTitle =
        cleanText(
            quizTitle?.value
        );


    if (!currentTitle) {

        setQuizBuilderMessage(
            "ENTER OR LOAD A QUIZ FIRST.",
            "error"
        );


        return;

    }


    if (quizEditingId) {

        quizEditingId.value =
            "";

    }


    if (quizTitle) {

        quizTitle.value =
            `${currentTitle} COPY`;

    }


    quizDraftQuestions =
        quizDraftQuestions.map(
            (
                question,
                index
            ) => ({

                ...question,

                local_id:
                    createLocalId(
                        "question"
                    ),

                sort_order:
                    index + 1,

                read_time_seconds:
                    QUIZ_READ_TIME_SECONDS,

                answer_time_seconds:
                    normalizeQuizAnswerTime(
                        question.answer_time_seconds
                    ),

                max_score:
                    QUIZ_MAX_SCORE

            })
        );


    if (quizBuilderTitle) {

        quizBuilderTitle.textContent =
            "Duplicate quiz";

    }


    if (saveQuizButton) {

        saveQuizButton.textContent =
            "SAVE QUIZ";

    }


    if (quizDuplicateCurrentButton) {

        quizDuplicateCurrentButton.hidden =
            true;

    }


    renderQuizQuestions();


    setQuizBuilderMessage(
        "QUIZ DUPLICATED AS A NEW DRAFT.",
        "success"
    );

}


/* =====================================================
   DELETE SAVED QUIZ
===================================================== */

async function deleteSavedQuiz(quiz) {

    if (!quiz) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${cleanText(quiz.title) || "this quiz"}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await quizAdminRequest(
            "DELETE",
            {
                id:
                    quiz.id
            }
        );


        await loadSavedQuizzes(
            true
        );

    }
    catch (error) {

        console.error(
            "Delete quiz error:",
            error
        );


        setQuizBuilderMessage(
            error?.message ||
            "COULD NOT DELETE QUIZ.",
            "error"
        );

    }

}


/* =====================================================
   QUIZ TAB
===================================================== */

function clickQuizTab(name) {

    const button =
        document.querySelector(
            `[data-quiz-subview="${name}"]`
        );


    if (button) {

        button.click();

    }

}


/* =====================================================
   RENDER SAVED QUIZZES
===================================================== */

function renderSavedQuizzes() {

    if (!savedQuizzesList) {
        return;
    }


    Array.from(
        savedQuizzesList.children
    ).forEach(
        child => {

            if (
                child !==
                savedQuizzesEmpty
            ) {

                child.remove();

            }

        }
    );


    if (savedQuizzesEmpty) {

        savedQuizzesEmpty.hidden =
            savedQuizzes.length > 0;

    }


    if (!savedQuizCardTemplate) {
        return;
    }


    savedQuizzes.forEach(
        quiz => {

            const fragment =
                savedQuizCardTemplate.content.cloneNode(
                    true
                );


            const title =
                fragment.querySelector(
                    "[data-saved-quiz-title]"
                );


            const meta =
                fragment.querySelector(
                    "[data-saved-quiz-meta]"
                );


            const editButton =
                fragment.querySelector(
                    "[data-saved-quiz-edit]"
                );


            const duplicateButton =
                fragment.querySelector(
                    "[data-saved-quiz-duplicate]"
                );


            const liveButton =
                fragment.querySelector(
                    "[data-saved-quiz-live]"
                );


            const deleteButton =
                fragment.querySelector(
                    "[data-saved-quiz-delete]"
                );


            const questions =
                Array.isArray(
                    quiz.questions
                )
                    ? quiz.questions
                    : [];


            if (title) {

                title.textContent =
                    cleanText(
                        quiz.title
                    ) ||
                    "UNTITLED QUIZ";

            }


            if (meta) {

                meta.textContent =
                    `${questions.length} ${questions.length === 1 ? "QUESTION" : "QUESTIONS"} · ${QUIZ_READ_TIME_SECONDS} SEC READ · CUSTOM ANSWER TIME`;

            }


            if (editButton) {

                editButton.addEventListener(
                    "click",
                    () => {

                        loadQuizIntoBuilder(
                            quiz
                        );


                        clickQuizTab(
                            "builder"
                        );

                    }
                );

            }


            if (duplicateButton) {

                duplicateButton.addEventListener(
                    "click",
                    () => {

                        loadQuizIntoBuilder(
                            quiz
                        );


                        duplicateCurrentQuiz();


                        clickQuizTab(
                            "builder"
                        );

                    }
                );

            }


            if (liveButton) {

                liveButton.addEventListener(
                    "click",
                    () => {

                        selectQuizForLive(
                            quiz
                        );

                    }
                );

            }


            if (deleteButton) {

                deleteButton.addEventListener(
                    "click",
                    () => {

                        deleteSavedQuiz(
                            quiz
                        );

                    }
                );

            }


            savedQuizzesList.appendChild(
                fragment
            );

        }
    );

}


/* =====================================================
   SELECT LIVE QUIZ
===================================================== */

function selectQuizForLive(quiz) {

    selectedLiveQuiz =
        quiz ||
        null;


    if (liveQuizSelectedTitle) {

        liveQuizSelectedTitle.textContent =
            cleanText(
                quiz?.title
            ) ||
            "NO QUIZ SELECTED";

    }


    const questions =
        Array.isArray(
            quiz?.questions
        )
            ? quiz.questions
            : [];


    if (liveQuizTotalQuestions) {

        liveQuizTotalQuestions.textContent =
            String(
                liveQuizSession
                    ? liveQuizLastTotalQuestions
                    : questions.length
            );

    }


    setLiveQuizMessage(
        quiz
            ? `SELECTED: ${cleanText(quiz.title) || "QUIZ"}`
            : ""
    );


    updateLiveQuizStatusUI();


    clickQuizTab(
        "control"
    );

}


/* =====================================================
   LIVE QUIZ STATUS + BUTTONS
===================================================== */

function updateLiveQuizStatusUI() {

    const status =
        cleanText(
            liveQuizSession?.status
        ).toLowerCase() ||
        "inactive";


    const players =
        liveQuizPlayers.length;


    const totalQuestions =
        numberOrZero(
            liveQuizLastTotalQuestions
        );


    const currentQuestionNumber =
        numberOrZero(
            liveQuizSession?.current_question_number
        );


    const answersCloseAt =
        liveQuizSession?.answers_close_at
            ? new Date(
                liveQuizSession.answers_close_at
            ).getTime()
            : 0;


    const questionStillOpen =
        status === "live" &&
        answersCloseAt >
        Date.now();


    const isFinalQuestion =
        status === "live" &&
        totalQuestions > 0 &&
        currentQuestionNumber >=
        totalQuestions;


    if (liveQuizStatus) {

        liveQuizStatus.textContent =
            status.toUpperCase();

    }


    if (liveQuizPlayerCount) {

        liveQuizPlayerCount.textContent =
            String(
                players
            );

    }


    if (liveLobbyPlayerCountBadge) {

        liveLobbyPlayerCountBadge.textContent =
            `${players} ${players === 1 ? "PLAYER" : "PLAYERS"}`;

    }


    if (liveQuizTotalQuestions) {

        if (liveQuizSession) {

            liveQuizTotalQuestions.textContent =
                String(
                    totalQuestions
                );

        }
        else if (selectedLiveQuiz) {

            const selectedQuestions =
                Array.isArray(
                    selectedLiveQuiz.questions
                )
                    ? selectedLiveQuiz.questions
                    : [];


            liveQuizTotalQuestions.textContent =
                String(
                    selectedQuestions.length
                );

        }
        else {

            liveQuizTotalQuestions.textContent =
                "0";

        }

    }


    if (liveQuizStatusBadge) {

        liveQuizStatusBadge.className =
            "live-status-badge";


        if (
            status === "lobby" ||
            status === "live"
        ) {

            liveQuizStatusBadge.classList.add(
                status
            );

        }


        liveQuizStatusBadge.textContent =
            status === "inactive"
                ? "INACTIVE"
                : status.toUpperCase();

    }


    if (sidebarQuizLiveDot) {

        sidebarQuizLiveDot.hidden =
            !(
                status === "lobby" ||
                status === "live"
            );

    }


    /*
        BEFORE LOBBY
    */

    if (openQuizLobbyButton) {

        openQuizLobbyButton.disabled =
            status !== "inactive" ||
            !selectedLiveQuiz;

    }


    /*
        LOBBY
    */

    if (startQuizButton) {

        startQuizButton.disabled =
            status !== "lobby";

    }


    if (closeQuizLobbyButton) {

        closeQuizLobbyButton.disabled =
            status !== "lobby";

    }


    /*
        LIVE
    */

    if (nextQuizQuestionButton) {

        nextQuizQuestionButton.disabled =

            status !== "live" ||

            questionStillOpen ||

            isFinalQuestion;

    }


    if (finishQuizButton) {

        finishQuizButton.disabled =

            status !== "live" ||

            questionStillOpen ||

            !isFinalQuestion;

    }

}


/* =====================================================
   LIVE PLAYERS
===================================================== */

function renderLiveQuizPlayers() {

    if (!liveQuizPlayersList) {
        return;
    }


    Array.from(
        liveQuizPlayersList.children
    ).forEach(
        child => {

            if (
                child !==
                liveQuizPlayersEmpty
            ) {

                child.remove();

            }

        }
    );


    if (liveQuizPlayersEmpty) {

        liveQuizPlayersEmpty.hidden =
            liveQuizPlayers.length > 0;

    }


    if (!liveQuizPlayerTemplate) {

        updateLiveQuizStatusUI();

        return;

    }


    liveQuizPlayers.forEach(
        player => {

            const fragment =
                liveQuizPlayerTemplate.content.cloneNode(
                    true
                );


            const name =
                fragment.querySelector(
                    "[data-player-name]"
                );


            const username =
                fragment.querySelector(
                    "[data-player-username]"
                );


            if (name) {

                name.textContent =
                    cleanText(
                        player.telegram_name
                    ) ||
                    "Telegram Player";

            }


            if (username) {

                const raw =
                    cleanText(
                        player.telegram_username
                    );


                username.textContent =
                    raw
                        ? (
                            raw.startsWith("@")
                                ? raw
                                : `@${raw}`
                        )
                        : "NO USERNAME";

            }


            liveQuizPlayersList.appendChild(
                fragment
            );

        }
    );


    updateLiveQuizStatusUI();

}


/* =====================================================
   LIVE QUIZ REQUEST
===================================================== */

async function liveQuizRequest(
    action,
    body = {}
) {

    const token =
        getSessionToken();


    if (!token) {

        throw new Error(
            "LOGIN REQUIRED."
        );

    }


    if (
        sessionIsExpired()
    ) {

        clearLocalSession();


        throw new Error(
            "YOUR SESSION HAS EXPIRED. LOG IN AGAIN."
        );

    }


    const response =
        await fetch(
            ADMIN_QUIZ_LIVE_ENDPOINT,
            {
                method:
                    "POST",

                headers: {

                    "Authorization":
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        {
                            action,
                            ...body
                        }
                    ),

                cache:
                    "no-store"
            }
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
        response.status === 401
    ) {

        clearLocalSession();


        throw new Error(
            "YOUR SESSION HAS EXPIRED. LOG IN AGAIN."
        );

    }


    if (
        response.status === 403
    ) {

        throw new Error(
            "ADMIN ACCESS DENIED."
        );

    }


    if (
        !response.ok ||
        !result?.success
    ) {

        throw new Error(
            result?.error ||
            "LIVE QUIZ REQUEST FAILED."
        );

    }


    return result;

}


/* =====================================================
   APPLY LIVE STATE
===================================================== */

function applyLiveQuizState(
    result = {}
) {

    liveQuizSession =
        result.session ||
        null;


    liveQuizPlayers =
        Array.isArray(
            result.players
        )
            ? result.players
            : [];


    liveQuizLastTotalQuestions =
        numberOrZero(
            result.total_questions
        );


    liveQuizLastQuestion =
        result.question ||
        null;


    liveQuizLastStats =
        result.stats &&
        typeof result.stats === "object"
            ? result.stats
            : {};


    if (liveQuizSession) {

        const sessionQuizId =
            String(
                liveQuizSession.quiz_id ||
                ""
            );


        const matchingSavedQuiz =
            savedQuizzes.find(
                quiz =>
                    String(
                        quiz.id
                    ) ===
                    sessionQuizId
            );


        if (matchingSavedQuiz) {

            selectedLiveQuiz =
                matchingSavedQuiz;

        }
        else {

            selectedLiveQuiz = {

                id:
                    liveQuizSession.quiz_id,

                title:
                    liveQuizSession.quiz_title ||
                    "LIVE QUIZ",

                questions:
                    []

            };

        }


        if (liveQuizSelectedTitle) {

            liveQuizSelectedTitle.textContent =

                cleanText(
                    liveQuizSession.quiz_title
                ) ||

                cleanText(
                    selectedLiveQuiz?.title
                ) ||

                "LIVE QUIZ";

        }

    }


    renderLiveQuizPlayers();


    renderCurrentLiveQuestion(
        liveQuizLastQuestion,
        liveQuizLastStats
    );


    updateLiveQuizStatusUI();

}


/* =====================================================
   LOAD LIVE STATE
===================================================== */

async function loadLiveQuizState(
    silent = true
) {

    if (liveQuizStateLoading) {
        return;
    }


    const token =
        getSessionToken();


    if (
        !token ||
        sessionIsExpired()
    ) {

        return;

    }


    liveQuizStateLoading =
        true;


    try {

        const result =
            await liveQuizRequest(
                "get_state"
            );


        applyLiveQuizState(
            result
        );

    }
    catch (error) {

        if (!silent) {

            setLiveQuizMessage(
                error?.message ||
                "COULD NOT LOAD LIVE QUIZ STATE.",
                "error"
            );

        }

    }
    finally {

        liveQuizStateLoading =
            false;

    }

}


/* =====================================================
   LIVE POLLING
===================================================== */

function startLiveQuizStatePolling() {

    if (liveQuizStatePollTimer) {

        clearInterval(
            liveQuizStatePollTimer
        );

    }


    loadLiveQuizState(
        true
    );


    liveQuizStatePollTimer =
        setInterval(
            () => {

                loadLiveQuizState(
                    true
                );

            },
            LIVE_QUIZ_POLL_MS
        );

}


/* =====================================================
   OPEN LOBBY
===================================================== */

async function openQuizLobby() {

    if (!selectedLiveQuiz) {

        setLiveQuizMessage(
            "SELECT A SAVED QUIZ FIRST.",
            "error"
        );


        return;

    }


    try {

        const result =
            await liveQuizRequest(
                "open_lobby",
                {
                    quiz_id:
                        selectedLiveQuiz.id
                }
            );


        applyLiveQuizState(
            result
        );


        setLiveQuizMessage(
            "LOBBY OPEN. WAITING FOR PLAYERS.",
            "success"
        );

    }
    catch (error) {

        setLiveQuizMessage(
            error?.message ||
            "COULD NOT OPEN LOBBY.",
            "error"
        );

    }

}


/* =====================================================
   START QUIZ
===================================================== */

async function startLiveQuiz() {

    if (!liveQuizSession?.id) {

        setLiveQuizMessage(
            "OPEN THE LOBBY FIRST.",
            "error"
        );


        return;

    }


    try {

        const result =
            await liveQuizRequest(
                "start_quiz",
                {
                    session_id:
                        liveQuizSession.id
                }
            );


        applyLiveQuizState(
            result
        );


        setLiveQuizMessage(
            "QUIZ STARTED. QUESTION 1 IS LIVE.",
            "success"
        );

    }
    catch (error) {

        setLiveQuizMessage(
            error?.message ||
            "COULD NOT START QUIZ.",
            "error"
        );

    }

}


/* =====================================================
   NEXT QUESTION
===================================================== */

async function nextLiveQuizQuestion() {

    if (!liveQuizSession?.id) {

        setLiveQuizMessage(
            "NO ACTIVE QUIZ.",
            "error"
        );


        return;

    }


    try {

        const result =
            await liveQuizRequest(
                "next_question",
                {
                    session_id:
                        liveQuizSession.id
                }
            );


        applyLiveQuizState(
            result
        );


        setLiveQuizMessage(
            `QUESTION ${numberOrZero(result.session?.current_question_number)} IS LIVE.`,
            "success"
        );

    }
    catch (error) {

        setLiveQuizMessage(
            error?.message ||
            "COULD NOT OPEN NEXT QUESTION.",
            "error"
        );

    }

}


/* =====================================================
   FINISH QUIZ
===================================================== */

async function finishLiveQuiz() {

    if (!liveQuizSession?.id) {

        setLiveQuizMessage(
            "NO ACTIVE QUIZ.",
            "error"
        );


        return;

    }


    const confirmed =
        window.confirm(
            "Finish this live quiz and show final results?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const result =
            await liveQuizRequest(
                "finish_quiz",
                {
                    session_id:
                        liveQuizSession.id
                }
            );


        liveQuizSession =
            result.session ||
            null;


        liveQuizPlayers =
            [];


        liveQuizLastQuestion =
            null;


        liveQuizLastStats =
            {};


        renderLiveQuizPlayers();


        renderCurrentLiveQuestion(
            null
        );


        updateLiveQuizStatusUI();


        setLiveQuizMessage(
            "QUIZ FINISHED. FINAL RESULTS ARE AVAILABLE TO PLAYERS.",
            "success"
        );


        await loadPastQuizzes();

    }
    catch (error) {

        setLiveQuizMessage(
            error?.message ||
            "COULD NOT FINISH QUIZ.",
            "error"
        );

    }

}


/* =====================================================
   CLOSE LOBBY
===================================================== */

async function closeLiveQuizLobby() {

    if (!liveQuizSession?.id) {

        setLiveQuizMessage(
            "NO OPEN LOBBY.",
            "error"
        );


        return;

    }


    const confirmed =
        window.confirm(
            "Close this lobby?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await liveQuizRequest(
            "close_lobby",
            {
                session_id:
                    liveQuizSession.id
            }
        );


        liveQuizSession =
            null;


        liveQuizPlayers =
            [];


        liveQuizLastTotalQuestions =
            0;


        liveQuizLastQuestion =
            null;


        liveQuizLastStats =
            {};


        renderLiveQuizPlayers();


        renderCurrentLiveQuestion(
            null
        );


        updateLiveQuizStatusUI();


        setLiveQuizMessage(
            "LOBBY CLOSED.",
            "success"
        );

    }
    catch (error) {

        setLiveQuizMessage(
            error?.message ||
            "COULD NOT CLOSE LOBBY.",
            "error"
        );

    }

}


/* =====================================================
   CURRENT LIVE QUESTION
===================================================== */

function renderCurrentLiveQuestion(
    question = null,
    stats = {}
) {

    if (!question) {

        if (liveCurrentQuestionControl) {

            liveCurrentQuestionControl.hidden =
                true;

        }


        if (liveQuizCurrentQuestion) {

            liveQuizCurrentQuestion.textContent =
                "—";

        }


        return;

    }


    if (liveCurrentQuestionControl) {

        liveCurrentQuestionControl.hidden =
            false;

    }


    const currentNumber =
        numberOrZero(

            question.sort_order ??
            question.question_number

        );


    if (liveQuizCurrentQuestion) {

        liveQuizCurrentQuestion.textContent =
            String(
                currentNumber ||
                "—"
            );

    }


    if (currentQuizQuestionNumber) {

        currentQuizQuestionNumber.textContent =
            `QUESTION ${currentNumber || ""}`;

    }


    if (currentQuizQuestionText) {

        currentQuizQuestionText.textContent =
            cleanText(
                question.question
            ) ||
            "—";

    }


    if (liveQuizAnsweredCount) {

        liveQuizAnsweredCount.textContent =
            String(
                numberOrZero(
                    stats.answered
                )
            );

    }


    if (liveQuizCorrectCount) {

        liveQuizCorrectCount.textContent =
            String(
                numberOrZero(
                    stats.correct
                )
            );

    }


    if (liveQuizWrongCount) {

        liveQuizWrongCount.textContent =
            String(
                numberOrZero(
                    stats.wrong
                )
            );

    }


    if (liveQuizNoAnswerCount) {

        liveQuizNoAnswerCount.textContent =
            String(
                numberOrZero(
                    stats.no_answer
                )
            );

    }

}


/* =====================================================
   PAST QUIZZES
===================================================== */

async function loadPastQuizzes() {

    /*
        This section is already prepared in the UI.

        If admin-quiz does not yet return historical
        sessions, this simply stays empty.
    */

    try {

        const token =
            getSessionToken();


        if (!token) {
            return;
        }


        const response =
            await fetch(
                `${ADMIN_QUIZ_ENDPOINT}?history=1`,
                {
                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    },

                    cache:
                        "no-store"
                }
            );


        const result =
            await response.json();


        if (
            response.ok &&
            result?.success
        ) {

            pastQuizSessions =
                Array.isArray(
                    result.sessions
                )
                    ? result.sessions
                    : [];


            renderPastQuizzes();

        }

    }
    catch (error) {

        console.error(
            "Past quiz load error:",
            error
        );

    }

}


function renderPastQuizzes() {

    if (!pastQuizzesList) {
        return;
    }


    Array.from(
        pastQuizzesList.children
    ).forEach(
        child => {

            if (
                child !==
                pastQuizzesEmpty
            ) {

                child.remove();

            }

        }
    );


    if (pastQuizzesEmpty) {

        pastQuizzesEmpty.hidden =
            pastQuizSessions.length > 0;

    }


    if (!pastQuizCardTemplate) {
        return;
    }


    pastQuizSessions.forEach(
        session => {

            const fragment =
                pastQuizCardTemplate.content.cloneNode(
                    true
                );


            const title =
                fragment.querySelector(
                    "[data-past-quiz-title]"
                );


            const meta =
                fragment.querySelector(
                    "[data-past-quiz-meta]"
                );


            const winner =
                fragment.querySelector(
                    "[data-past-quiz-winner]"
                );


            if (title) {

                title.textContent =
                    cleanText(
                        session.quiz_title
                    ) ||
                    "QUIZ";

            }


            if (meta) {

                meta.textContent =
                    `${formatDate(session.finished_at)} · ${numberOrZero(session.player_count)} PLAYERS`;

            }


            if (winner) {

                const winnerUsername =
                    cleanText(
                        session.winner_username
                    );


                const winnerName =
                    cleanText(
                        session.winner_name
                    );


                winner.textContent =
                    winnerUsername
                        ? (
                            winnerUsername.startsWith("@")
                                ? winnerUsername
                                : `@${winnerUsername}`
                        )
                        : (
                            winnerName ||
                            "—"
                        );

            }


            pastQuizzesList.appendChild(
                fragment
            );

        }
    );

}


/* =====================================================
   EVENTS - MEMBERS
===================================================== */

if (memberSearch) {

    memberSearch.addEventListener(
        "input",
        filterMembers
    );

}


if (membersPrevPage) {

    membersPrevPage.addEventListener(
        "click",
        goToPreviousMembersPage
    );

}


if (membersNextPage) {

    membersNextPage.addEventListener(
        "click",
        goToNextMembersPage
    );

}


if (refreshMembers) {

    refreshMembers.addEventListener(
        "click",
        async () => {

            if (memberSearch) {

                memberSearch.value =
                    "";

            }


            membersCurrentPage =
                1;


            await loadAdminData();

        }
    );

}


/* =====================================================
   EVENTS - CONTEST
===================================================== */

if (openContestPanel) {

    openContestPanel.disabled =
        true;


    openContestPanel.addEventListener(
        "click",
        openContest
    );

}


if (closeContestPanel) {

    closeContestPanel.addEventListener(
        "click",
        closeContest
    );

}


if (contestSearch) {

    contestSearch.addEventListener(
        "input",
        filterContestEntries
    );

}


if (contestSort) {

    contestSort.addEventListener(
        "change",
        changeContestSort
    );

}


if (contestPrevPage) {

    contestPrevPage.addEventListener(
        "click",
        goToPreviousContestPage
    );

}


if (contestNextPage) {

    contestNextPage.addEventListener(
        "click",
        goToNextContestPage
    );

}


if (contestRequirementsYes) {

    contestRequirementsYes.addEventListener(
        "click",
        () => {

            setContestRequirements(
                true
            );

        }
    );

}


if (contestRequirementsNo) {

    contestRequirementsNo.addEventListener(
        "click",
        () => {

            setContestRequirements(
                false
            );

        }
    );

}


if (contestEntryForm) {

    contestEntryForm.addEventListener(
        "submit",
        saveContestEntry
    );

}


if (contestCancelEdit) {

    contestCancelEdit.addEventListener(
        "click",
        resetContestForm
    );

}


/* =====================================================
   EVENTS - QUIZ BUILDER
===================================================== */

if (addQuizQuestionButton) {

    addQuizQuestionButton.addEventListener(
        "click",
        () => {

            openQuizQuestionEditor();

        }
    );

}


quizCorrectButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                selectQuizCorrectAnswer(
                    button.dataset.correctAnswer
                );

            }
        );

    }
);


if (quizSaveQuestionButton) {

    quizSaveQuestionButton.addEventListener(
        "click",
        saveQuizQuestion
    );

}


if (quizCancelQuestionButton) {

    quizCancelQuestionButton.addEventListener(
        "click",
        closeQuizQuestionEditor
    );

}


if (quizDeleteQuestionButton) {

    quizDeleteQuestionButton.addEventListener(
        "click",
        deleteCurrentQuizQuestion
    );

}


if (quizResetBuilderButton) {

    quizResetBuilderButton.addEventListener(
        "click",
        resetQuizBuilder
    );

}


if (quizBuilderForm) {

    quizBuilderForm.addEventListener(
        "submit",
        saveQuiz
    );

}


if (quizDuplicateCurrentButton) {

    quizDuplicateCurrentButton.addEventListener(
        "click",
        duplicateCurrentQuiz
    );

}


if (createQuizFromSavedButton) {

    createQuizFromSavedButton.addEventListener(
        "click",
        () => {

            const hasDraft =

                quizDraftQuestions.length > 0 ||

                !!cleanText(
                    quizTitle?.value
                );


            if (hasDraft) {

                const confirmed =
                    window.confirm(
                        "Create a new quiz? Unsaved changes will be cleared."
                    );


                if (!confirmed) {
                    return;
                }

            }


            clearQuizBuilder();


            clickQuizTab(
                "builder"
            );

        }
    );

}


/* =====================================================
   EVENTS - LIVE QUIZ
===================================================== */

if (openQuizLobbyButton) {

    openQuizLobbyButton.addEventListener(
        "click",
        openQuizLobby
    );

}


if (startQuizButton) {

    startQuizButton.addEventListener(
        "click",
        startLiveQuiz
    );

}


if (nextQuizQuestionButton) {

    nextQuizQuestionButton.addEventListener(
        "click",
        nextLiveQuizQuestion
    );

}


if (finishQuizButton) {

    finishQuizButton.addEventListener(
        "click",
        finishLiveQuiz
    );

}


if (closeQuizLobbyButton) {

    closeQuizLobbyButton.addEventListener(
        "click",
        closeLiveQuizLobby
    );

}


/* =====================================================
   RETURN TO TAB
===================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadLiveQuizState(
                true
            );

        }

    }
);


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {


        /* CONTEST */

        resetContestForm();


        if (contestSort) {

            contestSort.value =
                "newest";

        }


        membersCurrentPage =
            1;


        /* QUIZ */

        quizDraftQuestions =
            [];


        quizQuestionCounter =
            0;


        savedQuizzes =
            [];


        pastQuizSessions =
            [];


        liveQuizPlayers =
            [];


        liveQuizSession =
            null;


        selectedLiveQuiz =
            null;


        liveQuizLastTotalQuestions =
            0;


        liveQuizLastQuestion =
            null;


        liveQuizLastStats =
            {};


        if (quizQuestionAnswerTime) {

            quizQuestionAnswerTime.value =
                String(
                    QUIZ_DEFAULT_ANSWER_TIME
                );

        }


        closeQuizQuestionEditor();


        renderQuizQuestions();


        renderSavedQuizzes();


        renderLiveQuizPlayers();


        renderPastQuizzes();


        renderCurrentLiveQuestion(
            null
        );


        updateLiveQuizStatusUI();


        /* DEFAULT BUTTONS */

        if (openQuizLobbyButton) {

            openQuizLobbyButton.disabled =
                true;

        }


        if (startQuizButton) {

            startQuizButton.disabled =
                true;

        }


        if (nextQuizQuestionButton) {

            nextQuizQuestionButton.disabled =
                true;

        }


        if (finishQuizButton) {

            finishQuizButton.disabled =
                true;

        }


        if (closeQuizLobbyButton) {

            closeQuizLobbyButton.disabled =
                true;

        }


        /*
            LOAD ADMIN
        */

        await loadAdminData();


        /*
            LOAD QUIZZES
        */

        await loadSavedQuizzes();


        /*
            RESTORE EXISTING LOBBY / LIVE SESSION

            This is the important fix.

            If you refresh admin.html while a lobby
            already exists in Supabase, the admin panel
            will restore it instead of showing INACTIVE.
        */

        await loadLiveQuizState(
            false
        );


        /*
            PAST QUIZZES
        */

        await loadPastQuizzes();


        /*
            LIVE REFRESH

            Players, answers and question status
            refresh every second.
        */

        startLiveQuizStatePolling();

    }
);