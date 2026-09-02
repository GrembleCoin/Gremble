/* =====================================================
   GREMBLE ADMIN PANEL
   File: admin.js
===================================================== */


/* =====================================================
   CONFIG
===================================================== */

const ADMIN_MEMBERS_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/admin-members";

const GREMBLE_SESSION_KEY =
    "gremble_session_token";

const GREMBLE_SESSION_EXPIRY_KEY =
    "gremble_session_expires_at";


/* =====================================================
   ELEMENTS
===================================================== */

const adminMessage =
    document.getElementById("adminMessage");

const adminDashboard =
    document.getElementById("adminDashboard");

const adminIdentity =
    document.getElementById("adminIdentity");


const statTotalMembers =
    document.getElementById("statTotalMembers");

const statMembersWithX =
    document.getElementById("statMembersWithX");

const statMembersWithSolana =
    document.getElementById("statMembersWithSolana");

const statCompletedProfiles =
    document.getElementById("statCompletedProfiles");

const statTelegramGroupMembers =
    document.getElementById("statTelegramGroupMembers");

const statTelegramGroupNonMembers =
    document.getElementById("statTelegramGroupNonMembers");

const statTelegramGroupUnknown =
    document.getElementById("statTelegramGroupUnknown");


const memberSearch =
    document.getElementById("memberSearch");

const refreshMembers =
    document.getElementById("refreshMembers");

const membersTableBody =
    document.getElementById("membersTableBody");

const membersEmpty =
    document.getElementById("membersEmpty");


/* =====================================================
   DATA
===================================================== */

let allMembers = [];


/* =====================================================
   HELPERS
===================================================== */

function cleanText(value) {
    return typeof value === "string"
        ? value.trim()
        : "";
}


function setAdminMessage(
    message,
    type = ""
) {
    if (!adminMessage) return;

    adminMessage.textContent =
        message;

    adminMessage.classList.remove(
        "success",
        "error"
    );

    if (type) {
        adminMessage.classList.add(type);
    }
}


