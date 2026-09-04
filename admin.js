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

const GREMBLE_SESSION_KEY =
    "gremble_session_token";

const GREMBLE_SESSION_EXPIRY_KEY =
    "gremble_session_expires_at";

const CONTEST_ITEMS_PER_PAGE = 5;

const MEMBERS_ITEMS_PER_PAGE = 10;


/* =====================================================
   MEMBER ELEMENTS
===================================================== */

const adminMessage =
    document.getElementById("adminMessage");

const adminDashboard =
    document.getElementById("adminDashboard");

const adminIdentity =
    document.getElementById("adminIdentity");

const statTotalMembers =
    document.getElementById("statTotalMembers");

const statCompletedProfiles =
    document.getElementById("statCompletedProfiles");

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
   DATA
===================================================== */

let allMembers = [];

let allContestEntries = [];

let contestLoaded = false;

let contestLoading = false;

let contestSaving = false;

let contestCurrentPage = 1;

let membersCurrentPage = 1;


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


function setAdminIdentity(
    message
) {

    if (!adminIdentity) {
        return;
    }

    adminIdentity.textContent =
        message;
}


/* =====================================================
   CONTEST MESSAGE
===================================================== */

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

    if (
        !Number.isFinite(
            expiry
        )
    ) {

        return null;
    }

    return expiry;
}


