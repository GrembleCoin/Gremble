/* =====================================================
   GREMBLE ADMIN PANEL
   File: admin.js
===================================================== */

const ADMIN_MEMBERS_ENDPOINT = "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-members";
const ADMIN_ALL_HOLDERS_ENDPOINT = "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-all-holders";
const ADMIN_CONTEST_ENDPOINT = "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-contest";
const ADMIN_QUIZ_ENDPOINT = "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-quiz";
const ADMIN_QUIZ_LIVE_ENDPOINT = "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-quiz-live";

const GREMBLE_SESSION_KEY = "gremble_session_token";
const GREMBLE_SESSION_EXPIRY_KEY = "gremble_session_expires_at";

const MEMBERS_ITEMS_PER_PAGE = 10;
const ALL_HOLDERS_ITEMS_PER_PAGE = 10;
const CONTEST_ITEMS_PER_PAGE = 5;
const PAST_QUIZZES_ITEMS_PER_PAGE = 5;

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


const $ = id =>
    document.getElementById(id);

const $$ = selector =>
    Array.from(
        document.querySelectorAll(selector)
    );


/* =====================================================
   ADMIN
===================================================== */

const adminMessage =
    $("adminMessage");

const adminDashboard =
    $("adminDashboard");

const adminSidebar =
    $("adminSidebar");

const adminTopbar =
    document.querySelector(
        ".admin-topbar"
    );

const adminIdentity =
    $("adminIdentity");

const sidebarAdminIdentity =
    $("sidebarAdminIdentity");


/* =====================================================
   STATS
===================================================== */

const statTotalMembers =
    $("statTotalMembers");

const statCompletedProfiles =
    $("statCompletedProfiles");

const statTelegramChatMembers =
    $("statTelegramChatMembers");

const statTelegramAnnouncementsMembers =
    $("statTelegramAnnouncementsMembers");

const statMembersWithWallet =
    $("statMembersWithWallet");


/* =====================================================
   MEMBERS
===================================================== */

const memberSearch =
    $("memberSearch");

const refreshMembers =
    $("refreshMembers");

const membersTableBody =
    $("membersTableBody");

const membersEmpty =
    $("membersEmpty");

const membersPagination =
    $("membersPagination");

const membersPrevPage =
    $("membersPrevPage");

const membersNextPage =
    $("membersNextPage");

const membersPageInfo =
    $("membersPageInfo");


/* =====================================================
   CONTEST
===================================================== */

const openContestPanel =
    $("openContestPanel");

const contestTotalEntries =
    $("contestTotalEntries");

const contestVerifiedEntries =
    $("contestVerifiedEntries");

const contestEntriesLabel =
    $("contestEntriesLabel");

const contestEntryForm =
    $("contestEntryForm");

const contestEntryId =
    $("contestEntryId");

const contestParticipant =
    $("contestParticipant");

const contestMemeUrl =
    $("contestMemeUrl");

const contestPoints =
    $("contestPoints");

const contestAdminNote =
    $("contestAdminNote");

const contestCurrentTab =
    $("contestCurrentTab");

const contestPastTab =
    $("contestPastTab");

const endContestButton =
    $("endContestButton");

const pastContestsPanel =
    $("pastContestsPanel");

const pastContestsList =
    $("pastContestsList");

const pastContestsEmpty =
    $("pastContestsEmpty");

const pastContestsCount =
    $("pastContestsCount");

const contestRequirementsYes =
    $("contestRequirementsYes");

const contestRequirementsNo =
    $("contestRequirementsNo");

const contestRequirementsValue =
    $("contestRequirementsValue");

const contestSubmitButton =
    $("contestSubmitButton");

const contestCancelEdit =
    $("contestCancelEdit");

const contestFormMessage =
    $("contestFormMessage");

const contestTableBody =
    $("contestTableBody");

const contestEmpty =
    $("contestEmpty");

const contestSearch =
    $("contestSearch");

const contestSort =
    $("contestSort");

const contestPagination =
    $("contestPagination");

const contestPrevPage =
    $("contestPrevPage");

const contestNextPage =
    $("contestNextPage");

const contestPageInfo =
    $("contestPageInfo");


/* =====================================================
   QUIZ BUILDER
===================================================== */

const quizBuilderForm =
    $("quizBuilderForm");

const quizEditingId =
    $("quizEditingId");

const quizTitle =
    $("quizTitle");

const quizDescription =
    $("quizDescription");

const quizBuilderTitle =
    $("quizBuilderTitle");

const quizBuilderMessage =
    $("quizBuilderMessage");

const quizQuestionCount =
    $("quizQuestionCount");

const quizQuestionList =
    $("quizQuestionList");

const quizQuestionsEmpty =
    $("quizQuestionsEmpty");

const addQuizQuestionButton =
    $("addQuizQuestionButton");

const quizQuestionEditor =
    $("quizQuestionEditor");

const quizQuestionEditingId =
    $("quizQuestionEditingId");

const quizQuestionEditorTitle =
    $("quizQuestionEditorTitle");

const quizQuestionText =
    $("quizQuestionText");

const quizAnswerA =
    $("quizAnswerA");

const quizAnswerB =
    $("quizAnswerB");

const quizAnswerC =
    $("quizAnswerC");

const quizAnswerD =
    $("quizAnswerD");

const quizCorrectAnswer =
    $("quizCorrectAnswer");

const quizCorrectButtons =
    $$("[data-correct-answer]");

const quizQuestionAnswerTime =
    $("quizQuestionAnswerTime");

const quizSaveQuestionButton =
    $("quizSaveQuestionButton");

const quizCancelQuestionButton =
    $("quizCancelQuestionButton");

const quizDeleteQuestionButton =
    $("quizDeleteQuestionButton");

const quizResetBuilderButton =
    $("quizResetBuilderButton");

const saveQuizButton =
    $("saveQuizButton");

const quizDuplicateCurrentButton =
    $("quizDuplicateCurrentButton");

const quizQuestionListItemTemplate =
    $("quizQuestionListItemTemplate");


/* =====================================================
   SAVED QUIZZES
===================================================== */

const savedQuizCardTemplate =
    $("savedQuizCardTemplate");

const savedQuizzesList =
    $("savedQuizzesList");

const savedQuizzesEmpty =
    $("savedQuizzesEmpty");

const createQuizFromSavedButton =
    $("createQuizFromSavedButton");


/* =====================================================
   LIVE QUIZ
===================================================== */

const liveQuizStatusBadge =
    $("liveQuizStatusBadge");

const liveQuizSelectedTitle =
    $("liveQuizSelectedTitle");

const liveQuizStatus =
    $("liveQuizStatus");

const liveQuizPlayerCount =
    $("liveQuizPlayerCount");

const liveQuizCurrentQuestion =
    $("liveQuizCurrentQuestion");

const liveQuizTotalQuestions =
    $("liveQuizTotalQuestions");

const openQuizLobbyButton =
    $("openQuizLobbyButton");

const startQuizButton =
    $("startQuizButton");

const nextQuizQuestionButton =
    $("nextQuizQuestionButton");

const finishQuizButton =
    $("finishQuizButton");

const closeQuizLobbyButton =
    $("closeQuizLobbyButton");

const liveCurrentQuestionControl =
    $("liveCurrentQuestionControl");

const currentQuizQuestionNumber =
    $("currentQuizQuestionNumber");

const currentQuizQuestionText =
    $("currentQuizQuestionText");

const liveQuizAnsweredCount =
    $("liveQuizAnsweredCount");

const liveQuizCorrectCount =
    $("liveQuizCorrectCount");

const liveQuizWrongCount =
    $("liveQuizWrongCount");

const liveQuizNoAnswerCount =
    $("liveQuizNoAnswerCount");

const liveQuizMessage =
    $("liveQuizMessage");

const liveLobbyPlayerCountBadge =
    $("liveLobbyPlayerCountBadge");

const liveQuizPlayersList =
    $("liveQuizPlayersList");

const liveQuizPlayersEmpty =
    $("liveQuizPlayersEmpty");

const liveQuizPlayerTemplate =
    $("liveQuizPlayerTemplate");

const sidebarQuizLiveDot =
    $("sidebarQuizLiveDot");


/* =====================================================
   PAST QUIZZES
===================================================== */

const pastQuizzesList =
    $("pastQuizzesList");

const pastQuizzesEmpty =
    $("pastQuizzesEmpty");

const pastQuizCardTemplate =
    $("pastQuizCardTemplate");

const pastQuizPagination =
    $("pastQuizPagination");

const pastQuizPrevPage =
    $("pastQuizPrevPage");

const pastQuizNextPage =
    $("pastQuizNextPage");

const pastQuizPageInfo =
    $("pastQuizPageInfo");


/* =====================================================
   WALLET VISIBILITY
===================================================== */

const walletVisibilityStatus =
    $("walletVisibilityStatus");

const walletVisibilitySwitch =
    $("walletVisibilitySwitch");


/* =====================================================
   HOLDERS
===================================================== */

const holdersTotalCount =
    $("holdersTotalCount");

const holdersTotalTokens =
    $("holdersTotalTokens");

const holdersTotalValue =
    $("holdersTotalValue");

const refreshHolders =
    $("refreshHolders");

const holdersTableSection =
    $("holdersTableSection");

const holdersTableBody =
    $("holdersTableBody");

const holdersEmpty =
    $("holdersEmpty");


    /* =====================================================
   ALL HOLDERS
===================================================== */

const allHoldersTotalCount =
    $("allHoldersTotalCount");

const allHoldersTotalTokens =
    $("allHoldersTotalTokens");

const allHoldersTopTenPercent =
    $("allHoldersTopTenPercent");

const allHoldersTotalValue =
    $("allHoldersTotalValue");

const allHoldersSearch =
    $("allHoldersSearch");

const refreshAllHolders =
    $("refreshAllHolders");

const allHoldersLaunchMessage =
    $("allHoldersLaunchMessage");

const allHoldersWaiting =
    $("allHoldersWaiting");

const allHoldersTableSection =
    $("allHoldersTableSection");

const allHoldersTableBody =
    $("allHoldersTableBody");

const allHoldersEmpty =
    $("allHoldersEmpty");

const allHoldersPagination =
    $("allHoldersPagination");

const allHoldersPrevPage =
    $("allHoldersPrevPage");

const allHoldersNextPage =
    $("allHoldersNextPage");

const allHoldersPageInfo =
    $("allHoldersPageInfo");


/* =====================================================
   STATE
===================================================== */

let allMembers =
    [];

let membersCurrentPage =
    1;

let allHolders =
    [];

let allHoldersCurrentPage =
    1;

let allHoldersLoaded =
    false;

let allHoldersLoading =
    false;

const ALL_HOLDERS_AUTO_REFRESH_MS =
    60000;

let allHoldersAutoRefreshTimer =
    null;
let allContestEntries =
    [];

let contestCurrentPage =
    1;

let contestLoaded =
    false;

let contestLoading =
    false;

let contestSaving =
    false;

let contestViewMode =
    "current";

let pastContestSessions =
    [];

let pastContestSessionsLoaded =
    false;

let pastContestLoading =
    false;

let selectedPastContestId =
    null;

let quizDraftQuestions =
    [];

let quizQuestionCounter =
    0;