function setAdminIdentity(message) {
    if (!adminIdentity) return;

    adminIdentity.textContent =
        message;
}


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

    if (!Number.isFinite(expiry)) {
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
        Ak expiry neexistuje,
        necháme token overiť serverom.
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

    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =====================================================
   SHORT WALLET
===================================================== */

function shortWallet(address) {
    const value =
        cleanText(address);

    if (!value) {
        return "";
    }

    if (value.length <= 16) {
        return value;
    }

    return (
        value.slice(0, 7) +
        "..." +
        value.slice(-6)
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

    if (!text) return;

    const oldText =
        button?.textContent || "COPY";

    try {
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(
                text
            );
        }
        else {
            const temp =
                document.createElement(
                    "textarea"
                );

            temp.value =
                text;

            temp.style.position =
                "fixed";

            temp.style.opacity =
                "0";

            temp.style.pointerEvents =
                "none";

            document.body.appendChild(
                temp
            );

            temp.focus();
            temp.select();

            document.execCommand(
                "copy"
            );

            temp.remove();
        }

        if (button) {
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
            "Copy error:",
            error
        );

        if (button) {
            button.textContent =
                "FAILED";

            setTimeout(
                () => {
                    button.textContent =
                        oldText;
                },
                1200
            );
        }
    }
}


/* =====================================================
   STATS
===================================================== */

function updateStats(stats) {
    const safeStats =
        stats || {};

    if (statTotalMembers) {
        statTotalMembers.textContent =
            Number(
                safeStats.total_members || 0
            );
    }

    if (statMembersWithX) {
        statMembersWithX.textContent =
            Number(
                safeStats.members_with_x || 0
            );
    }

    if (statMembersWithSolana) {
        statMembersWithSolana.textContent =
            Number(
                safeStats.members_with_solana || 0
            );
    }

    if (statCompletedProfiles) {
        statCompletedProfiles.textContent =
            Number(
                safeStats.completed_profiles || 0
            );
    }

    if (statTelegramGroupMembers) {
        statTelegramGroupMembers.textContent =
            Number(
                safeStats.telegram_group_members || 0
            );
    }

    if (statTelegramGroupNonMembers) {
        statTelegramGroupNonMembers.textContent =
            Number(
                safeStats.telegram_group_non_members || 0
            );
    }

    if (statTelegramGroupUnknown) {
        statTelegramGroupUnknown.textContent =
            Number(
                safeStats.telegram_group_unknown || 0
            );
    }
}


/* =====================================================
   TELEGRAM GROUP BADGE
===================================================== */

function createTelegramGroupBadge(status) {
    const badge =
        document.createElement(
            "span"
        );

    badge.className =
        "telegram-group-badge";

    if (status === "member") {
        badge.classList.add(
            "member"
        );

        badge.textContent =
            "✓ IN GROUP";

        return badge;
    }

    if (status === "not_member") {
        badge.classList.add(
            "not-member"
        );

        badge.textContent =
            "✕ NOT IN GROUP";

        return badge;
    }

    badge.classList.add(
        "unknown"
    );

    badge.textContent =
        "? UNKNOWN";

    return badge;
}


/* =====================================================
   CREATE TABLE ROW
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

    const telegramGroupStatus =
        cleanText(
            member.telegram_group_status
        ).toLowerCase();

    const xUsername =
        cleanText(
            member.x_username
        );

    const solanaAddress =
        cleanText(
            member.solana_address
        );


    const displayTelegramUsername =
        telegramUsername
            ? (
                telegramUsername.startsWith("@")
                    ? telegramUsername
                    : `@${telegramUsername}`
            )
            : "";


    const displayXUsername =
        xUsername
            ? (
                xUsername.startsWith("@")
                    ? xUsername
                    : `@${xUsername}`
            )
            : "";


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

    if (displayTelegramUsername) {
        const value =
            document.createElement(
                "span"
            );

        value.className =
            "telegram-username";

        value.textContent =
            displayTelegramUsername;

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
       TELEGRAM GROUP
    ========================================== */

    const telegramGroupCell =
        document.createElement(
            "td"
        );

    telegramGroupCell.appendChild(
        createTelegramGroupBadge(
            telegramGroupStatus
        )
    );


    /* ==========================================
       X USERNAME
    ========================================== */

    const xUsernameCell =
        document.createElement(
            "td"
        );

    if (displayXUsername) {
        const xWrap =
            document.createElement(
                "div"
            );

        xWrap.className =
            "wallet-cell";


        const value =
            document.createElement(
                "span"
            );

        value.className =
            "x-username";

        value.textContent =
            displayXUsername;


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
                    displayXUsername,
                    copyButton
                );
            }
        );


        xWrap.appendChild(
            value
        );

        xWrap.appendChild(
            copyButton
        );

        xUsernameCell.appendChild(
            xWrap
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
       SOLANA
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
        telegramGroupCell
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

function renderMembers(members) {
    if (!membersTableBody) {
        return;
    }

    membersTableBody.innerHTML =
        "";

    const list =
        Array.isArray(members)
            ? members
            : [];

    if (list.length === 0) {
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
   SEARCH
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

                const status =
                    cleanText(
                        member.telegram_group_status
                    ).toLowerCase();

                let statusText =
                    status;

                if (status === "member") {
                    statusText +=
                        " in group telegram";
                }

                if (status === "not_member") {
                    statusText +=
                        " not in group telegram";
                }

                if (status === "unknown") {
                    statusText +=
                        " unknown telegram";
                }

                const values = [
                    member.telegram_name,
                    member.telegram_username,
                    statusText,
                    member.x_username,
                    member.solana_address
                ];

                return values.some(
                    value =>
                        cleanText(value)
                            .toLowerCase()
                            .includes(search)
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
       LOCAL EXPIRY CHECK
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
        "VERIFYING YOUR TELEGRAM ID AND CHECKING GREMBLE CHAT MEMBERSHIP..."
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
           OTHER ERROR
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
            result.stats
        );


        renderMembers(
            allMembers
        );


        if (adminDashboard) {
            adminDashboard.hidden =
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
   SEARCH EVENT
===================================================== */

if (memberSearch) {
    memberSearch.addEventListener(
        "input",
        filterMembers
    );
}


/* =====================================================
   REFRESH EVENT
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
   START ADMIN PANEL
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadAdminData();
    }
);