function sessionIsExpired() {

    const expiry =
        getSessionExpiry();

    if (!expiry) {
        return false;
    }

    const now =
        Math.floor(
            Date.now() / 1000
        );

    return expiry <= now;
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
   DATE
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
   WALLET FORMAT
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
        wallet.slice(
            0,
            6
        ) +
        "..." +
        wallet.slice(
            -5
        )
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

        await navigator
            .clipboard
            .writeText(
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
   X USERNAME
===================================================== */

function normalizeXUsername(
    value
) {

    let username =
        cleanText(value)
            .toLowerCase();

    if (!username) {
        return "";
    }

    username =
        username.replace(
            /^@+/,
            ""
        );

    username =
        username.replace(
            /\s+/g,
            ""
        );

    return username;
}


/* =====================================================
   COUNTRY FLAG
===================================================== */

function countryCodeToFlag(
    value
) {

    const code =
        cleanText(value)
            .toUpperCase();

    if (
        !/^[A-Z]{2}$/.test(
            code
        )
    ) {

        return "";
    }

    return String.fromCodePoint(
        ...code
            .split("")
            .map(
                letter =>
                    127397 +
                    letter.charCodeAt(0)
            )
    );
}


/* =====================================================
   CREATE COUNTRY CELL
===================================================== */

function createCountryCell(
    member
) {

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


    const countryNameElement =
        document.createElement(
            "span"
        );

    countryNameElement.className =
        "country-name";

    countryNameElement.textContent =
        countryName ||
        countryCode ||
        "UNKNOWN";

    wrapper.appendChild(
        countryNameElement
    );


    if (
        countryCode &&
        countryName
    ) {

        const codeElement =
            document.createElement(
                "span"
            );

        codeElement.className =
            "country-code";

        codeElement.textContent =
            countryCode;

        wrapper.appendChild(
            codeElement
        );
    }


    cell.appendChild(
        wrapper
    );

    return cell;
}


/* =====================================================
   VERIFIED WALLET CELL
===================================================== */

function createVerifiedWalletCell(
    member
) {

    const cell =
        document.createElement(
            "td"
        );

    const hasWallet =
        Boolean(
            cleanText(
                member.wallet_address
            )
        );


    const badge =
        document.createElement(
            "span"
        );

    badge.className =
        hasWallet
            ? "wallet-status-badge yes"
            : "wallet-status-badge no";


    const dot =
        document.createElement(
            "span"
        );

    dot.className =
        "wallet-status-dot";


    const label =
        document.createElement(
            "span"
        );

    label.textContent =
        hasWallet
            ? "YES"
            : "NO";


    badge.appendChild(
        dot
    );

    badge.appendChild(
        label
    );

    cell.appendChild(
        badge
    );

    return cell;
}


/* =====================================================
   TELEGRAM STATUS
===================================================== */

function normalizeTelegramStatus(
    value
) {

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


function getChatStatus(
    member
) {

    return normalizeTelegramStatus(
        member.telegram_chat_status ??
        member.telegram_group_status ??
        member.chat_status
    );
}


function getAnnouncementsStatus(
    member
) {

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
        normalized ===
        "member"
    ) {

        badge.classList.add(
            "member"
        );

        badge.textContent =
            type ===
            "announcements"
                ? "✓ IN ANNOUNCEMENTS"
                : "✓ IN CHAT";
    }

    else if (
        normalized ===
        "not_member"
    ) {

        badge.classList.add(
            "not-member"
        );

        badge.textContent =
            type ===
            "announcements"
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
                    ) ===
                    "member"
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
                    ) ===
                    "member"
            ).length
        );


    const membersWithWallet =
        numberOrZero(
            stats.members_with_wallet ??
            allMembers.filter(
                member =>
                    Boolean(
                        cleanText(
                            member.wallet_address
                        )
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


    if (
        statTelegramChatMembers
    ) {

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


    if (
        statMembersWithWallet
    ) {

        statMembersWithWallet.textContent =
            String(
                membersWithWallet
            );
    }
}


/* =====================================================
   CREATE MEMBER ROW
===================================================== */

function createMemberRow(
    member
) {

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
            telegramUsername.startsWith(
                "@"
            )
                ? telegramUsername
                : `@${telegramUsername}`;

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
            getChatStatus(
                member
            ),
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
            xUsername.startsWith(
                "@"
            )
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


    /* MANUAL SOLANA ADDRESS */

    const solanaCell =
        document.createElement(
            "td"
        );

    if (solanaAddress) {

        const walletWrap =
            document.createElement(
                "div"
            );

        walletWrap.className =
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


        walletWrap.appendChild(
            address
        );

        walletWrap.appendChild(
            copyButton
        );

        solanaCell.appendChild(
            walletWrap
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


    /* JOINED */

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


    /* UPDATED */

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


    /* COUNTRY */

    const countryCell =
        createCountryCell(
            member
        );


    /* VERIFIED WALLET */

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

            const chatStatus =
                getChatStatus(
                    member
                );

            const announcementsStatus =
                getAnnouncementsStatus(
                    member
                );

            const hasVerifiedWallet =
                Boolean(
                    cleanText(
                        member.wallet_address
                    )
                );


            const values = [

                member.telegram_name,

                member.telegram_username,

                member.x_username,

                member.solana_address,

                member.country_code,

                member.country_name,

                member.wallet_address,

                hasVerifiedWallet
                    ? "wallet yes verified connected"
                    : "wallet no not connected",

                chatStatus,

                announcementsStatus

            ];


            return values.some(
                value =>
                    cleanText(
                        value
                    )
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
            membersCurrentPage -
            1
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


/* =====================================================
   MEMBERS PAGINATION
===================================================== */

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
            membersCurrentPage <=
            1;
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


    if (
        status === 401
    ) {

        setAdminIdentity(
            "LOGIN REQUIRED"
        );

        setAdminMessage(
            "YOUR GREMBLE LOGIN SESSION IS MISSING OR EXPIRED. GO BACK TO THE WEBSITE AND LOG IN WITH TELEGRAM.",
            "error"
        );

        return;
    }


    if (
        status === 403
    ) {

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
                    }
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


        if (
            adminDashboard
        ) {

            adminDashboard.hidden =
                false;
        }


        if (
            openContestPanel
        ) {

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
   FIND MEMBER FOR CONTEST
===================================================== */

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
            member => {

                const memberUsername =
                    normalizeXUsername(
                        member.x_username
                    );


                return (
                    memberUsername &&
                    memberUsername ===
                    username
                );
            }
        ) || null
    );
}


/* =====================================================
   CONTEST MEMBER STATUS
===================================================== */

function getContestMemberStatus(
    entry
) {

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


    const inChat =
        chatStatus ===
        "member";


    const inAnnouncements =
        announcementsStatus ===
        "member";


    if (
        inChat ||
        inAnnouncements
    ) {

        let tooltip =
            "VERIFIED + TELEGRAM";


        if (
            inChat &&
            inAnnouncements
        ) {

            tooltip =
                "IN CHAT + ANNOUNCEMENTS";
        }

        else if (inChat) {

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


/* =====================================================
   CREATE CONTEST STATUS
===================================================== */

function createContestMemberStatus(
    entry
) {

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


/* =====================================================
   CONTEST REQUIREMENTS
===================================================== */

function setContestRequirements(
    isVerified
) {

    if (
        contestRequirementsValue
    ) {

        contestRequirementsValue.value =
            isVerified
                ? "true"
                : "false";
    }


    if (
        contestRequirementsYes
    ) {

        contestRequirementsYes.classList.toggle(
            "active",
            isVerified
        );
    }


    if (
        contestRequirementsNo
    ) {

        contestRequirementsNo.classList.toggle(
            "active",
            !isVerified
        );
    }
}


/* =====================================================
   CONTEST STATS
===================================================== */

function updateContestStats() {

    const total =
        allContestEntries.length;


    const verified =
        allContestEntries.filter(
            entry =>
                entry.requirements_ok ===
                true
        ).length;


    if (
        contestTotalEntries
    ) {

        contestTotalEntries.textContent =
            String(
                total
            );
    }


    if (
        contestVerifiedEntries
    ) {

        contestVerifiedEntries.textContent =
            String(
                verified
            );
    }
}


/* =====================================================
   FILTER CONTEST
===================================================== */

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


/* =====================================================
   SORT CONTEST
===================================================== */

function sortContestEntries(
    entries
) {

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
        (
            a,
            b
        ) => {

            const dateA =
                new Date(
                    a.created_at
                ).getTime() || 0;


            const dateB =
                new Date(
                    b.created_at
                ).getTime() || 0;


            const pointsA =
                numberOrZero(
                    a.points
                );


            const pointsB =
                numberOrZero(
                    b.points
                );


            const rulesA =
                a.requirements_ok ===
                true
                    ? 1
                    : 0;


            const rulesB =
                b.requirements_ok ===
                true
                    ? 1
                    : 0;


            if (
                sortMode ===
                "oldest"
            ) {

                return (
                    dateA -
                    dateB
                );
            }


            if (
                sortMode ===
                "points-high"
            ) {

                return (
                    pointsB -
                    pointsA ||
                    dateB -
                    dateA
                );
            }


            if (
                sortMode ===
                "points-low"
            ) {

                return (
                    pointsA -
                    pointsB ||
                    dateB -
                    dateA
                );
            }


            if (
                sortMode ===
                "rules-yes"
            ) {

                return (
                    rulesB -
                    rulesA ||
                    dateB -
                    dateA
                );
            }


            if (
                sortMode ===
                "rules-no"
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


    return sorted;
}


/* =====================================================
   CREATE CONTEST ROW
===================================================== */

function createContestRow(
    entry
) {

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


        link.className =
            "contest-link";


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


    const requirementsOk =
        entry.requirements_ok ===
        true;


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


    /* ADDED */

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

    if (
        !contestTableBody
    ) {

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
            contestCurrentPage -
            1
        ) *
        CONTEST_ITEMS_PER_PAGE;


    const endIndex =
        startIndex +
        CONTEST_ITEMS_PER_PAGE;


    const pageEntries =
        sorted.slice(
            startIndex,
            endIndex
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


    if (
        contestEntriesLabel
    ) {

        const hasSearch =
            Boolean(
                cleanText(
                    contestSearch?.value
                )
            );


        if (hasSearch) {

            contestEntriesLabel.textContent =
                `${totalFiltered} ${
                    totalFiltered === 1
                        ? "MATCH"
                        : "MATCHES"
                }`;
        }

        else {

            contestEntriesLabel.textContent =
                `${allContestEntries.length} ${
                    allContestEntries.length === 1
                        ? "ENTRY"
                        : "ENTRIES"
                }`;
        }
    }


    if (
        contestEmpty
    ) {

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


/* =====================================================
   CONTEST PAGINATION
===================================================== */

function updateContestPagination(
    totalFiltered,
    totalPages
) {

    if (
        !contestPagination
    ) {

        return;
    }


    contestPagination.hidden =
        totalFiltered <=
        CONTEST_ITEMS_PER_PAGE;


    if (
        contestPageInfo
    ) {

        contestPageInfo.textContent =
            `${contestCurrentPage} OF ${totalPages}`;
    }


    if (
        contestPrevPage
    ) {

        contestPrevPage.disabled =
            contestCurrentPage <=
            1;
    }


    if (
        contestNextPage
    ) {

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
   RESET CONTEST FORM
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


    if (
        contestSubmitButton
    ) {

        contestSubmitButton.textContent =
            "+ ADD PARTICIPANT";
    }


    if (
        contestCancelEdit
    ) {

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


/* =====================================================
   START CONTEST EDIT
===================================================== */

function startContestEdit(
    entry
) {

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
        entry.requirements_ok ===
        true
    );


    if (
        contestSubmitButton
    ) {

        contestSubmitButton.textContent =
            "SAVE CHANGES";
    }


    if (
        contestCancelEdit
    ) {

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
        `EDITING ${
            cleanText(
                entry.participant
            ) ||
            "PARTICIPANT"
        }`
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
        }
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

    catch {

        result =
            null;
    }


    if (
        response.status ===
        401
    ) {

        clearLocalSession();

        throw new Error(
            "YOUR SESSION HAS EXPIRED. LOG IN AGAIN."
        );
    }


    if (
        response.status ===
        403
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

    if (
        contestLoading
    ) {

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
            `${allContestEntries.length} CONTEST ${
                allContestEntries.length === 1
                    ? "ENTRY"
                    : "ENTRIES"
            } LOADED.`,
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

async function saveContestEntry(
    event
) {

    event.preventDefault();


    if (
        contestSaving
    ) {

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
        contestRequirementsValue
            ?.value ===
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
            parsedUrl.protocol !==
                "https:" &&
            parsedUrl.protocol !==
                "http:"
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
        !Number.isInteger(
            points
        ) ||
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


    if (
        contestSubmitButton
    ) {

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


        if (
            contestSubmitButton
        ) {

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

async function deleteContestEntry(
    entry
) {

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


/* =====================================================
   OPEN CONTEST
===================================================== */

async function openContest() {

    if (
        !contestPanel
    ) {

        return;
    }


    contestPanel.hidden =
        false;


    await loadContestEntries();


    contestPanel.scrollIntoView(
        {
            behavior:
                "smooth",

            block:
                "start"
        }
    );
}


/* =====================================================
   CLOSE CONTEST
===================================================== */

function closeContest() {

    if (
        !contestPanel
    ) {

        return;
    }


    contestPanel.hidden =
        true;


    resetContestForm();
}


/* =====================================================
   EVENTS - MEMBERS
===================================================== */

if (
    memberSearch
) {

    memberSearch.addEventListener(
        "input",
        filterMembers
    );
}


if (
    membersPrevPage
) {

    membersPrevPage.addEventListener(
        "click",
        goToPreviousMembersPage
    );
}


if (
    membersNextPage
) {

    membersNextPage.addEventListener(
        "click",
        goToNextMembersPage
    );
}


if (
    refreshMembers
) {

    refreshMembers.addEventListener(
        "click",
        async () => {

            if (
                memberSearch
            ) {

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
   EVENTS - CONTEST PANEL
===================================================== */

if (
    openContestPanel
) {

    openContestPanel.disabled =
        true;


    openContestPanel.addEventListener(
        "click",
        openContest
    );
}


if (
    closeContestPanel
) {

    closeContestPanel.addEventListener(
        "click",
        closeContest
    );
}


/* =====================================================
   EVENTS - CONTEST SEARCH
===================================================== */

if (
    contestSearch
) {

    contestSearch.addEventListener(
        "input",
        filterContestEntries
    );
}


if (
    contestSort
) {

    contestSort.addEventListener(
        "change",
        changeContestSort
    );
}


/* =====================================================
   EVENTS - CONTEST PAGINATION
===================================================== */

if (
    contestPrevPage
) {

    contestPrevPage.addEventListener(
        "click",
        goToPreviousContestPage
    );
}


if (
    contestNextPage
) {

    contestNextPage.addEventListener(
        "click",
        goToNextContestPage
    );
}


/* =====================================================
   EVENTS - CONTEST RULES
===================================================== */

if (
    contestRequirementsYes
) {

    contestRequirementsYes.addEventListener(
        "click",
        () => {

            setContestRequirements(
                true
            );
        }
    );
}


if (
    contestRequirementsNo
) {

    contestRequirementsNo.addEventListener(
        "click",
        () => {

            setContestRequirements(
                false
            );
        }
    );
}


/* =====================================================
   EVENTS - CONTEST FORM
===================================================== */

if (
    contestEntryForm
) {

    contestEntryForm.addEventListener(
        "submit",
        saveContestEntry
    );
}


if (
    contestCancelEdit
) {

    contestCancelEdit.addEventListener(
        "click",
        () => {

            resetContestForm();
        }
    );
}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        resetContestForm();


        if (
            contestSort
        ) {

            contestSort.value =
                "newest";
        }


        membersCurrentPage =
            1;


        loadAdminData();
    }
);