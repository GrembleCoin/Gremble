/* =====================================================
   GREMBLE TELEGRAM LOGIN + SECURE MEMBER PROFILE
   FILE: telegram.js
===================================================== */


/* =====================================================
   EDGE FUNCTION URLS
===================================================== */

const TELEGRAM_LOGIN_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/telegram-login";

const MEMBER_PROFILE_ENDPOINT =
    "https://tffzjqeckoezursrvcpw.supabase.co/functions/v1/member-profile";


/* =====================================================
   SESSION STORAGE
===================================================== */

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

const memberComing =
    document.querySelector(
        ".member-coming"
    );


/* =====================================================
   STATUS MESSAGE
===================================================== */

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
   TEXT HELPERS
===================================================== */

function cleanText(value) {

    if (
        typeof value !== "string"
    ) {
        return "";
    }

    return value.trim();

}


function normalizeXUsername(value) {

    const username =
        cleanText(value);

    if (!username) {
        return "";
    }

    if (
        username.startsWith("@")
    ) {
        return username;
    }

    return `@${username}`;

}


/* =====================================================
   SESSION HELPERS
===================================================== */

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

    if (expiresAt) {
        localStorage.setItem(
            GREMBLE_SESSION_EXPIRY_KEY,
            String(expiresAt)
        );
    }

}


function getSessionToken() {

    const token =
        localStorage.getItem(
            GREMBLE_SESSION_KEY
        );

    const expiresAt =
        Number(
            localStorage.getItem(
                GREMBLE_SESSION_EXPIRY_KEY
            )
        );

    if (!token) {
        return "";
    }

    if (
        expiresAt &&
        Number.isFinite(expiresAt)
    ) {

        const now =
            Math.floor(
                Date.now() / 1000
            );

        if (expiresAt <= now) {

            clearSession();

            return "";

        }

    }

    return token;

}


function clearSession() {

    localStorage.removeItem(
        GREMBLE_SESSION_KEY
    );

    localStorage.removeItem(
        GREMBLE_SESSION_EXPIRY_KEY
    );

}


/* =====================================================
   ENABLE / DISABLE PROFILE EDITING
===================================================== */

function setProfileEditingEnabled(
    enabled
) {

    if (memberXUsername) {
        memberXUsername.disabled =
            !enabled;
    }

    if (memberSolanaAddress) {
        memberSolanaAddress.disabled =
            !enabled;
    }

    if (memberSaveButton) {
        memberSaveButton.disabled =
            !enabled;
    }

    if (memberComing) {

        if (enabled) {

            memberComing.textContent =
                "YOUR PROFILE IS PRIVATE AND CAN ONLY BE UPDATED BY YOU.";

        }
        else {

            memberComing.textContent =
                "PROFILE EDITING REQUIRES A SECURE LOGIN SESSION.";

        }

    }

}


/* =====================================================
   SHOW VERIFIED MEMBER
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
        ) || "Gremble Member";


    const telegramUsername =
        cleanText(
            member.telegram_username
        );


    if (memberTelegramName) {

        memberTelegramName.textContent =
            telegramName;

    }


    if (memberTelegramUsername) {

        if (telegramUsername) {

            memberTelegramUsername.textContent =
                `@${telegramUsername.replace(
                    /^@/,
                    ""
                )}`;

        }
        else {

            memberTelegramUsername.textContent =
                "Telegram username not available";

        }

    }


    if (memberXUsername) {

        memberXUsername.value =
            normalizeXUsername(
                member.x_username || ""
            );

    }


    if (memberSolanaAddress) {

        memberSolanaAddress.value =
            cleanText(
                member.solana_address || ""
            );

    }


    memberProfile.hidden =
        false;


    if (telegramWidgetWrap) {

        telegramWidgetWrap.style.display =
            "none";

    }

}


/* =====================================================
   LOAD MEMBER PROFILE FROM SESSION
===================================================== */