let savedQuizzes =
    [];

let selectedLiveQuiz =
    null;

let liveQuizSession =
    null;

let liveQuizPlayers =
    [];

let liveQuizLastQuestion =
    null;

let liveQuizLastStats =
    {};

let liveQuizLastTotalQuestions =
    0;

let liveQuizStateLoading =
    false;

let liveQuizStatePollTimer =
    null;

let pastQuizSessions =
    [];

let pastQuizCurrentPage =
    1;

let walletVisibilityEnabled =
    null;

let walletVisibilitySaving =
    false;

const pastQuizResultsCache =
    new Map();


/* =====================================================
   HELPERS
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

    const number =
        Number(raw);

    return (
        raw &&
        Number.isFinite(number)
    )
        ? number
        : null;

}


function sessionIsExpired() {

    const expiry =
        getSessionExpiry();

    return (
        !!expiry &&
        expiry <=
        Math.floor(
            Date.now() / 1000
        )
    );

}


function clearLocalSession() {

    localStorage.removeItem(
        GREMBLE_SESSION_KEY
    );

    localStorage.removeItem(
        GREMBLE_SESSION_EXPIRY_KEY
    );

}


/* =====================================================
   FORMAT
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
   MESSAGES
===================================================== */

function setMessage(
    element,
    message,
    type = ""
) {

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.classList.remove(
        "success",
        "error"
    );


    if (type) {

        element.classList.add(
            type
        );

    }

}


function setAdminMessage(
    message,
    type = ""
) {

    setMessage(
        adminMessage,
        message,
        type
    );

}


function setContestMessage(
    message,
    type = ""
) {

    setMessage(
        contestFormMessage,
        message,
        type
    );

}


function setQuizBuilderMessage(
    message,
    type = ""
) {

    setMessage(
        quizBuilderMessage,
        message,
        type
    );

}


function setLiveQuizMessage(
    message,
    type = ""
) {

    setMessage(
        liveQuizMessage,
        message,
        type
    );

}


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
        [
            "member",
            "administrator",
            "creator",
            "in_group",
            "in_chat",
            "yes"
        ].includes(status)
    ) {

        return "member";

    }


    if (
        [
            "not_member",
            "left",
            "kicked",
            "no",
            "not_in_group",
            "not_in_chat"
        ].includes(status)
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
        `telegram-group-badge ${
            normalized === "member"
                ? "member"
                : normalized === "not_member"
                    ? "not-member"
                    : "unknown"
        }`;


    badge.textContent =
        normalized === "member"
            ? (
                type === "announcements"
                    ? "✓ IN ANNOUNCEMENTS"
                    : "✓ IN CHAT"
            )
            : normalized === "not_member"
                ? (
                    type === "announcements"
                        ? "× NOT IN ANNOUNCEMENTS"
                        : "× NOT IN CHAT"
                )
                : "UNKNOWN";


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

        cell.innerHTML =
            '<span class="empty-value">—</span>';

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


    const label =
        document.createElement(
            "span"
        );


    label.className =
        "country-name";


    label.textContent =
        countryCode ||
        countryName;


    label.title =
        countryName
            ? `${countryCode} — ${countryName}`
            : countryCode;


    wrapper.appendChild(
        label
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


    const wallet =
        cleanText(
            member.wallet_address
        );


    const badge =
        document.createElement(
            "span"
        );


    badge.className =
        `wallet-status-badge ${
            wallet
                ? "yes"
                : "no"
        }`;


    if (wallet) {

        badge.title =
            wallet;

    }


    const dot =
        document.createElement(
            "span"
        );


    dot.className =
        "wallet-status-dot";


    badge.appendChild(
        dot
    );


    badge.appendChild(

        document.createTextNode(
            wallet
                ? "YES"
                : "NO"
        )

    );


    cell.appendChild(
        badge
    );


    return cell;

}


/* =====================================================
   HOLDERS
===================================================== */

function renderHolders() {

    if (
        holdersTotalCount
    ) {

        holdersTotalCount.textContent =
            "0";
    }


    if (
        holdersTotalTokens
    ) {

        holdersTotalTokens.textContent =
            "0";
    }


    if (
        holdersTotalValue
    ) {

        holdersTotalValue.textContent =
            "$0.00";
    }


    if (
        holdersTableBody
    ) {

        holdersTableBody.innerHTML =
            "";
    }


    if (
        holdersTableSection
    ) {

        holdersTableSection.hidden =
            true;
    }


    if (
        holdersEmpty
    ) {

        holdersEmpty.hidden =
            true;
    }


    if (
        refreshHolders
    ) {

        refreshHolders.disabled =
            true;

        refreshHolders.textContent =
            "REFRESH HOLDERS";
    }

}


/* =====================================================
   ALL HOLDERS
===================================================== */

function getFilteredAllHolders() {

    const search =
        cleanText(
            allHoldersSearch?.value
        ).toLowerCase();


    if (
        !search
    ) {

        return [
            ...allHolders
        ];
    }


    return allHolders.filter(
        holder =>
            cleanText(
                holder.wallet_address ??
                holder.wallet ??
                holder.owner
            )
                .toLowerCase()
                .includes(
                    search
                )
    );
}


function createAllHolderRow(
    holder,
    rank
) {

    const row =
        document.createElement(
            "tr"
        );


    const walletAddress =
        cleanText(
            holder.wallet_address ??
            holder.wallet ??
            holder.owner
        );


    const balance =
        numberOrZero(
            holder.gremble_balance ??
            holder.balance ??
            holder.amount
        );


    const supplyPercent =
        numberOrZero(
            holder.supply_percent ??
            holder.percent_of_supply ??
            holder.percentage
        );


    const usdValue =
        numberOrZero(
            holder.value_usd ??
            holder.usd_value
        );


    /* RANK */

    const rankCell =
        document.createElement(
            "td"
        );


    rankCell.textContent =
        `#${rank}`;


    /* WALLET */

    const walletCell =
        document.createElement(
            "td"
        );


    const walletWrapper =
        document.createElement(
            "div"
        );


    walletWrapper.className =
        "wallet-cell";


    const walletText =
        document.createElement(
            "span"
        );


    walletText.className =
        "wallet-address";


    walletText.textContent =
        walletAddress
            ? shortWallet(
                walletAddress
            )
            : "—";


    walletText.title =
        walletAddress;


    if (
        walletAddress
    ) {

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
            () =>
                copyText(
                    walletAddress,
                    copyButton
                )
        );


        walletWrapper.append(
            walletText,
            copyButton
        );

    }
    else {

        walletWrapper.appendChild(
            walletText
        );
    }


    walletCell.appendChild(
        walletWrapper
    );


    /* GREMBLE */

    const balanceCell =
        document.createElement(
            "td"
        );


    balanceCell.textContent =
        balance.toLocaleString(
            "en-US",
            {
                maximumFractionDigits:
                    6
            }
        );


    /* SUPPLY */

    const supplyCell =
        document.createElement(
            "td"
        );


    supplyCell.textContent =
        `${supplyPercent.toFixed(4)}%`;


    /* USD */

    const valueCell =
        document.createElement(
            "td"
        );


    valueCell.textContent =
        `$${usdValue.toLocaleString(
            "en-US",
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2
            }
        )}`;


    row.append(
        rankCell,
        walletCell,
        balanceCell,
        supplyCell,
        valueCell
    );


    return row;
}


function renderAllHolders() {

    const filtered =
        getFilteredAllHolders();


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filtered.length /
                ALL_HOLDERS_ITEMS_PER_PAGE
            )
        );


    allHoldersCurrentPage =
        Math.min(
            Math.max(
                1,
                allHoldersCurrentPage
            ),
            totalPages
        );


    const start =
        (
            allHoldersCurrentPage -
            1
        ) *
        ALL_HOLDERS_ITEMS_PER_PAGE;


    const visibleHolders =
        filtered.slice(
            start,
            start +
            ALL_HOLDERS_ITEMS_PER_PAGE
        );


    if (
        allHoldersTableBody
    ) {

        allHoldersTableBody.innerHTML =
            "";


        visibleHolders.forEach(
            (
                holder,
                index
            ) => {

                const rank =
                    start +
                    index +
                    1;


                allHoldersTableBody.appendChild(

                    createAllHolderRow(
                        holder,
                        rank
                    )
                );
            }
        );
    }


    if (
        allHoldersTotalCount
    ) {

        allHoldersTotalCount.textContent =
            String(
                allHolders.length
            );
    }


    const totalTokens =
        allHolders.reduce(
            (
                total,
                holder
            ) =>
                total +
                numberOrZero(
                    holder.gremble_balance ??
                    holder.balance ??
                    holder.amount
                ),
            0
        );


    if (
        allHoldersTotalTokens
    ) {

        allHoldersTotalTokens.textContent =
            totalTokens.toLocaleString(
                "en-US",
                {
                    maximumFractionDigits:
                        2
                }
            );
    }


    const topTenPercent =
        allHolders
            .slice(
                0,
                10
            )
            .reduce(
                (
                    total,
                    holder
                ) =>
                    total +
                    numberOrZero(
                        holder.supply_percent ??
                        holder.percent_of_supply ??
                        holder.percentage
                    ),
                0
            );


    if (
        allHoldersTopTenPercent
    ) {

        allHoldersTopTenPercent.textContent =
            `${topTenPercent.toFixed(2)}%`;
    }


    const totalValue =
        allHolders.reduce(
            (
                total,
                holder
            ) =>
                total +
                numberOrZero(
                    holder.value_usd ??
                    holder.usd_value
                ),
            0
        );


    if (
        allHoldersTotalValue
    ) {

        allHoldersTotalValue.textContent =
            `$${totalValue.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits:
                        2,

                    maximumFractionDigits:
                        2
                }
            )}`;
    }


    const hasData =
        allHolders.length >
        0;


    if (
        allHoldersWaiting
    ) {

        allHoldersWaiting.hidden =
            hasData;
    }


    if (
        allHoldersTableSection
    ) {

        allHoldersTableSection.hidden =
            !hasData;
    }


    if (
        allHoldersEmpty
    ) {

        allHoldersEmpty.hidden =
            filtered.length >
            0;
    }


    if (
        allHoldersPagination
    ) {

        allHoldersPagination.hidden =
            filtered.length <=
            ALL_HOLDERS_ITEMS_PER_PAGE;
    }


    if (
        allHoldersPageInfo
    ) {

        allHoldersPageInfo.textContent =
            `${allHoldersCurrentPage} OF ${totalPages}`;
    }


    if (
        allHoldersPrevPage
    ) {

        allHoldersPrevPage.disabled =
            allHoldersCurrentPage <=
            1;
    }


    if (
        allHoldersNextPage
    ) {

        allHoldersNextPage.disabled =
            allHoldersCurrentPage >=
            totalPages;
    }


    if (
        allHoldersSearch
    ) {

        allHoldersSearch.disabled =
            !allHoldersLoaded;
    }


    if (
        refreshAllHolders
    ) {

        refreshAllHolders.disabled =
            !allHoldersLoaded ||
            allHoldersLoading;


        refreshAllHolders.textContent =
            allHoldersLoading
                ? "LOADING..."
                : "REFRESH DATA";
    }

}


/* =====================================================
   LOAD ALL HOLDERS
===================================================== */

