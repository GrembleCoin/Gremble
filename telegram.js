/* =====================================================
   GREMBLE TELEGRAM LOGIN
   File: telegram.js
===================================================== */


/* =====================================================
   CONFIG
===================================================== */

const TELEGRAM_LOGIN_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/telegram-login";

const MEMBER_PROFILE_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/member-profile";

const GREMBLE_SESSION_KEY =
    "gremble_session_token";

const GREMBLE_SESSION_EXPIRY_KEY =
    "gremble_session_expires_at";


/* =====================================================
   ELEMENTS
===================================================== */

const telegramLoginStatus =
    document.getElementById(
        "telegramLoginStatus"
    );

const telegramWidgetWrap =
    document.getElementById(
        "telegramWidgetWrap"
    );

const memberProfile =
    document.getElementById(
        "memberProfile"
    );

const memberTelegramName =
    document.getElementById(
        "memberTelegramName"
    );

const memberTelegramUsername =
    document.getElementById(
        "memberTelegramUsername"
    );

const memberXUsername =
    document.getElementById(
        "memberXUsername"
    );

const memberSolanaAddress =
    document.getElementById(
        "memberSolanaAddress"
    );

const memberSaveButton =
    document.getElementById(
        "memberSaveButton"
    );

const memberLogoutButton =
    document.getElementById(
        "memberLogoutButton"
    );


/* =====================================================
   HELPERS
===================================================== */

function cleanText(value) {

    return typeof value === "string"
        ? value.trim()
        : "";
}


function normalizeXUsername(value) {

    const username =
        cleanText(value);

    if (!username) {
        return "";
    }

    return username.startsWith("@")
        ? username
        : `@${username}`;
}


function setTelegramStatus(
    message,
    type = ""
) {

    if (!telegramLoginStatus) {
        return;
    }

    telegramLoginStatus.textContent =
        message;

    telegramLoginStatus.classList.remove(
        "loading",
        "error",
        "success"
    );

    if (type) {

        telegramLoginStatus.classList.add(
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

    if (!Number.isFinite(expiry)) {
        return null;
    }

    return expiry;
}


function saveSession(
    token,
    expiresAt
) {

    if (!token) {
        return;
    }

    localStorage.setItem(
        GREMBLE_SESSION_KEY,
        token
    );

    if (
        expiresAt !== undefined &&
        expiresAt !== null
    ) {

        localStorage.setItem(
            GREMBLE_SESSION_EXPIRY_KEY,
            String(expiresAt)
        );
    }
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

    return expiry <= nowSeconds;
}


/* =====================================================
   MEMBER UI
===================================================== */

function showVerifiedMember(member) {

    if (
        !member ||
        !memberProfile
    ) {
        return;
    }

    const telegramName =
        cleanText(
            member.telegram_name
        ) || "Telegram member";

    const telegramUsername =
        cleanText(
            member.telegram_username
        );


    if (memberTelegramName) {

        memberTelegramName.textContent =
            telegramName;
    }


    if (memberTelegramUsername) {

        memberTelegramUsername.textContent =
            telegramUsername
                ? `@${telegramUsername.replace(/^@/, "")}`
                : "Telegram username not available";
    }


    if (memberXUsername) {

        memberXUsername.value =
            normalizeXUsername(
                member.x_username || ""
            );

        memberXUsername.disabled =
            false;
    }


    if (memberSolanaAddress) {

        memberSolanaAddress.value =
            cleanText(
                member.solana_address || ""
            );

        memberSolanaAddress.disabled =
            false;
    }


    if (memberSaveButton) {

        memberSaveButton.disabled =
            false;
    }


    memberProfile.hidden =
        false;


    if (telegramWidgetWrap) {

        telegramWidgetWrap.style.display =
            "none";
    }
}


function hideMemberProfile() {

    if (memberProfile) {

        memberProfile.hidden =
            true;
    }


    if (memberTelegramName) {

        memberTelegramName.textContent =
            "Telegram member";
    }


    if (memberTelegramUsername) {

        memberTelegramUsername.textContent =
            "";
    }


    if (memberXUsername) {

        memberXUsername.value =
            "";
    }


    if (memberSolanaAddress) {

        memberSolanaAddress.value =
            "";
    }


    if (telegramWidgetWrap) {

        telegramWidgetWrap.style.display =
            "";
    }
}


/* =====================================================
   AUTHENTICATED REQUEST
===================================================== */

async function memberRequest(
    method = "GET",
    body = null
) {

    const token =
        getSessionToken();


    if (!token) {

        throw new Error(
            "Please connect Telegram first."
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
        ] = "application/json";

        options.body =
            JSON.stringify(body);
    }


    const response =
        await fetch(
            MEMBER_PROFILE_ENDPOINT,
            options
        );


    let result =
        null;


    try {

        result =
            await response.json();

    } catch {

        result =
            null;
    }


    if (!response.ok) {

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            clearLocalSession();
        }


        throw new Error(
            result?.error ||
            "Could not load your profile."
        );
    }


    return result;
}


/* =====================================================
   TELEGRAM LOGIN CALLBACK
===================================================== */

window.onTelegramAuth =
async function onTelegramAuth(user) {

    if (
        !user ||
        typeof user !== "object"
    ) {

        setTelegramStatus(
            "Telegram did not return valid login information.",
            "error"
        );

        return;
    }


    setTelegramStatus(
        "VERIFYING TELEGRAM LOGIN...",
        "loading"
    );


    if (memberSaveButton) {

        memberSaveButton.disabled =
            true;
    }


    try {

        const response =
            await fetch(
                TELEGRAM_LOGIN_ENDPOINT,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(user)
                }
            );


        let result =
            null;


        try {

            result =
                await response.json();

        } catch {

            result =
                null;
        }


        if (
            !response.ok ||
            !result?.success
        ) {

            throw new Error(
                result?.error ||
                "Telegram verification failed."
            );
        }


        if (!result.session_token) {

            throw new Error(
                "Secure session was not created."
            );
        }


        saveSession(
            result.session_token,
            result.expires_at
        );


        showVerifiedMember(
            result.member
        );


        setTelegramStatus(
            "TELEGRAM VERIFIED — WELCOME TO GREMBLE.",
            "success"
        );


    } catch (error) {

        console.error(
            "Telegram login error:",
            error
        );


        clearLocalSession();


        if (memberSaveButton) {

            memberSaveButton.disabled =
                false;
        }


        setTelegramStatus(
            error?.message ||
            "Could not verify Telegram login.",
            "error"
        );
    }
};