async function loadMemberProfile() {

    const token =
        getSessionToken();

    if (!token) {

        setProfileEditingEnabled(
            false
        );

        return false;

    }


    try {

        setTelegramStatus(
            "LOADING YOUR PROFILE...",
            "loading"
        );


        const response =
            await fetch(
                MEMBER_PROFILE_ENDPOINT,
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

            clearSession();

            setProfileEditingEnabled(
                false
            );

            return false;

        }


        if (
            !response.ok ||
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result?.error ||
                "Could not load profile."
            );

        }


        showVerifiedMember(
            result.member
        );


        setProfileEditingEnabled(
            true
        );


        setTelegramStatus(
            "TELEGRAM VERIFIED — WELCOME TO GREMBLE.",
            "success"
        );


        return true;

    }
    catch (error) {

        console.error(
            "Profile load error:",
            error
        );


        setTelegramStatus(
            error?.message ||
            "Could not load your profile.",
            "error"
        );


        setProfileEditingEnabled(
            false
        );


        return false;

    }

}


/* =====================================================
   TELEGRAM CALLBACK

   Telegram Widget calls:
   onTelegramAuth(user)
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

        }
        catch {

            result =
                null;

        }


        if (
            !response.ok ||
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result?.error ||
                "Telegram verification failed."
            );

        }


        if (
            !result.session_token
        ) {

            throw new Error(
                "Secure session was not created."
            );

        }


        saveSession(
            result.session_token,
            result.session_expires_at
        );


        showVerifiedMember(
            result.member
        );


        setProfileEditingEnabled(
            true
        );


        setTelegramStatus(
            "TELEGRAM VERIFIED — WELCOME TO GREMBLE.",
            "success"
        );


        console.log(
            "Telegram login successful."
        );

    }
    catch (error) {


        console.error(
            "Telegram login error:",
            error
        );


        clearSession();


        setProfileEditingEnabled(
            false
        );


        setTelegramStatus(
            error?.message ||
            "Could not verify Telegram login.",
            "error"
        );

    }

};


/* =====================================================
   SAVE PROFILE
===================================================== */

async function saveMemberProfile() {

    const token =
        getSessionToken();


    if (!token) {

        setTelegramStatus(
            "YOUR SESSION EXPIRED. PLEASE LOG IN AGAIN.",
            "error"
        );

        setProfileEditingEnabled(
            false
        );

        return;

    }


    const xUsername =
        memberXUsername
            ? cleanText(
                memberXUsername.value
            )
            : "";


    const solanaAddress =
        memberSolanaAddress
            ? cleanText(
                memberSolanaAddress.value
            )
            : "";


    if (
        xUsername &&
        !/^@?[A-Za-z0-9_]{1,15}$/.test(
            xUsername
        )
    ) {

        setTelegramStatus(
            "ENTER A VALID X USERNAME.",
            "error"
        );

        return;

    }


    if (
        solanaAddress &&
        !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(
            solanaAddress
        )
    ) {

        setTelegramStatus(
            "ENTER A VALID SOLANA ADDRESS.",
            "error"
        );

        return;

    }


    try {


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


        const response =
            await fetch(
                MEMBER_PROFILE_ENDPOINT,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            x_username:
                                xUsername,

                            solana_address:
                                solanaAddress

                        })

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

            clearSession();

            setProfileEditingEnabled(
                false
            );


            throw new Error(
                "Your session expired. Please log in again."
            );

        }


        if (
            !response.ok ||
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result?.error ||
                "Could not save profile."
            );

        }


        showVerifiedMember(
            result.member
        );


        setTelegramStatus(
            "PROFILE SAVED SUCCESSFULLY.",
            "success"
        );


    }
    catch (error) {


        console.error(
            "Profile save error:",
            error
        );


        setTelegramStatus(
            error?.message ||
            "Could not save your profile.",
            "error"
        );

    }
    finally {


        if (memberSaveButton) {

            memberSaveButton.textContent =
                "SAVE PROFILE";


            if (
                getSessionToken()
            ) {

                memberSaveButton.disabled =
                    false;

            }

        }

    }

}


/* =====================================================
   SAVE BUTTON EVENT
===================================================== */

if (memberSaveButton) {

    memberSaveButton.addEventListener(
        "click",
        saveMemberProfile
    );

}


/* =====================================================
   INITIAL STATE
===================================================== */

setProfileEditingEnabled(
    false
);


/* =====================================================
   RESTORE EXISTING SESSION

   If user already logged in before,
   try loading their profile automatically.
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const token =
            getSessionToken();


        if (token) {

            const loaded =
                await loadMemberProfile();


            if (!loaded) {

                if (telegramWidgetWrap) {

                    telegramWidgetWrap.style.display =
                        "";

                }

            }

        }
        else {

            setTelegramStatus(
                "LOGIN WITH TELEGRAM TO CONTINUE"
            );

        }

    }
);