async function loadAllHolders(
    force = false
) {

    if (
        allHoldersLoading
    ) {

        return;
    }


    if (
        allHoldersLoaded &&
        !force
    ) {

        renderAllHolders();

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


    allHoldersLoading =
        true;


    if (
        refreshAllHolders
    ) {

        refreshAllHolders.disabled =
            true;

        refreshAllHolders.textContent =
            "LOADING...";
    }


    try {

        const response =
            await fetch(
                ADMIN_ALL_HOLDERS_ENDPOINT,
                {

                    method:
                        "GET",

                    headers: {

                        Authorization:
                            `Bearer ${token}`
                    },

                    cache:
                        "no-store"
                }
            );


        let result =
            null;


        try {

            result =
                await response.json();

        }
        catch {

            result =
                null;
        }


        if (
            response.status ===
            401
        ) {

            clearLocalSession();

            showAccessError(
                401
            );

            return;
        }


        if (
            response.status ===
            403
        ) {

            showAccessError(
                403
            );

            return;
        }


        if (
            !response.ok ||
            result?.success !== true
        ) {

            throw new Error(
                result?.error ||
                "COULD NOT LOAD GREMBLE HOLDERS."
            );
        }


        allHolders =
            Array.isArray(
                result.holders
            )
                ? result.holders
                : [];


        allHoldersLoaded =
            result.launch_ready ===
            true;


        allHoldersCurrentPage =
            1;


        if (
            allHoldersSearch
        ) {

            allHoldersSearch.value =
                "";
        }


        if (
            allHoldersLaunchMessage
        ) {

            if (
                result.launch_ready ===
                true
            ) {

                allHoldersLaunchMessage.textContent =
                    "ON-CHAIN GREMBLE HOLDER DATA LOADED.";

            }
            else {

                allHoldersLaunchMessage.textContent =
                    "WAITING FOR TOKEN LAUNCH — ON-CHAIN HOLDER TRACKING WILL ACTIVATE AFTER THE GREMBLE MINT ADDRESS IS ADDED.";
            }
        }


        renderAllHolders();

    }
    catch (error) {

        console.error(
            "All holders error:",
            error
        );


        setAdminMessage(
            error?.message ||
            "COULD NOT LOAD GREMBLE HOLDERS.",
            "error"
        );

    }
    finally {

        allHoldersLoading =
            false;


        renderAllHolders();
    }
}


window.loadAllHolders =
    loadAllHolders;


function stopAllHoldersAutoRefresh() {

    if (
        allHoldersAutoRefreshTimer
    ) {

        clearInterval(
            allHoldersAutoRefreshTimer
        );

        allHoldersAutoRefreshTimer =
            null;
    }
}


function startAllHoldersAutoRefresh() {

    stopAllHoldersAutoRefresh();


    allHoldersAutoRefreshTimer =
        setInterval(
            () => {

                loadAllHolders(
                    true
                );

            },
            ALL_HOLDERS_AUTO_REFRESH_MS
        );
}


window.startAllHoldersAutoRefresh =
    startAllHoldersAutoRefresh;

window.stopAllHoldersAutoRefresh =
    stopAllHoldersAutoRefresh;


/* =====================================================
   MEMBER STATS
===================================================== */

function updateStats(
    stats = {}
) {

    const total =
        numberOrZero(

            stats.total_members ??
            allMembers.length

        );


    const completed =
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


    const wallets =
        numberOrZero(

            stats.members_with_wallet ??
            stats.wallet_connected ??

            allMembers.filter(
                member =>
                    cleanText(
                        member.wallet_address
                    )
            ).length

        );


    if (statTotalMembers) {

        statTotalMembers.textContent =
            String(total);

    }


    if (statCompletedProfiles) {

        statCompletedProfiles.textContent =
            String(completed);

    }


    if (statTelegramChatMembers) {

        statTelegramChatMembers.textContent =
            String(chatMembers);

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
            String(wallets);

    }

}
/* =====================================================
   MEMBER ROW
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


    /* NAME */

    const nameCell =
        document.createElement(
            "td"
        );


    if (telegramName) {

        const span =
            document.createElement(
                "span"
            );


        span.className =
            "telegram-name";


        span.textContent =
            telegramName;


        nameCell.appendChild(
            span
        );

    }
    else {

        nameCell.innerHTML =
            '<span class="empty-value">—</span>';

    }


    /* TELEGRAM */

    const telegramCell =
        document.createElement(
            "td"
        );


    if (telegramUsername) {

        const span =
            document.createElement(
                "span"
            );


        span.className =
            "telegram-username";


        span.textContent =
            telegramUsername.startsWith("@")
                ? telegramUsername
                : `@${telegramUsername}`;


        telegramCell.appendChild(
            span
        );

    }
    else {

        telegramCell.innerHTML =
            '<span class="empty-value">NO USERNAME</span>';

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


    /* X */

    const xCell =
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


        const span =
            document.createElement(
                "span"
            );


        span.className =
            "x-username";


        span.textContent =
            xUsername.startsWith("@")
                ? xUsername
                : `@${xUsername}`;


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
            () =>
                copyText(
                    xUsername,
                    copyButton
                )
        );


        wrapper.append(
            span,
            copyButton
        );


        xCell.appendChild(
            wrapper
        );

    }
    else {

        xCell.innerHTML =
            '<span class="empty-value">NOT ADDED</span>';

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
            () =>
                copyText(
                    solanaAddress,
                    copyButton
                )
        );


        wrapper.append(
            address,
            copyButton
        );


        solanaCell.appendChild(
            wrapper
        );

    }
    else {

        solanaCell.innerHTML =
            '<span class="empty-value">NOT ADDED</span>';

    }


    /* DATES */

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


    row.append(
        nameCell,
        telegramCell,
        chatCell,
        announcementsCell,
        xCell,
        solanaCell,
        joinedCell,
        updatedCell,
        createCountryCell(member),
        createVerifiedWalletCell(member)
    );


    return row;

}


/* =====================================================
   FILTER MEMBERS
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

            const values = [

                member.telegram_name,
                member.telegram_username,

                member.x_username,

                member.solana_address,

                member.country_code,
                member.country_name,

                member.wallet_address,
                member.wallet_provider,

                getChatStatus(member),

                getAnnouncementsStatus(
                    member
                ),

                cleanText(
                    member.wallet_address
                )
                    ? "yes wallet connected verified"
                    : "no wallet"

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


/* =====================================================
   RENDER MEMBERS
===================================================== */

function renderMembers() {

    if (!membersTableBody) {
        return;
    }


    const filtered =
        getFilteredMembers();


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filtered.length /
                MEMBERS_ITEMS_PER_PAGE
            )
        );


    membersCurrentPage =
        Math.min(
            Math.max(
                1,
                membersCurrentPage
            ),
            totalPages
        );


    const start =
        (
            membersCurrentPage - 1
        ) *
        MEMBERS_ITEMS_PER_PAGE;


    membersTableBody.innerHTML =
        "";


    filtered
        .slice(
            start,
            start +
            MEMBERS_ITEMS_PER_PAGE
        )
        .forEach(
            member => {

                membersTableBody.appendChild(

                    createMemberRow(
                        member
                    )

                );

            }
        );


    if (membersEmpty) {

        membersEmpty.hidden =
            filtered.length > 0;


        membersEmpty.textContent =
            cleanText(
                memberSearch?.value
            )
                ? "NO MATCHING MEMBERS FOUND."
                : "NO MEMBERS FOUND.";

    }


    if (membersPagination) {

        membersPagination.hidden =
            filtered.length <=
            MEMBERS_ITEMS_PER_PAGE;

    }


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


/* =====================================================
   ACCESS
===================================================== */

function showAccessError(
    status,
    message = ""
) {

        if (adminSidebar) {

        adminSidebar.hidden =
            true;

    }


    if (adminTopbar) {

        adminTopbar.hidden =
            true;

    }

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

    }
    else if (status === 403) {

        setAdminIdentity(
            "ACCESS DENIED"
        );


        setAdminMessage(
            "THIS TELEGRAM ACCOUNT IS NOT AUTHORIZED TO OPEN THE GREMBLE ADMIN PANEL.",
            "error"
        );

    }
    else {

        setAdminIdentity(
            "ERROR"
        );


        setAdminMessage(
            message ||
            "COULD NOT LOAD THE ADMIN PANEL.",
            "error"
        );

    }

}


/* =====================================================
   WALLET VISIBILITY
===================================================== */

function getWalletVisibilityFromResult(
    result = {}
) {

    const values = [
        result.wallet_visibility_enabled,
        result.wallet_visibility,
        result.wallet_visible,
        result.wallet_enabled,
        result.settings?.wallet_visibility_enabled,
        result.settings?.wallet_visibility,
        result.settings?.wallet_visible,
        result.settings?.wallet_enabled,
        result.config?.wallet_visibility_enabled,
        result.config?.wallet_visibility,
        result.config?.wallet_visible,
        result.config?.wallet_enabled
    ];


    for (const value of values) {

        if (typeof value === "boolean") {
            return value;
        }

    }


    return null;

}


function renderWalletVisibility() {

    if (walletVisibilityStatus) {

        if (walletVisibilityEnabled === true) {
            walletVisibilityStatus.textContent =
                "ON — VISIBLE TO MEMBERS";
        }
        else if (walletVisibilityEnabled === false) {
            walletVisibilityStatus.textContent =
                "OFF — HIDDEN FROM MEMBERS";
        }
        else {
            walletVisibilityStatus.textContent =
                "UNAVAILABLE";
        }

    }


    if (walletVisibilitySwitch) {

        const enabled =
            walletVisibilityEnabled === true;

        walletVisibilitySwitch.classList.toggle(
            "enabled",
            enabled
        );

        walletVisibilitySwitch.setAttribute(
            "aria-checked",
            enabled ? "true" : "false"
        );

        walletVisibilitySwitch.disabled =
            walletVisibilitySaving ||
            walletVisibilityEnabled === null;

    }

}


async function saveWalletVisibility(enabled) {

    if (walletVisibilitySaving) {
        return;
    }


    const token =
        getSessionToken();


    if (!token) {
        return;
    }


    walletVisibilitySaving =
        true;

    renderWalletVisibility();


    try {

        const response =
            await fetch(
                ADMIN_MEMBERS_ENDPOINT,
                {
                    method: "PATCH",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        action: "set_wallet_visibility",
                        wallet_visibility_enabled: enabled
                    }),

                    cache: "no-store"
                }
            );


        let result = null;

        try {
            result = await response.json();
        }
        catch {}


        if (response.status === 401) {
            clearLocalSession();
            showAccessError(401);
            return;
        }


        if (response.status === 403) {
            showAccessError(403);
            return;
        }


        if (!response.ok || !result?.success) {
            throw new Error(
                result?.error ||
                "COULD NOT UPDATE WALLET VISIBILITY."
            );
        }


        const returnedValue =
            getWalletVisibilityFromResult(result);

        walletVisibilityEnabled =
            returnedValue === null
                ? enabled
                : returnedValue;

        setAdminMessage(
            walletVisibilityEnabled
                ? "WALLET CONNECTION IS NOW VISIBLE TO MEMBERS."
                : "WALLET CONNECTION IS NOW HIDDEN FROM MEMBERS.",
            "success"
        );

    }
    catch (error) {

        setAdminMessage(
            error?.message ||
            "COULD NOT UPDATE WALLET VISIBILITY.",
            "error"
        );

    }
    finally {

        walletVisibilitySaving =
            false;

        renderWalletVisibility();

    }

}