/* =====================================================
   LOAD SAVED PROFILE
===================================================== */

async function restoreMemberSession() {

    const token =
        getSessionToken();


    if (!token) {

        hideMemberProfile();

        return;
    }


    if (sessionIsExpired()) {

        clearLocalSession();

        hideMemberProfile();

        setTelegramStatus(
            "YOUR SESSION EXPIRED — CONNECT TELEGRAM AGAIN."
        );

        return;
    }


    setTelegramStatus(
        "LOADING YOUR GREMBLE PROFILE...",
        "loading"
    );


    try {

        const result =
            await memberRequest(
                "GET"
            );


        if (!result?.member) {

            throw new Error(
                "Profile could not be loaded."
            );
        }


        showVerifiedMember(
            result.member
        );


        setTelegramStatus(
            "TELEGRAM CONNECTED.",
            "success"
        );


    } catch (error) {

        console.error(
            "Profile restore error:",
            error
        );


        clearLocalSession();

        hideMemberProfile();


        setTelegramStatus(
            "CONNECT TELEGRAM TO ACCESS YOUR PROFILE."
        );
    }
}


/* =====================================================
   SAVE PROFILE
===================================================== */

async function saveMemberProfile() {

    const xUsername =
        cleanText(
            memberXUsername?.value || ""
        );

    const solanaAddress =
        cleanText(
            memberSolanaAddress?.value || ""
        );


    if (!xUsername) {

        setTelegramStatus(
            "ENTER YOUR X USERNAME.",
            "error"
        );

        memberXUsername?.focus();

        return;
    }


    if (!solanaAddress) {

        setTelegramStatus(
            "ENTER YOUR SOLANA ADDRESS.",
            "error"
        );

        memberSolanaAddress?.focus();

        return;
    }


    if (memberSaveButton) {

        memberSaveButton.disabled =
            true;

        memberSaveButton.textContent =
            "SAVING...";
    }


    setTelegramStatus(
        "SAVING YOUR PROFILE...",
        "loading"
    );


    try {

        const result =
            await memberRequest(
                "POST",
                {
                    x_username:
                        xUsername,

                    solana_address:
                        solanaAddress
                }
            );


        if (!result?.member) {

            throw new Error(
                "Profile was not returned after saving."
            );
        }


        showVerifiedMember(
            result.member
        );


        setTelegramStatus(
            "PROFILE SAVED.",
            "success"
        );


    } catch (error) {

        console.error(
            "Profile save error:",
            error
        );


        if (!getSessionToken()) {

            hideMemberProfile();
        }


        setTelegramStatus(
            error?.message ||
            "Could not save your profile.",
            "error"
        );


    } finally {

        if (memberSaveButton) {

            memberSaveButton.disabled =
                false;

            memberSaveButton.textContent =
                "SAVE PROFILE";
        }
    }
}


/* =====================================================
   LOG OUT
===================================================== */

function logoutMember() {

    /*
       IMPORTANT:
       This ONLY removes the login session
       from this browser.

       It does NOT delete the member
       from the Supabase database.

       Telegram, X and Solana details
       remain safely stored.
    */

    clearLocalSession();

    hideMemberProfile();


    setTelegramStatus(
        "LOGGED OUT — CONNECT TELEGRAM TO ACCESS YOUR PROFILE.",
        "success"
    );
}


/* =====================================================
   BUTTON EVENTS
===================================================== */

if (memberSaveButton) {

    memberSaveButton.addEventListener(
        "click",
        saveMemberProfile
    );
}


if (memberLogoutButton) {

    memberLogoutButton.addEventListener(
        "click",
        logoutMember
    );
}


/* =====================================================
   ENTER KEY
===================================================== */

[
    memberXUsername,
    memberSolanaAddress
].forEach(input => {

    if (!input) {
        return;
    }


    input.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Enter") {
                return;
            }


            event.preventDefault();

            saveMemberProfile();
        }
    );
});


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        restoreMemberSession();
    }
);