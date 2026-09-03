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
    document.getElementById("statTelegramChatMembers");

const statTelegramAnnouncementsMembers =
    document.getElementById(
        "statTelegramAnnouncementsMembers"
    );


const memberSearch =
    document.getElementById("memberSearch");

const refreshMembers =
    document.getElementById("refreshMembers");

const membersTableBody =
    document.getElementById("membersTableBody");

const membersEmpty =
    document.getElementById("membersEmpty");


/* =====================================================
   CONTEST ELEMENTS
===================================================== */

const openContestPanel =
    document.getElementById("openContestPanel");

const closeContestPanel =
    document.getElementById("closeContestPanel");

const contestPanel =
    document.getElementById("contestPanel");


const contestTotalEntries =
    document.getElementById("contestTotalEntries");

const contestVerifiedEntries =
    document.getElementById("contestVerifiedEntries");

const contestEntriesLabel =
    document.getElementById("contestEntriesLabel");


const contestEntryForm =
    document.getElementById("contestEntryForm");

const contestEntryId =
    document.getElementById("contestEntryId");

const contestParticipant =
    document.getElementById("contestParticipant");

const contestMemeUrl =
    document.getElementById("contestMemeUrl");

const contestPoints =
    document.getElementById("contestPoints");

const contestRequirementsYes =
    document.getElementById("contestRequirementsYes");

const contestRequirementsNo =
    document.getElementById("contestRequirementsNo");

const contestRequirementsValue =
    document.getElementById(
        "contestRequirementsValue"
    );

const contestSubmitButton =
    document.getElementById("contestSubmitButton");

const contestCancelEdit =
    document.getElementById("contestCancelEdit");

const contestFormMessage =
    document.getElementById("contestFormMessage");

const contestTableBody =
    document.getElementById("contestTableBody");

const contestEmpty =
    document.getElementById("contestEmpty");


/* =====================================================
   DATA
===================================================== */

let allMembers = [];

let allContestEntries = [];

let contestLoaded = false;

let contestLoading = false;

let contestSaving = false;


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
        !Number.isFinite(expiry)
    ) {
        return null;
    }

    return expiry;

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

    /*
       If expiry is not stored locally,
       let the secure backend verify it.
    */

    if (!expiry) {
        return false;
    }

    const nowSeconds =
        Math.floor(
            Date.now() / 1000
        );

    return expiry <= nowSeconds;

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
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
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
   MEMBER STATUS NORMALIZATION
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


/* =====================================================
   GET TELEGRAM CHAT STATUS
===================================================== */

function getChatStatus(member) {

    return normalizeTelegramStatus(
        member.telegram_chat_status ??
        member.telegram_group_status ??
        member.chat_status
    );

}


/* =====================================================
   GET TELEGRAM ANNOUNCEMENTS STATUS
===================================================== */

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
                    getChatStatus(member) ===
                    "member"
            ).length
        );


    const announcementsMembers =
        numberOrZero(
            stats.telegram_announcements_members ??
            stats.announcements_members ??
            allMembers.filter(
                member =>
                    getAnnouncementsStatus(member) ===
                    "member"
            ).length
        );


    if (statTotalMembers) {

        statTotalMembers.textContent =
            String(totalMembers);

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


    /* ==========================================
       TELEGRAM NAME
    ========================================== */

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


    /* ==========================================
       TELEGRAM USERNAME
    ========================================== */

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


    /* ==========================================
       GREMBLE CHAT
    ========================================== */

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


    /* ==========================================
       GREMBLE ANNOUNCEMENTS
    ========================================== */

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


    /* ==========================================
       X USERNAME
    ========================================== */

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


    /* ==========================================
       SOLANA ADDRESS
    ========================================== */

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


    /* ==========================================
       JOINED
    ========================================== */

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


    /* ==========================================
       UPDATED
    ========================================== */

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


    /* ==========================================
       BUILD ROW
    ========================================== */

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


    return row;

}


/* =====================================================
   RENDER MEMBERS
===================================================== */