/* =====================================================
   LOAD ADMIN
===================================================== */

async function loadAdminData() {

    const token =
        getSessionToken();


    if (
        !token ||
        sessionIsExpired()
    ) {

        if (
            sessionIsExpired()
        ) {

            clearLocalSession();

        }


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
                        Authorization:
                            `Bearer ${token}`
                    },

                    cache:
                        "no-store"
                }
            );


        let result =
            null;


        try {

            result =
                await response.json();

        }
        catch {}


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


        if (contestLoaded) {

            renderContestEntries();

        }


        if (adminDashboard) {

            adminDashboard.hidden =
                false;

        }


        if (adminSidebar) {

    adminSidebar.hidden =
        false;

}


if (adminTopbar) {

    adminTopbar.hidden =
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


        try {

            walletVisibilityEnabled =
                getWalletVisibilityFromResult(
                    result
                );

            renderWalletVisibility();

        }
        catch (walletError) {

            console.error(
                "Wallet visibility UI error:",
                walletError
            );

        }

    }
    catch (error) {

        console.error(
            "Admin panel error:",
            error
        );


        showAccessError(
            500,
            error?.message
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

function normalizeXUsername(value) {

    let username =
        cleanText(
            value
        );


    if (
        !username
    ) {

        return "";
    }


    username =
        username.trim();


    /*
       X / Twitter URL
       Example:
       https://x.com/Tobi_xv
       https://twitter.com/Tobi_xv/status/123
    */

    const urlMatch =
        username.match(
            /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/@?([A-Za-z0-9_]{1,15})/i
        );


    if (
        urlMatch?.[1]
    ) {

        return urlMatch[1]
            .toLowerCase();
    }


    /*
       @USERNAME anywhere in the value
    */

    const atMatch =
        username.match(
            /@([A-Za-z0-9_]{1,15})/
        );


    if (
        atMatch?.[1]
    ) {

        return atMatch[1]
            .toLowerCase();
    }


    /*
       Plain username
    */

    username =
        username
            .replace(
                /^@+/,
                ""
            )
            .split(
                /\s+/
            )[0]
            .replace(
                /[^A-Za-z0-9_]/g,
                ""
            )
            .toLowerCase();


    return username;

}


function findMemberByContestUsername(
    participant
) {

    const username =
        normalizeXUsername(
            participant
        );


    if (!username) {
        return null;
    }


    return (
        allMembers.find(
            member =>
                normalizeXUsername(
                    member.x_username
                ) === username
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


    const inChat =
        getChatStatus(
            member
        ) === "member";


    const inAnnouncements =
        getAnnouncementsStatus(
            member
        ) === "member";


    if (
        inChat ||
        inAnnouncements
    ) {

        return {
            type:
                "verified",

            tooltip:
                inChat &&
                inAnnouncements
                    ? "IN CHAT + ANNOUNCEMENTS"
                    : inChat
                        ? "IN GREMBLE CHAT"
                        : "IN GREMBLE ANNOUNCEMENTS"
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


    wrapper.title =
        status.tooltip;


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


function setContestRequirements(value) {

    if (
        contestRequirementsValue
    ) {

        contestRequirementsValue.value =
            value
                ? "true"
                : "false";

    }


    contestRequirementsYes?.classList.toggle(
        "active",
        value
    );


    contestRequirementsNo?.classList.toggle(
        "active",
        !value
    );

}


function updateContestStats() {

    if (contestTotalEntries) {

        contestTotalEntries.textContent =
            String(
                allContestEntries.length
            );

    }


    if (contestVerifiedEntries) {

        contestVerifiedEntries.textContent =
            String(
                allContestEntries.filter(
                    entry =>
                        entry.requirements_ok ===
                        true
                ).length
            );

    }

}


function getFilteredContestEntries() {

    const search =
        normalizeXUsername(
            contestSearch?.value
        );


    if (!search) {

        return [
            ...allContestEntries
        ];

    }


    return allContestEntries.filter(
        entry =>
            normalizeXUsername(
                entry.participant
            ).includes(
                search
            )
    );

}


function sortContestEntries(entries) {

    const mode =
        cleanText(
            contestSort?.value
        ) ||
        "newest";


    return [
        ...entries
    ].sort(
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
                a.requirements_ok
                    ? 1
                    : 0;


            const rulesB =
                b.requirements_ok
                    ? 1
                    : 0;


            if (
                mode === "oldest"
            ) {

                return (
                    dateA -
                    dateB
                );

            }


            if (
                mode === "points-high"
            ) {

                return (
                    pointsB -
                    pointsA ||
                    dateB -
                    dateA
                );

            }


            if (
                mode === "points-low"
            ) {

                return (
                    pointsA -
                    pointsB ||
                    dateB -
                    dateA
                );

            }


            if (
                mode === "rules-yes"
            ) {

                return (
                    rulesB -
                    rulesA ||
                    dateB -
                    dateA
                );

            }


            if (
                mode === "rules-no"
            ) {

                return (
                    rulesA -
                    rulesB ||
                    dateB -
                    dateA
                );

            }


            return (
                dateB -
                dateA
            );

        }
    );

}


/* =====================================================
   CONTEST ROW
===================================================== */

function createContestRow(entry) {

    const row =
        document.createElement(
            "tr"
        );


    /* PARTICIPANT */

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


    /* MEME */

    const memeCell =
        document.createElement(
            "td"
        );


    const memeUrl =
        cleanText(
            entry.meme_url
        );


    if (memeUrl) {

        const link =
            document.createElement(
                "a"
            );


        link.href =
            memeUrl;


        link.target =
            "_blank";


        link.rel =
            "noopener noreferrer";


        link.textContent =
            "OPEN MEME ↗";


        memeCell.appendChild(
            link
        );

    }
    else {

        memeCell.textContent =
            "—";

    }


    /* POINTS */

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


    /* RULES */

    const rulesCell =
        document.createElement(
            "td"
        );


    const rulesBadge =
        document.createElement(
            "span"
        );


    rulesBadge.className =
        `contest-rule-badge ${
            entry.requirements_ok
                ? "yes"
                : "no"
        }`;


    rulesBadge.textContent =
        entry.requirements_ok
            ? "YES"
            : "NO";


rulesCell.appendChild(
    rulesBadge
);


/* NOTE */

const noteCell =
    document.createElement(
        "td"
    );


const adminNote =
    cleanText(
        entry.admin_note
    );


if (adminNote) {

    const noteText =
        document.createElement(
            "span"
        );


    noteText.className =
        "contest-note-text";


    noteText.textContent =
        adminNote;


    noteText.title =
        adminNote;


    noteCell.appendChild(
        noteText
    );

}
else {

    noteCell.innerHTML =
        '<span class="empty-value">—</span>';

}


/* DATE */

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


    /* ACTIONS */

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
        () =>
            startContestEdit(
                entry
            )
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
        () =>
            deleteContestEntry(
                entry
            )
    );


    actions.append(
        editButton,
        deleteButton
    );


    actionsCell.appendChild(
        actions
    );


    /* STATUS */

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


 row.append(
    participantCell,
    memeCell,
    pointsCell,
    rulesCell,
    noteCell,
    addedCell,
    actionsCell,
    statusCell
);


    return row;

}


/* =====================================================
   CONTEST VIEW MODE
===================================================== */

function setContestViewMode(
    mode
) {

    contestViewMode =
        mode === "past"
            ? "past"
            : "current";


    if (contestCurrentTab) {

        contestCurrentTab.classList.toggle(
            "active",
            contestViewMode ===
            "current"
        );

    }


    if (contestPastTab) {

        contestPastTab.classList.toggle(
            "active",
            contestViewMode ===
            "past"
        );

    }


    if (endContestButton) {

        endContestButton.hidden =
            contestViewMode !==
            "current";

    }


const contestBody =
    document.querySelector(
        ".contest-body"
    );


const contestStats =
    document.querySelector(
        ".contest-stats"
    );


if (contestBody) {

    contestBody.hidden =
        contestViewMode !==
        "current";

}


if (contestStats) {

    contestStats.hidden =
        contestViewMode !==
        "current";

}


if (pastContestsPanel) {

    pastContestsPanel.hidden =
        contestViewMode !==
        "past";

}

}


/* =====================================================
   RENDER CONTEST
===================================================== */

function renderContestEntries() {

    if (!contestTableBody) {
        return;
    }


    const sorted =
        sortContestEntries(
            getFilteredContestEntries()
        );


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                sorted.length /
                CONTEST_ITEMS_PER_PAGE
            )
        );


    contestCurrentPage =
        Math.min(
            Math.max(
                1,
                contestCurrentPage
            ),
            totalPages
        );


    const start =
        (
            contestCurrentPage - 1
        ) *
        CONTEST_ITEMS_PER_PAGE;


    contestTableBody.innerHTML =
        "";


    sorted
        .slice(
            start,
            start +
            CONTEST_ITEMS_PER_PAGE
        )
        .forEach(
            entry => {

                contestTableBody.appendChild(

                    createContestRow(
                        entry
                    )

                );

            }
        );


    if (contestEntriesLabel) {

        contestEntriesLabel.textContent =
            `${sorted.length} ${sorted.length === 1 ? "ENTRY" : "ENTRIES"}`;

    }


    if (contestEmpty) {

        contestEmpty.hidden =
            sorted.length > 0;


        contestEmpty.textContent =
            cleanText(
                contestSearch?.value
            )
                ? "NO MATCHING PARTICIPANT."
                : "NO CONTEST ENTRIES YET.";

    }


    if (contestPagination) {

        contestPagination.hidden =
            sorted.length <=
            CONTEST_ITEMS_PER_PAGE;

    }


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


    updateContestStats();

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


if (contestAdminNote) {

    contestAdminNote.value =
        "";

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


if (contestAdminNote) {

    contestAdminNote.value =
        cleanText(
            entry.admin_note
        );

}


setContestRequirements(
    entry.requirements_ok ===
    true
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
            Authorization:
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


    let result =
        null;


    try {

        result =
            await response.json();

    }
    catch {}


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
   LOAD PAST CONTESTS
===================================================== */

async function loadPastContestSessions(
    force = false
) {

    if (
        pastContestLoading
    ) {

        return;
    }


    if (
        pastContestSessionsLoaded &&
        !force
    ) {

        renderPastContestSessions();

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


    pastContestLoading =
        true;


    if (pastContestsList) {

        pastContestsList.innerHTML =
            "";
    }


    if (pastContestsEmpty) {

        pastContestsEmpty.hidden =
            true;
    }


    try {

        const response =
            await fetch(
                `${ADMIN_CONTEST_ENDPOINT}?history=1`,
                {

                    method:
                        "GET",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    },

                    cache:
                        "no-store"

                }
            );


        let result =
            null;


        try {

            result =
                await response.json();

        }
        catch {

            result =
                null;

        }


        if (
            response.status ===
            401
        ) {

            clearLocalSession();

            showAccessError(
                401
            );

            return;
        }


        if (
            response.status ===
            403
        ) {

            showAccessError(
                403
            );

            return;
        }


        if (
            !response.ok ||
            result?.success !==
            true
        ) {

            throw new Error(
                result?.error ||
                "COULD NOT LOAD PAST CONTESTS."
            );
        }


        pastContestSessions =
            Array.isArray(
                result.sessions
            )
                ? result.sessions
                : [];


        pastContestSessionsLoaded =
            true;


        renderPastContestSessions();

    }
    catch (error) {

        console.error(
            "Past contests error:",
            error
        );


        setContestMessage(
            error?.message ||
            "COULD NOT LOAD PAST CONTESTS.",
            "error"
        );

    }
    finally {

        pastContestLoading =
            false;

    }

}


/* =====================================================
   RENDER PAST CONTESTS
===================================================== */

function renderPastContestSessions() {

    if (
        !pastContestsList
    ) {

        return;
    }


    pastContestsList.innerHTML =
        "";


    if (
        pastContestsCount
    ) {

        pastContestsCount.textContent =
            `${pastContestSessions.length} ${
                pastContestSessions.length ===
                1
                    ? "CONTEST"
                    : "CONTESTS"
            }`;

    }


    if (
        pastContestsEmpty
    ) {

        pastContestsEmpty.hidden =
            pastContestSessions.length >
            0;

    }


    pastContestSessions.forEach(
        session => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "past-contest-card";


            const copy =
                document.createElement(
                    "div"
                );


            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "past-contest-card-title";


            title.textContent =
                cleanText(
                    session.title
                ) ||
                "Gremble Meme Contest";


            const meta =
                document.createElement(
                    "div"
                );


            meta.className =
                "past-contest-card-meta";


            meta.textContent =
                `${formatDate(
                    session.ended_at
                )} • ${
                    numberOrZero(
                        session.total_entries
                    )
                } ENTRIES • ${
                    numberOrZero(
                        session.verified_entries
                    )
                } VERIFIED`;


            copy.append(
                title,
                meta
            );


            const openButton =
                document.createElement(
                    "button"
                );


            openButton.type =
                "button";


            openButton.className =
                "past-contest-open-button";


            openButton.textContent =
                "OPEN";


            openButton.dataset.contestSessionId =
                String(
                    session.id
                );


            openButton.addEventListener(
                 "click",
                      async () => {

                  await loadPastContestDetail(
                       session.id
        );

    }
);


            card.append(
                copy,
                openButton
            );


            pastContestsList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   LOAD PAST CONTEST DETAIL
===================================================== */

async function loadPastContestDetail(
    sessionId
) {

    const id =
        Number(
            sessionId
        );


    if (
        !Number.isSafeInteger(
            id
        ) ||
        id <= 0
    ) {

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


    try {

        const response =
            await fetch(
                `${ADMIN_CONTEST_ENDPOINT}?history=1&session_id=${encodeURIComponent(id)}`,
                {

                    method:
                        "GET",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    },

                    cache:
                        "no-store"

                }
            );


        let result =
            null;


        try {

            result =
                await response.json();

        }
        catch {

            result =
                null;

        }


        if (
            response.status ===
            401
        ) {

            clearLocalSession();

            showAccessError(
                401
            );

            return;
        }


        if (
            response.status ===
            403
        ) {

            showAccessError(
                403
            );

            return;
        }


        if (
            !response.ok ||
            result?.success !==
            true
        ) {

            throw new Error(
                result?.error ||
                "COULD NOT LOAD PAST CONTEST."
            );
        }


        selectedPastContestId =
            id;


        renderPastContestDetail(
            result.session,
            Array.isArray(
                result.entries
            )
                ? result.entries
                : []
        );

    }
    catch (error) {

        console.error(
            "Past contest detail error:",
            error
        );


        setContestMessage(
            error?.message ||
            "COULD NOT LOAD PAST CONTEST.",
            "error"
        );

    }

}


/* =====================================================
   END CONTEST
===================================================== */

async function endCurrentContest() {

    if (
        contestSaving
    ) {

        return;
    }


    if (
        allContestEntries.length ===
        0
    ) {

        setContestMessage(
            "THERE ARE NO ENTRIES TO ARCHIVE.",
            "error"
        );

        return;
    }


    const confirmed =
        window.confirm(
            `END CURRENT CONTEST?\n\n${allContestEntries.length} participants will be moved to Past Contests.\n\nThis cannot be undone.`
        );


    if (
        !confirmed
    ) {

        return;
    }


    contestSaving =
        true;


    if (
        endContestButton
    ) {

        endContestButton.disabled =
            true;

        endContestButton.textContent =
            "ENDING...";

    }


    try {

        const result =
            await contestRequest(
                "POST",
                {
                    action:
                        "end_contest",

                    title:
                        "Gremble Meme Contest"
                }
            );


        if (
            result?.success !==
            true ||
            result?.ended !==
            true
        ) {

            throw new Error(
                result?.error ||
                "COULD NOT END CONTEST."
            );

        }


        /*
           Backend already archived the contest
           successfully before clearing current entries.
        */

        allContestEntries =
            [];

        contestCurrentPage =
            1;

        contestLoaded =
            true;


        /*
           Force Past Contests to reload because
           a new archived contest now exists.
        */

        pastContestSessionsLoaded =
            false;

        selectedPastContestId =
            null;


        resetContestForm();

        renderContestEntries();


        setContestMessage(
            "CONTEST ENDED AND SAVED TO PAST CONTESTS.",
            "success"
        );


        /*
           Open Past Contests immediately so the admin
           can see the archived contest.
        */

        setContestViewMode(
            "past"
        );


        await loadPastContestSessions(
            true
        );

    }
    catch (error) {

        console.error(
            "End contest error:",
            error
        );


        setContestMessage(
            error?.message ||
            "COULD NOT END CONTEST.",
            "error"
        );

    }
    finally {

        contestSaving =
            false;


        if (
            endContestButton
        ) {

            endContestButton.disabled =
                false;

            endContestButton.textContent =
                "END CONTEST";

        }

    }

}


/* =====================================================
   RENDER PAST CONTEST DETAIL
===================================================== */

function renderPastContestDetail(
    session,
    entries
) {

    if (
        !pastContestsList
    ) {

        return;
    }


    pastContestsList.innerHTML =
        "";


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "past-contest-detail";


    const top =
        document.createElement(
            "div"
        );


    top.className =
        "past-contest-detail-top";


    const copy =
        document.createElement(
            "div"
        );


    const title =
        document.createElement(
            "div"
        );


    title.className =
        "past-contest-card-title";


    title.textContent =
        cleanText(
            session?.title
        ) ||
        "Gremble Meme Contest";


    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "past-contest-card-meta";


    meta.textContent =
        `ENDED ${formatDate(
            session?.ended_at
        )} • ${
            numberOrZero(
                session?.total_entries
            )
        } ENTRIES • ${
            numberOrZero(
                session?.verified_entries
            )
        } VERIFIED`;


    copy.append(
        title,
        meta
    );


    const backButton =
        document.createElement(
            "button"
        );


    backButton.type =
        "button";


    backButton.className =
        "past-contest-open-button";


    backButton.textContent =
        "← BACK";


    backButton.addEventListener(
        "click",
        () => {

            selectedPastContestId =
                null;

            renderPastContestSessions();

        }
    );


    top.append(
        copy,
        backButton
    );


    wrapper.appendChild(
        top
    );


    const tableWrap =
        document.createElement(
            "div"
        );


    tableWrap.className =
        "contest-table-wrap";


    const table =
        document.createElement(
            "table"
        );


    table.className =
        "contest-table";


    table.innerHTML =
        `
            <thead>
                <tr>
                    <th>PARTICIPANT</th>
                    <th>MEME</th>
                    <th>POINTS</th>
                    <th>RULES</th>
                    <th>NOTE</th>
                    <th>ADDED</th>
                    <th>STATUS</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;


    const tableBody =
        table.querySelector(
            "tbody"
        );


    entries.forEach(
        entry => {

            const row =
                document.createElement(
                    "tr"
                );


            /* PARTICIPANT */

            const participantCell =
                document.createElement(
                    "td"
                );


            const participant =
                document.createElement(
                    "span"
                );


            participant.className =
                "contest-participant-name";


            participant.textContent =
                cleanText(
                    entry.participant
                ) ||
                "—";


            participantCell.appendChild(
                participant
            );


            /* MEME */

            const memeCell =
                document.createElement(
                    "td"
                );


            const memeUrl =
                cleanText(
                    entry.meme_url
                );


            if (
                memeUrl
            ) {

                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    memeUrl;


                link.target =
                    "_blank";


                link.rel =
                    "noopener noreferrer";


                link.textContent =
                    "OPEN MEME ↗";


                memeCell.appendChild(
                    link
                );

            }
            else {

                memeCell.textContent =
                    "—";

            }


            /* POINTS */

            const pointsCell =
                document.createElement(
                    "td"
                );


            pointsCell.textContent =
                String(
                    numberOrZero(
                        entry.points
                    )
                );


            /* RULES */

            const rulesCell =
                document.createElement(
                    "td"
                );


            const rulesBadge =
                document.createElement(
                    "span"
                );


            rulesBadge.className =
                `contest-rule-visual ${
                    entry.requirements_ok ===
                    true
                        ? "yes"
                        : "no"
                }`;


            rulesBadge.textContent =
                entry.requirements_ok ===
                true
                    ? "YES"
                    : "NO";


            rulesCell.appendChild(
                rulesBadge
            );


            /* NOTE */

            const noteCell =
                document.createElement(
                    "td"
                );


            const note =
                cleanText(
                    entry.admin_note
                );


            noteCell.textContent =
                note ||
                "—";


            if (
                note
            ) {

                noteCell.title =
                    note;

            }


            /* ADDED */

            const addedCell =
                document.createElement(
                    "td"
                );


            addedCell.className =
                "date-value";


            addedCell.textContent =
                formatDate(
                    entry.entry_created_at
                );


            /* STATUS */

            const statusCell =
                document.createElement(
                    "td"
                );


            const status =
                cleanText(
                    entry.member_status
                ) ||
                "not-found";


            const statusElement =
                document.createElement(
                    "span"
                );


            statusElement.className =
                `contest-member-status ${status}`;


            statusElement.title =
                cleanText(
                    entry.member_status_note
                );


            const statusDot =
                document.createElement(
                    "span"
                );


            statusDot.className =
                "contest-member-status-dot";


            statusElement.appendChild(
                statusDot
            );


            statusCell.appendChild(
                statusElement
            );


            row.append(
                participantCell,
                memeCell,
                pointsCell,
                rulesCell,
                noteCell,
                addedCell,
                statusCell
            );


            tableBody?.appendChild(
                row
            );

        }
    );


    if (
        entries.length ===
        0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "past-contests-empty";


        empty.textContent =
            "NO ENTRIES IN THIS CONTEST.";


        wrapper.appendChild(
            empty
        );

    }
    else {

        tableWrap.appendChild(
            table
        );


        wrapper.appendChild(
            tableWrap
        );

    }


    pastContestsList.appendChild(
        wrapper
    );

}


/* =====================================================
   LOAD CONTEST
===================================================== */

async function loadContestEntries(
    force = false
) {

    if (
        contestLoading ||
        (
            contestLoaded &&
            !force
        )
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
   SAVE CONTEST
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


const adminNote =
    cleanText(
        contestAdminNote?.value
    );


const requirementsOk =
    contestRequirementsValue?.value ===
    "true";


const id =
    Number(
        contestEntryId?.value
    );


    if (!participant) {

        setContestMessage(
            "ENTER PARTICIPANT X USERNAME.",
            "error"
        );

        return;

    }


    if (!memeUrl) {

        setContestMessage(
            "ENTER MEME LINK.",
            "error"
        );

        return;

    }


    try {

        const url =
            new URL(
                memeUrl
            );


        if (
            ![
                "http:",
                "https:"
            ].includes(
                url.protocol
            )
        ) {

            throw new Error();

        }

    }
    catch {

        setContestMessage(
            "ENTER A VALID MEME LINK.",
            "error"
        );

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

        return;

    }


    const editing =
        Number.isSafeInteger(
            id
        ) &&
        id > 0;


    contestSaving =
        true;


    if (contestSubmitButton) {

        contestSubmitButton.disabled =
            true;


        contestSubmitButton.textContent =
            editing
                ? "SAVING..."
                : "ADDING...";

    }


    try {

  const payload = {
    participant,
    meme_url:
        memeUrl,
    points,
    requirements_ok:
        requirementsOk,
    admin_note:
        adminNote
};


        if (editing) {

            payload.id =
                id;

        }


        await contestRequest(
            editing
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
            editing
                ? "PARTICIPANT UPDATED."
                : "PARTICIPANT ADDED.",
            "success"
        );

    }
    catch (error) {

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


            contestSubmitButton.textContent =
                Number(
                    contestEntryId?.value
                ) > 0
                    ? "SAVE CHANGES"
                    : "+ ADD PARTICIPANT";

        }

    }

}


/* =====================================================
   DELETE CONTEST
===================================================== */

async function deleteContestEntry(entry) {

    if (!entry) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete ${cleanText(entry.participant) || "this participant"} from the contest?`
        );


    if (!confirmed) {
        return;
    }


    try {

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
            "PARTICIPANT DELETED.",
            "success"
        );

    }
    catch (error) {

        setContestMessage(
            error?.message ||
            "COULD NOT DELETE PARTICIPANT.",
            "error"
        );

    }

}


/* =====================================================
   QUIZ HELPERS
===================================================== */

function normalizeQuizAnswerTime(value) {

    const number =
        Number(value);


    return QUIZ_ANSWER_TIME_OPTIONS.includes(
        number
    )
        ? number
        : QUIZ_DEFAULT_ANSWER_TIME;

}


/* =====================================================
   QUESTION EDITOR
===================================================== */

function resetQuizQuestionEditor() {

    if (quizQuestionEditingId) {

        quizQuestionEditingId.value =
            "";

    }


    [
        quizQuestionText,
        quizAnswerA,
        quizAnswerB,
        quizAnswerC,
        quizAnswerD
    ].forEach(
        element => {

            if (element) {

                element.value =
                    "";

            }

        }
    );


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


        const correctAnswer =
            cleanText(
                question.correct_answer
            ).toUpperCase();


        if (quizCorrectAnswer) {

            quizCorrectAnswer.value =
                correctAnswer;

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
                    correctAnswer
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
   QUESTION DATA
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
        quizCorrectAnswer?.value ||
        quizCorrectButtons.find(
            button =>
                button.classList.contains(
                    "active"
                )
        )?.dataset.correctAnswer
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

function saveQuizQuestion(event) {

    event?.preventDefault();
    event?.stopPropagation();

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
                    question =>
                        String(
                            question.local_id
                        ) ===
                        editingId
                );


            if (
                index < 0
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
                    question,
                    index
                ) => ({
                    ...question,
                    sort_order:
                        index + 1
                })
            );


        closeQuizQuestionEditor();


        renderQuizQuestions();


        setQuizBuilderMessage(
            `QUESTION SAVED — 4 SEC READ + ${questionData.answer_time_seconds} SEC ANSWER TIME.`,
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

function deleteQuestionById(id) {

    if (!id) {
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
        quizDraftQuestions
            .filter(
                question =>
                    String(
                        question.local_id
                    ) !==
                    String(id)
            )
            .map(
                (
                    question,
                    index
                ) => ({
                    ...question,
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


/* =====================================================
   RENDER QUESTIONS
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
                quizQuestionListItemTemplate
                    .content
                    .cloneNode(
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


            if (title) {

                title.textContent =
                    `${index + 1}. ${question.question}`;

            }


            if (meta) {

                meta.textContent =
                    `4 SEC READ · ${normalizeQuizAnswerTime(question.answer_time_seconds)} SEC ANSWER · CORRECT ${question.correct_answer} · MAX 1000 PTS`;

            }


            editButton?.addEventListener(
                "click",
                () =>
                    openQuizQuestionEditor(
                        question
                    )
            );


            deleteButton?.addEventListener(
                "click",
                () =>
                    deleteQuestionById(
                        question.local_id
                    )
            );


            quizQuestionList.appendChild(
                fragment
            );

        }
    );

}


/* =====================================================
   CLEAR BUILDER
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


/* =====================================================
   QUIZ PAYLOAD
===================================================== */

function getQuizDraftPayload() {

    const title =
        cleanText(
            quizTitle?.value
        );


    if (!title) {

        throw new Error(
            "ENTER QUIZ TITLE."
        );

    }


    if (
        !quizDraftQuestions.length
    ) {

        throw new Error(
            "ADD AT LEAST ONE QUESTION."
        );

    }


    return {
        id:
            cleanText(
                quizEditingId?.value
            ) ||
            null,

        title,

        description:
            cleanText(
                quizDescription?.value
            ),

        questions:
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
                        4,

                    answer_time_seconds:
                        normalizeQuizAnswerTime(
                            question.answer_time_seconds
                        ),

                    max_score:
                        1000
                })
            )
    };

}


/* =====================================================
   QUIZ ADMIN REQUEST
===================================================== */

async function quizAdminRequest(
    method,
    body = null,
    query = ""
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
            Authorization:
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
            `${ADMIN_QUIZ_ENDPOINT}${query}`,
            options
        );


    let result =
        null;


    try {

        result =
            await response.json();

    }
    catch {}


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


        const result =
            await quizAdminRequest(
                payload.id
                    ? "PUT"
                    : "POST",
                payload
            );


        setQuizBuilderMessage(
            payload.id
                ? "QUIZ UPDATED."
                : "QUIZ SAVED.",
            "success"
        );


        await loadSavedQuizzes();


        if (result.quiz) {

            loadQuizIntoBuilder(
                result.quiz
            );

        }

    }
    catch (error) {

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
                        4,

                    answer_time_seconds:
                        normalizeQuizAnswerTime(

                            question.answer_time_seconds ??
                            question.time_seconds

                        ),

                    max_score:
                        1000
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

    const title =
        cleanText(
            quizTitle?.value
        );


    if (!title) {

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
            `${title} COPY`;

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
                    index + 1
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


        await loadSavedQuizzes();

    }
    catch (error) {

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

    document.querySelector(
        `[data-quiz-subview="${name}"]`
    )?.click();

}


/* =====================================================
   SAVED QUIZZES RENDER
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
                savedQuizCardTemplate
                    .content
                    .cloneNode(
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


            const questionCount =
                Array.isArray(
                    quiz.questions
                )
                    ? quiz.questions.length
                    : numberOrZero(
                        quiz.question_count
                    );


            if (title) {

                title.textContent =
                    cleanText(
                        quiz.title
                    ) ||
                    "UNTITLED QUIZ";

            }


            if (meta) {

                meta.textContent =
                    `${questionCount} ${questionCount === 1 ? "QUESTION" : "QUESTIONS"} · 4 SEC READ · CUSTOM ANSWER TIME`;

            }


            editButton?.addEventListener(
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


            duplicateButton?.addEventListener(
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


            liveButton?.addEventListener(
                "click",
                () =>
                    selectQuizForLive(
                        quiz
                    )
            );


            deleteButton?.addEventListener(
                "click",
                () =>
                    deleteSavedQuiz(
                        quiz
                    )
            );


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


    if (
        liveQuizTotalQuestions &&
        !liveQuizSession
    ) {

        liveQuizTotalQuestions.textContent =
            String(
                Array.isArray(
                    quiz?.questions
                )
                    ? quiz.questions.length
                    : numberOrZero(
                        quiz?.question_count
                    )
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
   LIVE STATUS
===================================================== */

function currentQuestionNumber() {

    return numberOrZero(

        liveQuizSession?.current_question_number ??
        liveQuizLastQuestion?.question_number ??
        liveQuizLastQuestion?.sort_order

    );

}


function liveQuestionIsOpen() {

    const value =

        liveQuizSession?.answers_close_at ??
        liveQuizLastQuestion?.answers_close_at ??
        liveQuizLastQuestion?.answer_close_at;


    if (!value) {
        return false;
    }


    const time =
        new Date(
            value
        ).getTime();


    return (
        Number.isFinite(time) &&
        time >
        Date.now()
    );

}


function updateLiveQuizStatusUI() {

    const status =
        cleanText(
            liveQuizSession?.status
        ).toLowerCase() ||
        "inactive";


    const totalQuestions =
        liveQuizLastTotalQuestions ||
        (
            Array.isArray(
                selectedLiveQuiz?.questions
            )
                ? selectedLiveQuiz.questions.length
                : numberOrZero(
                    selectedLiveQuiz?.question_count
                )
        );


    const currentQuestion =
        currentQuestionNumber();


    const questionOpen =
        status === "live" &&
        liveQuestionIsOpen();


    const finalQuestion =
        status === "live" &&
        totalQuestions > 0 &&
        currentQuestion >=
        totalQuestions;


    if (liveQuizStatus) {

        liveQuizStatus.textContent =
            status.toUpperCase();

    }


    if (liveQuizPlayerCount) {

        liveQuizPlayerCount.textContent =
            String(
                liveQuizPlayers.length
            );

    }


    if (liveLobbyPlayerCountBadge) {

        liveLobbyPlayerCountBadge.textContent =
            `${liveQuizPlayers.length} ${liveQuizPlayers.length === 1 ? "PLAYER" : "PLAYERS"}`;

    }


    if (liveQuizTotalQuestions) {

        liveQuizTotalQuestions.textContent =
            String(
                totalQuestions
            );

    }


    if (liveQuizStatusBadge) {

        liveQuizStatusBadge.className =
            "live-status-badge";


        if (
            [
                "lobby",
                "live"
            ].includes(
                status
            )
        ) {

            liveQuizStatusBadge.classList.add(
                status
            );

        }


        liveQuizStatusBadge.textContent =
            status.toUpperCase();

    }


    if (sidebarQuizLiveDot) {

        sidebarQuizLiveDot.hidden =
            ![
                "lobby",
                "live"
            ].includes(
                status
            );

    }


    if (openQuizLobbyButton) {

        openQuizLobbyButton.disabled =
            status !== "inactive" ||
            !selectedLiveQuiz;

    }


    if (startQuizButton) {

        startQuizButton.disabled =
            status !== "lobby";

    }


    if (closeQuizLobbyButton) {

        closeQuizLobbyButton.disabled =
            status !== "lobby";

    }


    if (nextQuizQuestionButton) {

        nextQuizQuestionButton.disabled =
            status !== "live" ||
            questionOpen ||
            finalQuestion;

    }


    if (finishQuizButton) {

        finishQuizButton.disabled =
            status !== "live" ||
            questionOpen ||
            !finalQuestion;

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


    if (liveQuizPlayerTemplate) {

        liveQuizPlayers.forEach(
            player => {

                const fragment =
                    liveQuizPlayerTemplate
                        .content
                        .cloneNode(
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

                            player.telegram_name ??
                            player.name

                        ) ||
                        "Telegram Player";

                }


                if (username) {

                    const value =
                        cleanText(

                            player.telegram_username ??
                            player.username

                        );


                    username.textContent =
                        value
                            ? (
                                value.startsWith("@")
                                    ? value
                                    : `@${value}`
                            )
                            : "NO USERNAME";

                }


                liveQuizPlayersList.appendChild(
                    fragment
                );

            }
        );

    }


    updateLiveQuizStatusUI();

}


/* =====================================================
   LIVE REQUEST
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
                    Authorization:
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


    let result =
        null;


    try {

        result =
            await response.json();

    }
    catch {}


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

            result.total_questions ??
            result.session?.total_questions

        );


    liveQuizLastQuestion =
        result.question ||
        result.current_question ||
        null;


    liveQuizLastStats =
        (
            result.stats &&
            typeof result.stats ===
            "object"
        )
            ? result.stats
            : {};


    if (liveQuizSession) {

        const matchingQuiz =
            savedQuizzes.find(
                quiz =>
                    String(
                        quiz.id
                    ) ===
                    String(
                        liveQuizSession.quiz_id
                    )
            );


        selectedLiveQuiz =
            matchingQuiz ||
            {
                id:
                    liveQuizSession.quiz_id,

                title:
                    liveQuizSession.quiz_title ||
                    result.quiz_title ||
                    "LIVE QUIZ",

                questions:
                    []
            };


        if (liveQuizSelectedTitle) {

            liveQuizSelectedTitle.textContent =

                cleanText(
                    liveQuizSession.quiz_title
                ) ||

                cleanText(
                    result.quiz_title
                ) ||

                cleanText(
                    selectedLiveQuiz.title
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

    if (
        liveQuizStateLoading ||
        !getSessionToken() ||
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


    liveQuizStatePollTimer =
        setInterval(
            () => {

                if (
                    document.visibilityState ===
                    "visible"
                ) {

                    loadLiveQuizState(
                        true
                    );

                }

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


        pastQuizResultsCache.clear();


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
   CURRENT QUESTION
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


    const number =
        numberOrZero(

            question.sort_order ??
            question.question_number ??
            liveQuizSession?.current_question_number

        );


    if (liveQuizCurrentQuestion) {

        liveQuizCurrentQuestion.textContent =
            String(
                number ||
                "—"
            );

    }


    if (currentQuizQuestionNumber) {

        currentQuizQuestionNumber.textContent =
            `QUESTION ${number || ""}`;

    }


    if (currentQuizQuestionText) {

        currentQuizQuestionText.textContent =

            cleanText(

                question.question ??
                question.question_text

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
   PAST QUIZ HELPERS
===================================================== */

function formatTelegramUsername(value) {

    const username =
        cleanText(value);


    if (!username) {

        return "—";

    }


    return username.startsWith("@")
        ? username
        : `@${username}`;

}


function normalizePastPlayer(
    player,
    index = 0
) {

    return {
        ...player,

        rank:
            numberOrZero(

                player.rank ??
                player.position ??
                player.place

            ) ||
            index + 1,

        score:
            numberOrZero(

                player.score ??
                player.total_score ??
                player.points

            ),

        correct:
            numberOrZero(

                player.correct ??
                player.correct_count ??
                player.correct_answers

            ),

        wrong:
            numberOrZero(

                player.wrong ??
                player.wrong_count ??
                player.wrong_answers

            ),

        no_answer:
            numberOrZero(

                player.no_answer ??
                player.no_answer_count ??
                player.unanswered ??
                player.missed

            ),

        telegram_name:
            cleanText(

                player.telegram_name ??
                player.player_name ??
                player.name

            ),

        telegram_username:
            cleanText(

                player.telegram_username ??
                player.player_username ??
                player.username

            )
    };

}


function getInlinePastResults(session) {

    const possibleResults = [

        session?.results,
        session?.players,
        session?.leaderboard,
        session?.final_results,
        session?.rankings

    ];


    for (
        const value
        of possibleResults
    ) {

        if (
            Array.isArray(
                value
            )
        ) {

            return value;

        }

    }


    return [];

}


function extractPastResults(
    result,
    sessionId
) {

    const possibleResults = [

        result?.results,
        result?.players,
        result?.leaderboard,
        result?.final_results,
        result?.rankings,

        result?.session?.results,
        result?.session?.players,
        result?.session?.leaderboard

    ];


    for (
        const value
        of possibleResults
    ) {

        if (
            Array.isArray(
                value
            )
        ) {

            return value;

        }

    }


    if (
        Array.isArray(
            result?.sessions
        )
    ) {

        const matchingSession =
            result.sessions.find(
                session =>
                    String(
                        session.id
                    ) ===
                    String(
                        sessionId
                    )
            );


        return getInlinePastResults(
            matchingSession
        );

    }


    return [];

}


function sortPastPlayers(players) {

    return players
        .map(
            normalizePastPlayer
        )
        .sort(
            (a, b) =>
                b.score -
                a.score ||
                a.rank -
                b.rank
        )
        .map(
            (
                player,
                index
            ) => ({
                ...player,
                rank:
                    index + 1
            })
        );

}


/* =====================================================
   PAST QUIZ ROW
===================================================== */

function createPastQuizResultRow(
    player,
    index
) {

    const row =
        document.createElement(
            "tr"
        );


    const cells = [

        {
            className:
                "past-rank",

            value:
                index === 0
                    ? "🥇 1"
                    : index === 1
                        ? "🥈 2"
                        : index === 2
                            ? "🥉 3"
                            : String(
                                index + 1
                            )
        },

        {
            className:
                "past-player-name",

            value:
                cleanText(
                    player.telegram_name
                ) ||
                "Telegram Player"
        },

        {
            className:
                "past-player-username",

            value:
                formatTelegramUsername(
                    player.telegram_username
                )
        },

        {
            className:
                "past-player-score",

            value:
                numberOrZero(
                    player.score
                )
        },

        {
            className:
                "past-player-correct",

            value:
                numberOrZero(
                    player.correct
                )
        },

        {
            className:
                "past-player-wrong",

            value:
                numberOrZero(
                    player.wrong
                )
        },

        {
            className:
                "past-player-no-answer",

            value:
                numberOrZero(
                    player.no_answer
                )
        }

    ];


    cells.forEach(
        item => {

            const cell =
                document.createElement(
                    "td"
                );


            cell.className =
                item.className;


            cell.textContent =
                String(
                    item.value
                );


            row.appendChild(
                cell
            );

        }
    );


    return row;

}


/* =====================================================
   FETCH PAST RESULTS
===================================================== */

async function fetchPastQuizResults(session) {

    const sessionId =
        session?.id;


    if (!sessionId) {

        return [];

    }


    const cacheKey =
        String(
            sessionId
        );


    if (
        pastQuizResultsCache.has(
            cacheKey
        )
    ) {

        return pastQuizResultsCache.get(
            cacheKey
        );

    }


    const inlineResults =
        getInlinePastResults(
            session
        );


    if (
        inlineResults.length
    ) {

        const sorted =
            sortPastPlayers(
                inlineResults
            );


        pastQuizResultsCache.set(
            cacheKey,
            sorted
        );


        return sorted;

    }


    const result =
        await quizAdminRequest(
            "GET",
            null,
            `?history=1&session_id=${encodeURIComponent(sessionId)}`
        );


    const sorted =
        sortPastPlayers(

            extractPastResults(
                result,
                sessionId
            )

        );


    pastQuizResultsCache.set(
        cacheKey,
        sorted
    );


    return sorted;

}


/* =====================================================
   OPEN PAST QUIZ DETAILS
===================================================== */

async function openPastQuizDetails(
    session,
    details,
    button,
    tableBody,
    totalElement,
    loadingElement,
    emptyElement
) {

    if (!details.hidden) {

        details.hidden =
            true;


        button.textContent =
            "VIEW RESULTS";


        return;

    }


    details.hidden =
        false;


    button.textContent =
        "HIDE RESULTS";


    if (
        details.dataset.loaded ===
        "true"
    ) {

        return;

    }


    if (loadingElement) {

        loadingElement.hidden =
            false;

    }


    if (emptyElement) {

        emptyElement.hidden =
            true;

    }


    try {

        const players =
            await fetchPastQuizResults(
                session
            );


        tableBody.innerHTML =
            "";


        players.forEach(
            (
                player,
                index
            ) => {

                tableBody.appendChild(

                    createPastQuizResultRow(
                        player,
                        index
                    )

                );

            }
        );


        if (totalElement) {

            totalElement.textContent =
                `${players.length} ${players.length === 1 ? "PLAYER" : "PLAYERS"}`;

        }


        if (emptyElement) {

            emptyElement.hidden =
                players.length > 0;

        }


        details.dataset.loaded =
            "true";

    }
    catch (error) {

        tableBody.innerHTML =
            "";


        if (emptyElement) {

            emptyElement.hidden =
                false;


            emptyElement.textContent =
                error?.message ||
                "COULD NOT LOAD PLAYER RESULTS.";

        }

    }
    finally {

        if (loadingElement) {

            loadingElement.hidden =
                true;

        }

    }

}


/* =====================================================
   LOAD PAST QUIZZES
===================================================== */

async function loadPastQuizzes() {

    try {

        const result =
            await quizAdminRequest(
                "GET",
                null,
                "?history=1"
            );


        pastQuizSessions =
            Array.isArray(
                result.sessions
            )
                ? result.sessions
                : [];


        renderPastQuizzes();

    }
    catch (error) {

        console.error(
            "Past quiz load error:",
            error
        );

    }

}


/* =====================================================
   DELETE PAST QUIZ
===================================================== */

async function deletePastQuiz(
    session,
    button
) {

    const sessionId =
        session?.id;


    if (!sessionId) {
        return;
    }


    const title =
        cleanText(
            session.quiz_title ??
            session.title
        ) ||
        "QUIZ";


    if (
        !window.confirm(
            `Delete past quiz "${title}"? This cannot be undone.`
        )
    ) {
        return;
    }


    if (button) {
        button.disabled = true;
        button.textContent = "DELETING...";
    }


    try {

        await quizAdminRequest(
            "DELETE",
            null,
            `?history=1&session_id=${encodeURIComponent(sessionId)}`
        );

        pastQuizResultsCache.delete(
            String(sessionId)
        );

        pastQuizSessions =
            pastQuizSessions.filter(
                item =>
                    String(item?.id) !==
                    String(sessionId)
            );

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    pastQuizSessions.length /
                    PAST_QUIZZES_ITEMS_PER_PAGE
                )
            );

        if (pastQuizCurrentPage > totalPages) {
            pastQuizCurrentPage = totalPages;
        }

        renderPastQuizzes();

        setAdminMessage(
            "PAST QUIZ DELETED.",
            "success"
        );

    }
    catch (error) {

        if (button) {
            button.disabled = false;
            button.textContent = "DELETE";
        }

        setAdminMessage(
            error?.message ||
            "COULD NOT DELETE PAST QUIZ.",
            "error"
        );

    }

}


/* =====================================================
   RENDER PAST QUIZZES
===================================================== */

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


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                pastQuizSessions.length /
                PAST_QUIZZES_ITEMS_PER_PAGE
            )
        );


    pastQuizCurrentPage =
        Math.min(
            Math.max(1, pastQuizCurrentPage),
            totalPages
        );


    if (pastQuizPagination) {
        pastQuizPagination.hidden =
            pastQuizSessions.length <=
            PAST_QUIZZES_ITEMS_PER_PAGE;
    }


    if (pastQuizPageInfo) {
        pastQuizPageInfo.textContent =
            `${pastQuizCurrentPage} OF ${totalPages}`;
    }


    if (pastQuizPrevPage) {
        pastQuizPrevPage.disabled =
            pastQuizCurrentPage <= 1;
    }


    if (pastQuizNextPage) {
        pastQuizNextPage.disabled =
            pastQuizCurrentPage >= totalPages;
    }


    if (!pastQuizCardTemplate) {
        return;
    }


    const startIndex =
        (pastQuizCurrentPage - 1) *
        PAST_QUIZZES_ITEMS_PER_PAGE;

    const visibleSessions =
        pastQuizSessions.slice(
            startIndex,
            startIndex +
            PAST_QUIZZES_ITEMS_PER_PAGE
        );


    visibleSessions.forEach(
        session => {

            const fragment =
                pastQuizCardTemplate
                    .content
                    .cloneNode(
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


            const toggleButton =
                fragment.querySelector(
                    "[data-past-quiz-toggle]"
                );


            const deleteButton =
                fragment.querySelector(
                    "[data-past-quiz-delete]"
                );


            const details =
                fragment.querySelector(
                    "[data-past-quiz-details]"
                );


            const tableBody =
                fragment.querySelector(
                    "[data-past-quiz-results-body]"
                );


            const playerTotal =
                fragment.querySelector(
                    "[data-past-quiz-player-total]"
                );


            const loading =
                fragment.querySelector(
                    "[data-past-quiz-loading]"
                );


            const empty =
                fragment.querySelector(
                    "[data-past-quiz-empty]"
                );


            const playerCount =
                numberOrZero(

                    session.player_count ??
                    session.players_count ??
                    session.total_players

                );


            if (title) {

                title.textContent =

                    cleanText(

                        session.quiz_title ??
                        session.title

                    ) ||

                    "QUIZ";

            }


            if (meta) {

                meta.textContent =
                    `${formatDate(session.finished_at)} · ${playerCount} ${playerCount === 1 ? "PLAYER" : "PLAYERS"}`;

            }


            if (winner) {

                const winnerUsername =
                    cleanText(

                        session.winner_username ??
                        session.winner?.telegram_username ??
                        session.winner?.username

                    );


                const winnerName =
                    cleanText(

                        session.winner_name ??
                        session.winner?.telegram_name ??
                        session.winner?.name

                    );


                winner.textContent =
                    winnerUsername
                        ? formatTelegramUsername(
                            winnerUsername
                        )
                        : winnerName ||
                        "—";

            }


            if (playerTotal) {

                playerTotal.textContent =
                    `${playerCount} ${playerCount === 1 ? "PLAYER" : "PLAYERS"}`;

            }


            toggleButton?.addEventListener(
                "click",
                () =>

                    openPastQuizDetails(
                        session,
                        details,
                        toggleButton,
                        tableBody,
                        playerTotal,
                        loading,
                        empty
                    )

            );


            deleteButton?.addEventListener(
                "click",
                () =>
                    deletePastQuiz(
                        session,
                        deleteButton
                    )
            );


            pastQuizzesList.appendChild(
                fragment
            );

        }
    );

}


/* =====================================================
   PAST QUIZ EVENTS
===================================================== */

pastQuizPrevPage?.addEventListener(
    "click",
    () => {

        if (pastQuizCurrentPage > 1) {
            pastQuizCurrentPage--;
            renderPastQuizzes();
        }

    }
);


pastQuizNextPage?.addEventListener(
    "click",
    () => {

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    pastQuizSessions.length /
                    PAST_QUIZZES_ITEMS_PER_PAGE
                )
            );

        if (pastQuizCurrentPage < totalPages) {
            pastQuizCurrentPage++;
            renderPastQuizzes();
        }

    }
);


walletVisibilitySwitch?.addEventListener(
    "click",
    () => {

        if (walletVisibilityEnabled === null) {
            return;
        }

        saveWalletVisibility(
            !walletVisibilityEnabled
        );

    }
);


/* =====================================================
   MEMBER EVENTS
===================================================== */

memberSearch?.addEventListener(
    "input",
    () => {

        membersCurrentPage =
            1;


        renderMembers();

    }
);


membersPrevPage?.addEventListener(
    "click",
    () => {

        if (
            membersCurrentPage > 1
        ) {

            membersCurrentPage--;


            renderMembers();

        }

    }
);


membersNextPage?.addEventListener(
    "click",
    () => {

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    getFilteredMembers().length /
                    MEMBERS_ITEMS_PER_PAGE
                )
            );


        if (
            membersCurrentPage <
            totalPages
        ) {

            membersCurrentPage++;


            renderMembers();

        }

    }
);


refreshMembers?.addEventListener(
    "click",
    async () => {

        if (memberSearch) {

            memberSearch.value =
                "";

        }


        await loadAdminData();

    }
);


/* =====================================================
   ALL HOLDERS EVENTS
===================================================== */

allHoldersSearch?.addEventListener(
    "input",
    () => {

        allHoldersCurrentPage =
            1;


        renderAllHolders();

    }
);


allHoldersPrevPage?.addEventListener(
    "click",
    () => {

        if (
            allHoldersCurrentPage >
            1
        ) {

            allHoldersCurrentPage--;


            renderAllHolders();
        }

    }
);


allHoldersNextPage?.addEventListener(
    "click",
    () => {

        const filtered =
            getFilteredAllHolders();


        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    filtered.length /
                    ALL_HOLDERS_ITEMS_PER_PAGE
                )
            );


        if (
            allHoldersCurrentPage <
            totalPages
        ) {

            allHoldersCurrentPage++;


            renderAllHolders();
        }

    }
);


refreshAllHolders?.addEventListener(
    "click",
    async () => {

        await loadAllHolders(
            true
        );

    }
);


/* =====================================================
   CONTEST EVENTS
===================================================== */

openContestPanel?.addEventListener(
    "click",
    async () => {

        setContestViewMode(
            "current"
        );

        selectedPastContestId =
            null;

        await loadContestEntries();

    }
);


contestCurrentTab?.addEventListener(
    "click",
    () => {

        setContestViewMode(
            "current"
        );

        selectedPastContestId =
            null;

        renderContestEntries();

    }
);


contestPastTab?.addEventListener(
    "click",
    async () => {

        setContestViewMode(
            "past"
        );

        await loadPastContestSessions();

    }
);


endContestButton?.addEventListener(
    "click",
    async () => {

        await endCurrentContest();

    }
);


contestSearch?.addEventListener(
    "input",
    () => {

        contestCurrentPage =
            1;


        renderContestEntries();

    }
);


contestSort?.addEventListener(
    "change",
    () => {

        contestCurrentPage =
            1;


        renderContestEntries();

    }
);


contestPrevPage?.addEventListener(
    "click",
    () => {

        if (
            contestCurrentPage > 1
        ) {

            contestCurrentPage--;


            renderContestEntries();

        }

    }
);