function renderMembers(
    members
) {

    if (!membersTableBody) {
        return;
    }

    membersTableBody.innerHTML =
        "";


    const list =
        Array.isArray(members)
            ? members
            : [];


    if (
        list.length === 0
    ) {

        if (membersEmpty) {

            membersEmpty.hidden =
                false;

        }

        return;

    }


    if (membersEmpty) {

        membersEmpty.hidden =
            true;

    }


    const fragment =
        document.createDocumentFragment();


    list.forEach(
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


/* =====================================================
   MEMBER SEARCH
===================================================== */

function filterMembers() {

    const search =
        cleanText(
            memberSearch?.value
        ).toLowerCase();


    if (!search) {

        renderMembers(
            allMembers
        );

        return;

    }


    const filtered =
        allMembers.filter(
            member => {

                const chatStatus =
                    getChatStatus(
                        member
                    );

                const announcementsStatus =
                    getAnnouncementsStatus(
                        member
                    );


                const values = [

                    member.telegram_name,

                    member.telegram_username,

                    member.x_username,

                    member.solana_address,

                    chatStatus,

                    announcementsStatus,

                    chatStatus === "member"
                        ? "in chat"
                        : "",

                    chatStatus === "not_member"
                        ? "not in chat"
                        : "",

                    announcementsStatus === "member"
                        ? "in announcements"
                        : "",

                    announcementsStatus === "not_member"
                        ? "not in announcements"
                        : ""

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


    renderMembers(
        filtered
    );

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
   LOAD ADMIN MEMBERS
===================================================== */

async function loadAdminData() {

    const token =
        getSessionToken();


    /* ==========================================
       NO LOGIN
    ========================================== */

    if (!token) {

        showAccessError(
            401
        );

        return;

    }


    /* ==========================================
       LOCAL EXPIRY
    ========================================== */

    if (
        sessionIsExpired()
    ) {

        clearLocalSession();

        showAccessError(
            401
        );

        return;

    }


    /* ==========================================
       LOADING
    ========================================== */

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
                    method: "GET",

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


        /* ==========================================
           UNAUTHORIZED
        ========================================== */

        if (
            response.status === 401
        ) {

            clearLocalSession();

            showAccessError(
                401
            );

            return;

        }


        /* ==========================================
           NOT ADMIN
        ========================================== */

        if (
            response.status === 403
        ) {

            showAccessError(
                403
            );

            return;

        }


        /* ==========================================
           ERROR
        ========================================== */

        if (
            !response.ok ||
            !result?.success
        ) {

            throw new Error(
                result?.error ||
                "Could not load admin data."
            );

        }


        /* ==========================================
           SUCCESS
        ========================================== */

        allMembers =
            Array.isArray(
                result.members
            )
                ? result.members
                : [];


        updateStats(
            result.stats || {}
        );


        renderMembers(
            allMembers
        );


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
            `ACCESS GRANTED — ${allMembers.length} GREMBLE MEMBER${allMembers.length === 1 ? "" : "S"} LOADED. TELEGRAM CHAT AND ANNOUNCEMENTS CHECKED.`,
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
   CONTEST REQUIREMENTS
===================================================== */

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


    if (contestTotalEntries) {

        contestTotalEntries.textContent =
            String(total);

    }


    if (contestVerifiedEntries) {

        contestVerifiedEntries.textContent =
            String(verified);

    }


    if (contestEntriesLabel) {

        contestEntriesLabel.textContent =
            `${total} ${total === 1 ? "ENTRY" : "ENTRIES"}`;

    }

}


/* =====================================================
   CONTEST EMPTY STATE
===================================================== */

function updateContestEmptyState() {

    if (!contestEmpty) {
        return;
    }

    contestEmpty.hidden =
        allContestEntries.length > 0;

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


    /* ==========================================
       PARTICIPANT
    ========================================== */

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
        ) || "—";

    participantCell.appendChild(
        participant
    );


    /* ==========================================
       MEME LINK
    ========================================== */

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


    /* ==========================================
       POINTS
    ========================================== */

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


    /* ==========================================
       RULES
    ========================================== */

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


    /* ==========================================
       ADDED
    ========================================== */

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


    /* ==========================================
       ACTIONS
    ========================================== */

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


    /* ==========================================
       BUILD
    ========================================== */

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


    return row;

}


/* =====================================================
   RENDER CONTEST
===================================================== */

function renderContestEntries() {

    if (!contestTableBody) {
        return;
    }


    contestTableBody.innerHTML =
        "";


    const sorted =
        [...allContestEntries]
            .sort(
                (a, b) => {

                    const pointsDifference =
                        numberOrZero(
                            b.points
                        ) -
                        numberOrZero(
                            a.points
                        );

                    if (
                        pointsDifference !== 0
                    ) {
                        return pointsDifference;
                    }

                    return (
                        new Date(
                            b.created_at
                        ).getTime() -
                        new Date(
                            a.created_at
                        ).getTime()
                    );

                }
            );


    const fragment =
        document.createDocumentFragment();


    sorted.forEach(
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


    updateContestStats();

    updateContestEmptyState();

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


    contestPanel?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

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
        contestRequirementsValue?.value ===
        "true";

    const editingId =
        Number(
            contestEntryId?.value
        );


    /* ==========================================
       VALIDATION
    ========================================== */

    if (!participant) {

        setContestMessage(
            "ENTER PARTICIPANT NAME OR USERNAME.",
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
   OPEN CONTEST PANEL
===================================================== */

async function openContest() {

    /*
       The button is only enabled after
       admin-members has verified this user.
    */

    if (!contestPanel) {
        return;
    }


    contestPanel.hidden =
        false;


    contestPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    await loadContestEntries();

}


/* =====================================================
   CLOSE CONTEST PANEL
===================================================== */

function closeContest() {

    if (!contestPanel) {
        return;
    }


    contestPanel.hidden =
        true;


    resetContestForm();

}


/* =====================================================
   MEMBER SEARCH EVENT
===================================================== */

if (memberSearch) {

    memberSearch.addEventListener(
        "input",
        filterMembers
    );

}


/* =====================================================
   MEMBER REFRESH EVENT
===================================================== */

if (refreshMembers) {

    refreshMembers.addEventListener(
        "click",
        async () => {

            if (memberSearch) {

                memberSearch.value =
                    "";

            }


            await loadAdminData();

        }
    );

}


/* =====================================================
   OPEN CONTEST EVENT
===================================================== */

if (openContestPanel) {

    /*
       Disabled immediately.
       It becomes enabled only after
       secure admin verification succeeds.
    */

    openContestPanel.disabled =
        true;


    openContestPanel.addEventListener(
        "click",
        openContest
    );

}


/* =====================================================
   CLOSE CONTEST EVENT
===================================================== */

if (closeContestPanel) {

    closeContestPanel.addEventListener(
        "click",
        closeContest
    );

}


/* =====================================================
   CONTEST YES
===================================================== */

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


/* =====================================================
   CONTEST NO
===================================================== */

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


/* =====================================================
   CONTEST FORM
===================================================== */

if (contestEntryForm) {

    contestEntryForm.addEventListener(
        "submit",
        saveContestEntry
    );

}


/* =====================================================
   CANCEL CONTEST EDIT
===================================================== */

if (contestCancelEdit) {

    contestCancelEdit.addEventListener(
        "click",
        () => {

            resetContestForm();

        }
    );

}


/* =====================================================
   START ADMIN PANEL
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        resetContestForm();

        loadAdminData();

    }
);