contestNextPage?.addEventListener(
    "click",
    () => {

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    getFilteredContestEntries().length /
                    CONTEST_ITEMS_PER_PAGE
                )
            );


        if (
            contestCurrentPage <
            totalPages
        ) {

            contestCurrentPage++;


            renderContestEntries();

        }

    }
);


contestRequirementsYes?.addEventListener(
    "click",
    () =>
        setContestRequirements(
            true
        )
);


contestRequirementsNo?.addEventListener(
    "click",
    () =>
        setContestRequirements(
            false
        )
);


contestEntryForm?.addEventListener(
    "submit",
    saveContestEntry
);


contestCancelEdit?.addEventListener(
    "click",
    resetContestForm
);


/* =====================================================
   QUIZ EVENTS
===================================================== */

addQuizQuestionButton?.addEventListener(
    "click",
    () =>
        openQuizQuestionEditor()
);


quizCorrectButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () =>
                selectQuizCorrectAnswer(
                    button.dataset.correctAnswer
                )
        );

    }
);


quizSaveQuestionButton?.addEventListener(
    "click",
    saveQuizQuestion
);


quizCancelQuestionButton?.addEventListener(
    "click",
    closeQuizQuestionEditor
);


quizDeleteQuestionButton?.addEventListener(
    "click",
    () =>
        deleteQuestionById(
            cleanText(
                quizQuestionEditingId?.value
            )
        )
);


quizResetBuilderButton?.addEventListener(
    "click",
    () => {

        const hasDraft =

            quizDraftQuestions.length >

            0 ||

            !!cleanText(
                quizTitle?.value
            ) ||

            !!cleanText(
                quizDescription?.value
            );


        if (
            !hasDraft ||
            window.confirm(
                "Start a new quiz? Unsaved changes will be cleared."
            )
        ) {

            clearQuizBuilder();

        }

    }
);


quizBuilderForm?.addEventListener(
    "submit",
    saveQuiz
);


quizDuplicateCurrentButton?.addEventListener(
    "click",
    duplicateCurrentQuiz
);


createQuizFromSavedButton?.addEventListener(
    "click",
    () => {

        const hasDraft =

            quizDraftQuestions.length >

            0 ||

            !!cleanText(
                quizTitle?.value
            );


        if (
            !hasDraft ||
            window.confirm(
                "Create a new quiz? Unsaved changes will be cleared."
            )
        ) {

            clearQuizBuilder();


            clickQuizTab(
                "builder"
            );

        }

    }
);


/* =====================================================
   LIVE EVENTS
===================================================== */

openQuizLobbyButton?.addEventListener(
    "click",
    openQuizLobby
);


startQuizButton?.addEventListener(
    "click",
    startLiveQuiz
);


nextQuizQuestionButton?.addEventListener(
    "click",
    nextLiveQuizQuestion
);


finishQuizButton?.addEventListener(
    "click",
    finishLiveQuiz
);


closeQuizLobbyButton?.addEventListener(
    "click",
    closeLiveQuizLobby
);


/* =====================================================
   VISIBILITY
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

        resetContestForm();


        if (contestSort) {

            contestSort.value =
                "newest";

        }


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

        renderHolders();

        renderAllHolders();

        await loadAdminData();


        await loadSavedQuizzes();


        await loadLiveQuizState(
            false
        );


        await loadPastQuizzes();


        startLiveQuizStatePolling();

    }
);